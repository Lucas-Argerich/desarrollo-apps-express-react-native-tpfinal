import { Router } from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  registerForCourse,
  unregisterFromCourse,
} from '../controllers/course.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Protected routes
router.post('/', auth, createCourse);
router.post('/:id/register', auth, registerForCourse);
router.delete('/:id/register', auth, unregisterFromCourse);

export default router; 