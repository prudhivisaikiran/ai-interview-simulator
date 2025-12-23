import mongoose from 'mongoose';

const questionBankSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ['frontend', 'backend', 'ml', 'sde'],
            required: true,
            index: true,
        },
        difficulty: {
            type: String,
            enum: ['junior', 'mid', 'senior'],
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['technical', 'behavioral'],
            required: true,
        },
        questionText: {
            type: String,
            required: true,
        },
        expectedTopics: [String],
        rubric: {
            correctness: String,
            clarity: String,
            confidence: String,
        },
    },
    {
        timestamps: true,
    }
);

const QuestionBank = mongoose.model('QuestionBank', questionBankSchema);

export default QuestionBank;
