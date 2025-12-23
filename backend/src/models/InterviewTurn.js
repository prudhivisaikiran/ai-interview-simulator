import mongoose from 'mongoose';

const interviewTurnSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InterviewSession',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['question', 'answer', 'feedback'],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        meta: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

const InterviewTurn = mongoose.model('InterviewTurn', interviewTurnSchema);

export default InterviewTurn;
