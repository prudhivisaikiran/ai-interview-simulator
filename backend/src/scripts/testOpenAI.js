import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

console.log("---------------------------------------------------");
console.log("Testing OpenAI Connection...");
console.log("API Key found:", !!apiKey);
if (apiKey) {
    console.log("API Key starts with:", apiKey.substring(0, 10) + "...");
}
console.log("---------------------------------------------------");

if (!apiKey) {
    console.error("❌ ERROR: OPENAI_API_KEY is missing in .env");
    process.exit(1);
}

const openai = new OpenAI({ apiKey });

async function test() {
    try {
        console.log("Sending test request to OpenAI (gpt-4o-mini)...");
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: "Say 'Hello from OpenAI' if you can hear me." }],
            model: "gpt-4o-mini",
        });

        console.log("✅ SUCCESS! OpenAI responded:");
        console.log("Response:", completion.choices[0].message.content);
    } catch (error) {
        console.error("❌ FAILED to connect to OpenAI.");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);

        if (error.code === 'insufficient_quota') {
            console.error("⚠️  Reason: You have run out of credits or have no payment method added.");
        } else if (error.code === 'invalid_api_key') {
            console.error("⚠️  Reason: The API Key is invalid.");
        }
    }
}

test();
