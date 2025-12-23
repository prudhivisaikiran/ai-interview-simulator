import SkillAssessment from '../models/SkillAssessment.js';
import InterviewSession from '../models/InterviewSession.js';

const SKILL_TAXONOMY = {
    frontend: [
        'HTML/CSS',
        'JavaScript',
        'React',
        'Web Performance',
        'Communication',
        'Problem Solving',
    ],
    backend: [
        'Node.js',
        'API Design',
        'Database (SQL/NoSQL)',
        'System Design',
        'Communication',
        'Problem Solving',
    ],
    ml: [
        'Machine Learning',
        'Python',
        'Data Processing',
        'Model Evaluation',
        'Communication',
        'Problem Solving',
    ],
    sde: [
        'DSA',
        'System Design',
        'Coding Patterns',
        'Optimization',
        'Communication',
        'Problem Solving',
    ],
};

const DEFAULT_SCORE = 50;
const WEIGHT_OLD = 0.7;
const WEIGHT_NEW = 0.3;

const getRoleSkills = (role) => SKILL_TAXONOMY[role] || SKILL_TAXONOMY['sde'];

const generateRecommendations = (skill, score) => {
    if (score >= 80) return null; // No recommendation needed for strong skills

    // Basic template-based recommendations
    // In a real app, this would be more dynamic or AI-generated
    return {
        quickFix: `Review 5-minute refresher on ${skill} core concepts.`,
        buildStrength: `Build a small module utilizing ${skill}.`,
        interviewReady: `Practice 3 mock interview questions specifically about ${skill}.`,
    };
};

export const updateAssessment = async (sessionId, detectedSkills) => {
    const session = await InterviewSession.findById(sessionId);
    if (!session) return null;

    let assessment = await SkillAssessment.findOne({ sessionId });

    if (!assessment) {
        // Initialize if not exists
        assessment = await SkillAssessment.create({
            sessionId,
            skills: [],
            radar: { labels: [], values: [] },
            recommendations: { quickFix: [], buildStrength: [], interviewReady: [] }
        });
    }

    // 1. Update Specific Skills from AI Detection
    detectedSkills.forEach((newSkill) => {
        // Normalize name (simple casing)
        const normalizedName = newSkill.name.trim(); // Could use fuzzy matching in future

        const existingIndex = assessment.skills.findIndex(
            (s) => s.name.toLowerCase() === normalizedName.toLowerCase()
        );

        if (existingIndex > -1) {
            // Weighted Update
            const oldScore = assessment.skills[existingIndex].score;
            const newScore = Math.round(oldScore * WEIGHT_OLD + newSkill.strengthScore * WEIGHT_NEW);
            assessment.skills[existingIndex].score = newScore;
            assessment.skills[existingIndex].notes = newSkill.notes || assessment.skills[existingIndex].notes;
        } else {
            // Add New
            assessment.skills.push({
                name: normalizedName,
                score: newSkill.strengthScore,
                notes: newSkill.gapReason || '',
            });
        }
    });

    // 2. Compute Radar Data (Taxonomy Alignment)
    const roleLabels = getRoleSkills(session.role);
    const radarValues = roleLabels.map((label) => {
        // Find matching skill in our populated skills list
        // Simple substring matching or exact match
        const match = assessment.skills.find(s =>
            s.name.toLowerCase().includes(label.toLowerCase()) ||
            label.toLowerCase().includes(s.name.toLowerCase())
        );
        return match ? match.score : DEFAULT_SCORE;
    });

    assessment.radar = {
        labels: roleLabels,
        values: radarValues,
    };

    // 3. Generate Recommendations for Gaps (< 60)
    const quickFix = [];
    const buildStrength = [];
    const interviewReady = [];

    assessment.skills.forEach(skill => {
        if (skill.score < 60) {
            const recs = generateRecommendations(skill.name, skill.score);
            if (recs) {
                quickFix.push(`${skill.name}: ${recs.quickFix}`);
                buildStrength.push(`${skill.name}: ${recs.buildStrength}`);
                interviewReady.push(`${skill.name}: ${recs.interviewReady}`);
            }
        }
    });

    assessment.recommendations = {
        quickFix: quickFix.slice(0, 5), // Limit to top 5
        buildStrength: buildStrength.slice(0, 5),
        interviewReady: interviewReady.slice(0, 5)
    };

    await assessment.save();
    return assessment;
};
