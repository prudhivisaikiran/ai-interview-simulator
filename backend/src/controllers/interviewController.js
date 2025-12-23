import InterviewSession from '../models/InterviewSession.js';
import InterviewTurn from '../models/InterviewTurn.js';
import SkillAssessment from '../models/SkillAssessment.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { generateInterviewResponse } from '../services/aiService.js';
import { updateAssessment } from '../services/assessmentService.js';
import { generatePDFReport } from '../services/reportService.js';

// SINGLE SOURCE OF TRUTH: Count questions from InterviewTurn documents
const getQuestionCount = async (sessionId) => {
    return await InterviewTurn.countDocuments({
        sessionId,
        type: 'question'
    });
};

export const createSession = catchAsync(async (req, res, next) => {
    const { role, difficulty, mode, length } = req.body;

    // Map length to maxQuestions
    let maxQuestions = null; // default: unlimited
    if (length === 'quick') maxQuestions = 5;
    else if (length === 'full') maxQuestions = 10;
    else if (length === 'deep') maxQuestions = 15;

    const session = await InterviewSession.create({
        userId: req.user._id,
        role,
        difficulty,
        mode,
        maxQuestions,
    });

    res.status(201).json({
        status: 'success',
        data: {
            session,
        },
    });
});

export const getSessions = catchAsync(async (req, res, next) => {
    const sessions = await InterviewSession.find({ userId: req.user._id }).sort({
        createdAt: -1,
    });

    res.status(200).json({
        status: 'success',
        results: sessions.length,
        data: {
            sessions,
        },
    });
});

export const getSession = catchAsync(async (req, res, next) => {
    const session = await InterviewSession.findOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!session) {
        return next(new AppError('No session found with that ID', 404));
    }

    const turns = await InterviewTurn.find({ sessionId: session._id }).sort({
        createdAt: 1,
    });

    // Get actual question count for display
    const questionCount = await getQuestionCount(session._id);

    // Update session with current count
    session.questionCount = questionCount;

    res.status(200).json({
        status: 'success',
        data: {
            session,
            turns,
        },
    });
});

export const startSession = catchAsync(async (req, res, next) => {
    const session = await InterviewSession.findOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!session) {
        return next(new AppError('No session found with that ID', 404));
    }

    // Check if session is already completed
    if (session.isCompleted) {
        return next(new AppError('This session has already been completed', 400));
    }

    // Count existing questions (should be 0 for start)
    const qCount = await getQuestionCount(session._id);

    // Check if we've already hit the limit (edge case: restart attempt)
    if (session.maxQuestions !== null && qCount >= session.maxQuestions) {
        session.isCompleted = true;
        session.completedAt = new Date();
        session.status = 'completed';
        await session.save();

        return res.status(200).json({
            status: 'success',
            data: {
                completed: true,
                message: 'Interview completed',
                nextQuestion: null
            }
        });
    }

    // Generate First Question via AI (No history yet)
    const aiResponse = await generateInterviewResponse({
        role: session.role,
        difficulty: session.difficulty,
        mode: session.mode,
        history: [],
        lastAnswer: null
    });

    // Create "question" turn
    const turn = await InterviewTurn.create({
        sessionId: session._id,
        type: 'question',
        content: aiResponse.question,
        meta: {},
    });

    // Update questionCount for display (optional, but helpful)
    session.questionCount = qCount + 1;
    await session.save();

    res.status(200).json({
        status: 'success',
        data: {
            turn,
        },
    });
});

export const answerTurn = catchAsync(async (req, res, next) => {
    const { answerText } = req.body;

    const session = await InterviewSession.findOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!session) {
        return next(new AppError('No session found with that ID', 404));
    }

    // Check if session is already completed
    if (session.isCompleted) {
        return next(new AppError('This session has already been completed', 400));
    }

    // 1. Save Answer Turn
    const answerTurn = await InterviewTurn.create({
        sessionId: session._id,
        type: 'answer',
        content: answerText,
    });

    // 2. Fetch History logic
    const historyTurns = await InterviewTurn.find({ sessionId: session._id })
        .sort({ createdAt: 1 })
        // Exclude the answer we JUST created to avoid duplicate if we pass it as 'lastAnswer'
        .limit((await InterviewTurn.countDocuments({ sessionId: session._id })) - 1);


    // 3. Call AI Service
    const aiResponse = await generateInterviewResponse({
        role: session.role,
        difficulty: session.difficulty,
        mode: session.mode,
        history: historyTurns,
        lastAnswer: answerText
    });

    // 4. Update Skill Assessment
    if (aiResponse.detectedSkills && aiResponse.detectedSkills.length > 0) {
        await updateAssessment(session._id, aiResponse.detectedSkills);
    }

    // 5. Save Feedback Turn
    const feedbackTurn = await InterviewTurn.create({
        sessionId: session._id,
        type: 'feedback',
        content: aiResponse.evaluation.feedback,
        meta: {
            scores: {
                correctness: aiResponse.evaluation.correctness,
                clarity: aiResponse.evaluation.clarity,
                confidence: aiResponse.evaluation.confidence,
            },
            detectedSkills: aiResponse.detectedSkills
        },
    });

    // 6. CRITICAL: Count questions BEFORE deciding to generate next question
    const qCount = await getQuestionCount(session._id);

    // Temporary debug log (remove after verification)
    console.log(`[DEBUG] Session ${session._id}: maxQuestions=${session.maxQuestions}, qCount=${qCount}`);

    // Check if we've reached the question limit
    const shouldComplete = session.maxQuestions !== null && qCount >= session.maxQuestions;

    if (shouldComplete) {
        // Calculate summary scores from all feedback turns
        const allFeedback = await InterviewTurn.find({
            sessionId: session._id,
            type: 'feedback'
        });

        let avgCorrectness = 0, avgClarity = 0, avgConfidence = 0;
        if (allFeedback.length > 0) {
            const totals = allFeedback.reduce((acc, turn) => {
                acc.correctness += turn.meta?.scores?.correctness || 0;
                acc.clarity += turn.meta?.scores?.clarity || 0;
                acc.confidence += turn.meta?.scores?.confidence || 0;
                return acc;
            }, { correctness: 0, clarity: 0, confidence: 0 });

            avgCorrectness = Math.round(totals.correctness / allFeedback.length);
            avgClarity = Math.round(totals.clarity / allFeedback.length);
            avgConfidence = Math.round(totals.confidence / allFeedback.length);
        }

        const overallScore = Math.round((avgCorrectness + avgClarity + avgConfidence) / 3);

        // Mark session as completed
        session.isCompleted = true;
        session.completedAt = new Date();
        session.status = 'completed';
        session.overallScore = overallScore;
        session.questionCount = qCount;
        await session.save();

        return res.status(200).json({
            status: 'success',
            data: {
                answerTurn,
                feedbackTurn,
                nextQuestionTurn: null,
                completed: true,
                message: 'Interview completed',
                summary: {
                    avgCorrectness,
                    avgClarity,
                    avgConfidence,
                    overallScore
                }
            },
        });
    }

    // 7. Generate next question if not completed
    const nextQuestionTurn = await InterviewTurn.create({
        sessionId: session._id,
        type: 'question',
        content: aiResponse.question,
    });

    // Update question count for display
    session.questionCount = qCount + 1;
    await session.save();

    res.status(200).json({
        status: 'success',
        data: {
            answerTurn,
            feedbackTurn,
            nextQuestionTurn,
            completed: false
        },
    });
});

