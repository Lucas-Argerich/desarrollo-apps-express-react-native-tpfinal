import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { RecipeCreateInput, RecipeResponse, ReviewCreateInput } from '../types';

const prisma = new PrismaClient();

interface RecipeQuery {
  limit?: string;
  offset?: string;
  category?: string;
  difficulty?: string;
}

export const getRecipes = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = '10', offset = '0', category, difficulty }: RecipeQuery = req.query;

    const where: any = {};
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    const recipes = await prisma.recipe.findMany({
      where,
      take: Number(limit),
      skip: Number(offset),
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recipes' });
  }
};

export const getRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const recipe = await prisma.recipe.findUnique({
      where: { id: Number(id) },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recipe' });
  }
};

export const createRecipe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const recipeData: RecipeCreateInput = req.body;

    const recipe = await prisma.recipe.create({
      data: {
        title: recipeData.title,
        description: recipeData.description,
        category: recipeData.category,
        difficulty: recipeData.difficulty,
        createdById: req.user.id,
        ingredients: {
          create: recipeData.ingredients.map((ing) => ({
            quantity: ing.amount,
            ingredient: {
              connectOrCreate: {
                where: {
                  name: ing.name,
                },
                create: {
                  name: ing.name,
                  unit: ing.unit,
                  defaultQuantity: ing.amount,
                },
              },
            },
          })),
        },
        steps: {
          create: recipeData.steps.map((step, index) => ({
            content: step.content,
            order: index + 1,
          })),
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      id: recipe.id,
      title: recipe.title,
      status: 'active',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating recipe' });
  }
};

export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const reviewData: ReviewCreateInput = req.body;

    if (reviewData.rating < 1 || reviewData.rating > 5) {
      res.status(400).json({ error: 'Rating must be between 1 and 5' });
      return;
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id: Number(id) },
    });

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    const review = await prisma.review.create({
      data: {
        rating: reviewData.rating,
        comment: reviewData.comment,
        userId: req.user.id,
        recipeId: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Update recipe rating
    const reviews = await prisma.review.findMany({
      where: { recipeId: Number(id) },
    });

    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    await prisma.recipe.update({
      where: { id: Number(id) },
      data: { rating: averageRating },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error adding review' });
  }
}; 