import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { SearchQuery, SearchResponse } from '../types';

const prisma = new PrismaClient();

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
    };

    // Search recipes
    if (!type || type === 'recipe') {
      const recipes = await prisma.receta.findMany({
        where: {
          OR: [
            { nombreReceta: { contains: query, mode: 'insensitive' } },
            { descripcionReceta: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: searchLimit,
        skip: searchOffset,
      });

      results.recipes = recipes.map((recipe) => ({
        id: recipe.idReceta,
        title: recipe.nombreReceta || '',
        status: 'active',
      }));
    }

    // Search courses
    if (!type || type === 'course') {
      const courses = await prisma.curso.findMany({
        where: {
          OR: [
            { descripcion: { contains: query, mode: 'insensitive' } },
            { contenidos: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: searchLimit,
        skip: searchOffset,
      });

      results.courses = courses.map((course) => ({
        id: course.idCurso,
        title: course.descripcion || '',
        status: 'active',
      }));
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error performing search' });
  }
}; 