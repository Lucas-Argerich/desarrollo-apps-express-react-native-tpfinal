import { Router } from 'express';
import { getRecipes, getRecipe, createRecipe, addReview } from '../controllers/recipe.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getRecipes);
router.get('/:id', getRecipe);

// Protected routes
router.post('/', auth, createRecipe);
router.post('/:id/reviews', auth, addReview);

export default router; 