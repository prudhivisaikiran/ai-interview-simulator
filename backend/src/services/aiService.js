import OpenAI from 'openai';
import AppError from '../utils/AppError.js';

let openai;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL,
    });
}

const getSystemPrompt = (role, difficulty, mode) => {
    return `You are an expert technical interviewer conducting a ${difficulty} level ${mode} interview for a ${role} position.

YOUR GOAL:
1. Conduct a rigorous, realistic technical interview.
2. Evaluate the candidate's responses based on correctness, clarity, and confidence.
3. Identify specific technical skills demonstrated or missing.

RULES:
- Do NOT reveal the correct answer directly if the candidate is wrong. Instead, hint or ask a follow-up.
- Be concise. Do not lecture.
- Adapts the difficulty dynamically. If they are doing well, ask harder questions.
- If the answer is empty or "I don't know", penalize confidence to 0 and provide a new easier question.

OUTPUT FORMAT:
You must respond in valid JSON format ONLY. 
Structure:
{
  "evaluation": {
    "correctness": number (0-10),
    "clarity": number (0-10),
    "confidence": number (0-10),
    "feedback": "string (brief feedback on the LAST answer)"
  },
  "detectedSkills": [
    { "name": "string (e.g. React Hooks)", "strengthScore": number (0-100), "gapReason": "string (optional)" }
  ],
  "question": "string (the NEXT question to ask)"
}
`;
};

export const generateInterviewResponse = async ({
    role,
    difficulty,
    mode,
    history,
    lastAnswer,
}) => {
    if (!openai) {
        // Fallback for when API key is missing (dev mode)
        console.warn('OPENAI_API_KEY missing, using mock response');
        return {
            question: "Mock Question: OpenAI key is missing. Please add it to .env. What is 2+2?",
            evaluation: { correctness: 0, clarity: 0, confidence: 0, feedback: "API Key missing" },
            detectedSkills: []
        };
    }

    try {
        const systemPrompt = getSystemPrompt(role, difficulty, mode);

        // Convert DB history to OpenAI format
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.map(turn => ({
                role: turn.type === 'question' ? 'assistant' : 'user',
                content: turn.content
            })),
        ];

        // Add the latest user answer if it exists (for the "Answer" step)
        if (lastAnswer) {
            messages.push({ role: 'user', content: lastAnswer });
        } else {
            // Initial start
            messages.push({ role: 'user', content: "I am ready to start the interview." });
        }

        const completion = await openai.chat.completions.create({
            model: process.env.AI_MODEL || "gpt-4-turbo-preview", // or gpt-3.5-turbo if 4o-mini not available
            messages: messages,
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const responseContent = completion.choices[0].message.content;

        try {
            const parsedData = JSON.parse(responseContent);

            // Validate structure
            if (!parsedData.evaluation || !parsedData.question) {
                console.error("Malformed AI Response (missing keys):", parsedData);
                // Attempt to repair or fallback
                if (!parsedData.evaluation) {
                    parsedData.evaluation = { correctness: 5, clarity: 5, confidence: 5, feedback: "Could not generate detailed feedback." };
                }
                if (!parsedData.question) {
                    parsedData.question = "Could you elaborate on that?";
                }
            }

            return parsedData;
        } catch (parseError) {
            console.error("Failed to parse AI JSON:", responseContent);
            throw new AppError("AI response was malformed", 502);
        }

    } catch (error) {
        console.error("AI Service Error:", error);
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to communicate with AI service", 503);
    }
};
