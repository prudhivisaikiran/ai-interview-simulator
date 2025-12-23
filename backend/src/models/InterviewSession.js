import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        role: {
            type: String,
            enum: ['frontend', 'backend', 'ml', 'sde'],
            required: true,
        },
        difficulty: {
            type: String,
            enum: ['junior', 'mid', 'senior'],
            required: true,
        },
        mode: {
            type: String,
            enum: ['technical', 'behavioral', 'mixed'],
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'completed'],
            default: 'active',
        },
        maxQuestions: {
            type: Number,
            default: null, // null = unlimited
        },
        questionCount: {
            type: Number,
            default: 0,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        completedAt: Date,
        startedAt: {
            type: Date,
            default: Date.now,
        },
        endedAt: Date,
        overallScore: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const InterviewSession = mongoose.model(
    'InterviewSession',
    interviewSessionSchema
);

export default InterviewSession;
