import { Router } from 'express';
import { register, login, getUser, updateUser, requestPasswordReset, verifyResetToken, resetPassword } from '../controllers/auth.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/request-reset', requestPasswordReset);
router.post('/verify-token', verifyResetToken);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/user', auth, getUser);
router.put('/user', auth, updateUser);

export default router; 