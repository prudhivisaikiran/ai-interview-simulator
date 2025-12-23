import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per 15 min per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." }
});
