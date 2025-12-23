import mongoose from 'mongoose';
import dotenv from 'dotenv';
import QuestionBank from '../models/QuestionBank.js';
import connectDB from '../config/db.js';

dotenv.config({ path: './.env' }); // Adjust path if running from root

const questions = [
    // JUNIOR FRONTEND
    {
        role: 'frontend',
        difficulty: 'junior',
        type: 'technical',
        questionText: 'What is the Virtual DOM in React and why is it faster?',
        expectedTopics: ['diffing algorithm', 'batch updates', 'in-memory representation'],
        rubric: {
            correctness: 'Must mention it is an in-memory copy of the actual DOM',
            clarity: 'Should explain that direct DOM manipulation is slow',
            confidence: 'Clear about the concept'
        }
    },
    {
        role: 'frontend',
        difficulty: 'junior',
        type: 'technical',
        questionText: 'Explain the difference between let, const, and var.',
        expectedTopics: ['scope', 'hoisting', 'reassignment'],
    },
    {
        role: 'frontend',
        difficulty: 'junior',
        type: 'technical',
        questionText: 'What are React Hooks? Name two common ones.',
        expectedTopics: ['useState', 'useEffect', 'functional components'],
    },
    {
        role: 'frontend',
        difficulty: 'junior',
        type: 'behavioral',
        questionText: 'Describe a time you got stuck on a bug. How did you solve it?',
        expectedTopics: ['debugging', 'research', 'asking for help'],
    },

    // MID FRONTEND
    {
        role: 'frontend',
        difficulty: 'mid',
        type: 'technical',
        questionText: 'How does React handle state management in complex applications?',
        expectedTopics: ['Context API', 'Redux/Zustand', 'prop drilling'],
    },
    {
        role: 'frontend',
        difficulty: 'mid',
        type: 'technical',
        questionText: 'Explain the concept of closures in JavaScript.',
        expectedTopics: ['lexical scope', 'data privacy', 'function returning function'],
    },
    {
        role: 'frontend',
        difficulty: 'mid',
        type: 'behavioral',
        questionText: 'How do you handle disagreements with a designer about implementation feasibility?',
        expectedTopics: ['communication', 'compromise', 'technical constraints'],
    },

    // JUNIOR BACKEND
    {
        role: 'backend',
        difficulty: 'junior',
        type: 'technical',
        questionText: 'What is the difference between SQL and NoSQL databases?',
        expectedTopics: ['schema', 'scaling', 'relational vs document'],
    },
    {
        role: 'backend',
        difficulty: 'junior',
        type: 'technical',
        questionText: 'Explain how middleware works in Express.js.',
        expectedTopics: ['request/response cycle', 'next()', 'error handling'],
    },
    {
        role: 'backend',
        difficulty: 'junior',
        type: 'technical',
        questionText: 'What are HTTP status codes? Give examples of 2xx, 4xx, and 5xx.',
        expectedTopics: ['200 OK', '404 Not Found', '500 Server Error'],
    },
    {
        role: 'backend',
        difficulty: 'junior',
        type: 'behavioral',
        questionText: 'Tell me about a project you are proud of. What did you build?',
        expectedTopics: ['passion', 'technical details', 'outcome'],
    },

    // MID BACKEND
    {
        role: 'backend',
        difficulty: 'mid',
        type: 'technical',
        questionText: 'How would you handle authentication and authorization in a REST API?',
        expectedTopics: ['JWT', 'Sessions', 'RBAC', 'OAuth'],
    },
    {
        role: 'backend',
        difficulty: 'mid',
        type: 'technical',
        questionText: 'Explain the Event Loop in Node.js.',
        expectedTopics: ['call stack', 'callback queue', 'non-blocking I/O'],
    },
    {
        role: 'backend',
        difficulty: 'mid',
        type: 'behavioral',
        questionText: 'Describe a situation where you had to optimize a slow database query.',
        expectedTopics: ['indexing', 'query analysis', 'caching'],
    },

    // ML / SDE (Mixed)
    {
        role: 'ml',
        difficulty: 'junior',
        type: 'technical',
        questionText: 'What is overfitting in machine learning and how do you prevent it?',
        expectedTopics: ['regularization', 'more data', 'cross-validation'],
    },
    {
        role: 'ml',
        difficulty: 'mid',
        type: 'technical',
        questionText: 'Explain the difference between supervised and unsupervised learning.',
        expectedTopics: ['labeled data', 'clustering', 'regression'],
    },
    {
        role: 'sde',
        difficulty: 'junior',
        type: 'technical',
        questionText: 'What is Big O notation? Why is it important?',
        expectedTopics: ['complexity', 'efficiency', 'scalability'],
    },
    {
        role: 'sde',
        difficulty: 'mid',
        type: 'technical',
        questionText: 'Design a URL shortener like Bit.ly. What are the key components?',
        expectedTopics: ['hashing', 'database choice', 'redirection'],
    },
    {
        role: 'sde',
        difficulty: 'mid',
        type: 'behavioral',
        questionText: 'How do you prioritize tasks when you have tight deadlines?',
        expectedTopics: ['impact', 'communication', 'time management'],
    },

    // More questions to reach 25+
    { role: 'frontend', difficulty: 'senior', type: 'technical', questionText: 'Discuss simple vs complex state management.', expectedTopics: [] },
    { role: 'backend', difficulty: 'senior', type: 'technical', questionText: 'Microservices vs Monolith architectures?', expectedTopics: [] },
    { role: 'ml', difficulty: 'junior', type: 'technical', questionText: 'Explain gradient descent.', expectedTopics: [] },
    { role: 'sde', difficulty: 'mid', type: 'technical', questionText: 'Explain SOLID principles.', expectedTopics: [] },
    { role: 'frontend', difficulty: 'junior', type: 'technical', questionText: 'What is the box model in CSS?', expectedTopics: [] },
    { role: 'backend', difficulty: 'mid', type: 'technical', questionText: 'What is CAP theorem?', expectedTopics: [] },
];

const seedDB = async () => {
    try {
        await connectDB();

        // Clear existing
        await QuestionBank.deleteMany();
        console.log('QuestionBank cleared');

        // Insert new
        await QuestionBank.insertMany(questions);
        console.log(`Imported ${questions.length} questions`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
