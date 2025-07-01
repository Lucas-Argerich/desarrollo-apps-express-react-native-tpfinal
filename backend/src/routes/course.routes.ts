import { Router } from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  deleteCourse,
  registerForCourse,
  unregisterFromCourse,
  getSubscribedCourses,
  getCreatedCourses
} from '../controllers/course.controller';
import { auth, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Protected routes
router.post('/', auth, requireRole(['profesor']), createCourse);
router.delete('/:id', auth, requireRole(['profesor']), deleteCourse);
router.post('/:id/register', auth, requireRole(['alumno']), registerForCourse);
router.delete('/:id/register', auth, requireRole(['alumno']), unregisterFromCourse);
router.get('/user/subscribed', auth, requireRole(['alumno']), getSubscribedCourses);
router.get('/user/created', auth, requireRole(['profesor']), getCreatedCourses);

export default router; 