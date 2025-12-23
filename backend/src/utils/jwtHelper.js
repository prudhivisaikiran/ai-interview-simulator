import jwt from 'jsonwebtoken';

export const signAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
};

export const signRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
