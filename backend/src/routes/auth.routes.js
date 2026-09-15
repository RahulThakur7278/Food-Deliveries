import { Router } from "express";
import { register, login, logout, logoutAll, sendOTP, verifyOTP, resetPassword, googleSignIn, googleSignUp, getMe } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/logout-all', logoutAll);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/google-signup', googleSignUp);
router.post('/google-signin', googleSignIn);

// Protected routes
router.get('/get-me', authMiddleware, getMe);

export default router;
