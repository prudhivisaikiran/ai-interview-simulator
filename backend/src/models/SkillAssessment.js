import mongoose from 'mongoose';

const skillAssessmentSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InterviewSession',
            required: true,
            unique: true,
        },
        skills: [
            {
                name: String,
                score: Number, // 0-100
                notes: String,
            },
        ],
        radar: {
            labels: [String],
            values: [Number],
        },
        recommendations: {
            quickFix: [String],
            buildStrength: [String],
            interviewReady: [String],
        },
    },
    {
        timestamps: true,
    }
);

const SkillAssessment = mongoose.model(
    'SkillAssessment',
    skillAssessmentSchema
);

export default SkillAssessment;
