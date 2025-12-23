import { z } from 'zod';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from '../utils/jwtHelper.js';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const sendToken = (user, statusCode, res) => {
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(
            Date.now() +
            parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000
        ),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Changed from 'strict' for better compatibility
    };

    res.cookie('jwt', refreshToken, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        accessToken, // Changed from 'token' for consistency
        data: {
            user,
        },
    });
};

export const register = catchAsync(async (req, res, next) => {
    const { name, email, password } = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('Email already in use', 400));
    }

    const newUser = await User.create({
        name,
        email,
        password,
    });

    sendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    sendToken(user, 200, res);
});

export const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
};

export const refresh = catchAsync(async (req, res, next) => {
    const cookieToken = req.cookies.jwt;

    if (!cookieToken) {
        return next(new AppError('No refresh token provided', 401));
    }

    try {
        const decoded = verifyRefreshToken(cookieToken);
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new AppError('User not found', 401));
        }

        // Generate NEW access token
        const newAccessToken = signAccessToken(user._id);

        res.status(200).json({
            status: 'success',
            accessToken: newAccessToken, // Changed from 'token' for consistency
        });
    } catch (err) {
        return next(new AppError('Invalid refresh token', 401));
    }
});

export const getMe = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user,
        },
    });
};
