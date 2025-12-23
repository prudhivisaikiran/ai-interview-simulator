import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';

import AppError from './utils/AppError.js';
import globalErrorHandler from './middlewares/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';

const app = express();

// 1) Global Middlewares

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// CORS Configuration
// CORS Configuration
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow no origin (e.g. mobile apps, curl)
            if (!origin) return callback(null, true);
            // Allow any localhost origin for development
            if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
                return callback(null, true);
            }
            // Check against configured production origin
            if (origin === process.env.CLIENT_ORIGIN) {
                return callback(null, true);
            }
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// 2) Routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/sessions', interviewRoutes);

// Handle unhandled routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
