import { Router } from 'express';
import { register, login, getUser, updateUser } from '../controllers/auth.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/user', auth, getUser);
router.put('/user', auth, updateUser);

export default router; 