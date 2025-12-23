import dotenv from 'dotenv';
dotenv.config();
console.log("MONGO_URI =", process.env.MONGO_URI);

import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
});

// Handle unhandled promise rejections (e.g. DB connection issues off the bat)
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
