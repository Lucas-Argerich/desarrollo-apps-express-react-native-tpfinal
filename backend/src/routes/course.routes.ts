import { Router } from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  registerForCourse,
  unregisterFromCourse,
  getSubscribedCourses
} from '../controllers/course.controller';
import { auth, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Protected routes
router.post('/', auth, requireRole(['profesor']), createCourse);
router.post('/:id/register', auth, requireRole(['alumno']), registerForCourse);
router.delete('/:id/register', auth, requireRole(['alumno']), unregisterFromCourse);
router.get('/user/subscribed', auth, requireRole(['alumno']), getSubscribedCourses);

export default router; 