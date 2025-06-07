import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { SearchQuery, SearchResponse, RecipeResponse, CourseResponse, ResourceResponse } from '../types';

const prisma = new PrismaClient();

interface PrismaRecipe {
  id: number;
  title: string;
}

interface PrismaCourse {
  id: number;
  title: string;
}

interface PrismaResource {
  id: number;
  title: string;
}

export const search = async (req: AuthRequest, res: Response) => {
  try {
    const { q: query, type, limit = '10', offset = '0' } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    const searchLimit = Number(limit);
    const searchOffset = Number(offset);

    let results: SearchResponse = {
      recipes: [],
      courses: [],
      resources: [],
    };

    // Search recipes
    if (!type || type === 'recipe') {
      const recipes = await prisma.recipe.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: searchLimit,
        skip: searchOffset,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          reviews: true,
        },
      });

      results.recipes = recipes.map((recipe: PrismaRecipe) => ({
        id: recipe.id,
        title: recipe.title,
        status: 'active',
      }));
    }

    // Search courses
    if (!type || type === 'course') {
      const courses = await prisma.course.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: searchLimit,
        skip: searchOffset,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          reviews: true,
        },
      });

      results.courses = courses.map((course: PrismaCourse) => ({
        id: course.id,
        title: course.title,
        status: 'active',
      }));
    }

    // Search resources
    if (!type || type === 'resource') {
      const resources = await prisma.resource.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: searchLimit,
        skip: searchOffset,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      results.resources = resources.map((resource: PrismaResource) => ({
        id: resource.id,
        title: resource.title,
        status: 'active',
      }));
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error performing search' });
  }
}; 