import { Router } from 'express';
import { login, changePassword, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/change-password', verifyToken, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;