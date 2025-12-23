import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const protect = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    try {
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(
                new AppError(
                    'The user belonging to this token does no longer exist.',
                    401
                )
            );
        }

        req.user = currentUser;
        next();
    } catch (err) {
        // Explicitly handle TokenExpiredError
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'fail',
                code: 'TOKEN_EXPIRED',
                message: 'Access token expired'
            });
        }

        // Handle other JWT errors
        if (err.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token. Please log in again.', 401));
        }

        // Unknown error
        return next(err);
    }
});
