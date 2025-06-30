import { Router } from 'express';
import { getRecipes, getRecipe, createRecipe, addReview, addToFavorites, removeFromFavorites, getFavorites, checkFavorite } from '../controllers/recipe.controller';
import { auth, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getRecipes);
router.get('/:id', getRecipe);

// Protected routes
router.post('/', auth, createRecipe);
router.post('/:id/reviews', auth, addReview);

// Favorites routes (only for alumnos)
router.post('/:id/favorites', auth, requireRole(['alumno']), addToFavorites);
router.delete('/:id/favorites', auth, requireRole(['alumno']), removeFromFavorites);
router.get('/:id/favorites/check', auth, requireRole(['alumno']), checkFavorite);
router.get('/user/favorites', auth, requireRole(['alumno']), getFavorites);

export default router; 