import { Router } from "express";
import { register, login, refresh, logout, getMe } from "../controllers/authController.js";
import { authLimiter } from "../middlewares/rateLimit.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", authLimiter, logout);

// Protected routes
router.get("/me", protect, getMe);

export default router;
