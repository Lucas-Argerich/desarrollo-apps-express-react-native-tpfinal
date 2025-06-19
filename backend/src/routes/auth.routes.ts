import { Router } from 'express';
import { initialRegister, verifyRegistrationCode, completeRegistration, login, getUser, updateUser, requestPasswordReset, verifyResetToken, resetPassword } from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post('/initial-register', initialRegister);
router.post('/verify-registration-code', verifyRegistrationCode);
router.post('/complete-registration', completeRegistration);
router.post('/login', login);
router.post('/request-reset', requestPasswordReset);
router.post('/verify-token', verifyResetToken);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/user', getUser);
router.put('/user', updateUser);

export default router; 