export const getAssessment = catchAsync(async (req, res, next) => {
    const session = await InterviewSession.findOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!session) {
        return next(new AppError('No session found with that ID', 404));
    }

    let assessment = await SkillAssessment.findOne({ sessionId: session._id });

    // If no assessment exists, return fallback data based on role taxonomy
    if (!assessment) {
        const SKILL_TAXONOMY = {
            frontend: ['HTML/CSS', 'JavaScript', 'React', 'Web Performance', 'Communication', 'Problem Solving'],
            backend: ['Node.js', 'API Design', 'Database (SQL/NoSQL)', 'System Design', 'Communication', 'Problem Solving'],
            ml: ['Machine Learning', 'Python', 'Data Processing', 'Model Evaluation', 'Communication', 'Problem Solving'],
            sde: ['DSA', 'System Design', 'Coding Patterns', 'Optimization', 'Communication', 'Problem Solving'],
        };

        const roleLabels = SKILL_TAXONOMY[session.role] || SKILL_TAXONOMY['sde'];
        const defaultValues = roleLabels.map(() => 50); // Default baseline score

        return res.status(200).json({
            status: 'success',
            data: {
                radar: {
                    labels: roleLabels,
                    values: defaultValues
                },
                skills: roleLabels.map(label => ({
                    name: label,
                    score: 50,
                    notes: 'Not yet evaluated'
                })),
                gaps: [],
                recommendations: {
                    quickFix: ['Review your last feedback and rewrite answers more clearly.'],
                    buildStrength: ['Practice 5 questions focused on your weakest 2 skills.'],
                    interviewReady: ['Run 2 full-length mock interviews and compare score trends.']
                }
            }
        });
    }

    // Ensure proper structure even if assessment exists
    const responseData = {
        radar: assessment.radar || { labels: [], values: [] },
        skills: assessment.skills || [],
        gaps: [], // Computed from skills with score < 60
        recommendations: assessment.recommendations || {
            quickFix: [],
            buildStrength: [],
            interviewReady: []
        }
    };

    // Compute gaps from skills
    if (assessment.skills && assessment.skills.length > 0) {
        responseData.gaps = assessment.skills
            .filter(skill => skill.score < 60)
            .slice(0, 3) // Top 3 gaps
            .map(skill => ({
                skill: skill.name,
                reason: skill.notes || `Score: ${skill.score}/100`
            }));
    }

    // Ensure recommendations have at least fallback items
    if (responseData.recommendations.quickFix.length === 0) {
        responseData.recommendations.quickFix = ['Review your last feedback and rewrite answers more clearly.'];
    }
    if (responseData.recommendations.buildStrength.length === 0) {
        responseData.recommendations.buildStrength = ['Practice 5 questions focused on your weakest 2 skills.'];
    }
    if (responseData.recommendations.interviewReady.length === 0) {
        responseData.recommendations.interviewReady = ['Run 2 full-length mock interviews and compare score trends.'];
    }

    res.status(200).json({
        status: 'success',
        data: responseData,
    });
});

export const getReport = catchAsync(async (req, res, next) => {
    const session = await InterviewSession.findOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!session) {
        return next(new AppError('No session found with that ID', 404));
    }

    // Fetch all related data
    const turns = await InterviewTurn.find({ sessionId: session._id }).sort({ createdAt: 1 });
    const assessment = await SkillAssessment.findOne({ sessionId: session._id });

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
        'Content-Disposition',
        `attachment; filename=interview-report-${session._id}.pdf`
    );

    generatePDFReport(session, req.user, turns, assessment, res);
});
