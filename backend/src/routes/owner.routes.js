import { Router } from 'express';
import { getDashboardStats } from '../controllers/owner.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply auth middleware to all owner routes
router.use(authMiddleware);

router.get('/stats', getDashboardStats);

export default router;
