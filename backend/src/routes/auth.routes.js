import { Router } from "express";
import { register, login, logout, logoutAll, sendOTP, verifyOTP, resetPassword } from "../controllers/auth.controller.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/logout-all', logoutAll);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);


export default router;
