import { Router } from 'express';
import { getRecipes, getRecipe, createRecipe, updateRecipe, addReview, addToFavorites, removeFromFavorites, getFavorites, checkFavorite, getCreatedRecipes } from '../controllers/recipe.controller';
import { auth, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getRecipes);
router.get('/:id', getRecipe);

// Protected routes
router.post('/', auth, requireRole(['profesor']), createRecipe);
router.put('/:id', auth, requireRole(['profesor']), updateRecipe);
router.post('/:id/reviews', auth, addReview);
router.get('/user/created', auth, requireRole(['profesor']), getCreatedRecipes);

// Favorites routes (only for alumnos)
router.post('/:id/favorites', auth, requireRole(['alumno']), addToFavorites);
router.delete('/:id/favorites', auth, requireRole(['alumno']), removeFromFavorites);
router.get('/:id/favorites/check', auth, requireRole(['alumno']), checkFavorite);
router.get('/user/favorites', auth, requireRole(['alumno']), getFavorites);

export default router; 