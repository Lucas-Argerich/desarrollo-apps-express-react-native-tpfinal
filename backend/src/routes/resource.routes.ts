import { Router } from 'express';
import {
  getIngredients,
  createIngredient,
  getUtensils,
  createUtensil,
} from '../controllers/resource.controller';
import { auth, requireRole } from '../middleware/auth';

const router = Router();

// Ingredient routes
router.get('/ingredients', getIngredients);
router.post('/ingredients', auth, requireRole(['ADMIN', 'INSTRUCTOR']), createIngredient);

// Utensil routes
router.get('/utensils', getUtensils);
router.post('/utensils', auth, requireRole(['ADMIN', 'INSTRUCTOR']), createUtensil);

export default router; 