import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { SearchQuery, SearchResponse } from '../types';
import { courseParse } from './course.controller';
import { recipeParse } from './recipe.controller';

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
        include: {
          utilizados: {
            include: {
              ingrediente: true,
              utencilio: true,
              unidad: true
            }
          },
          tipo: true,
          pasos: true,
          calificaciones: {
            include: {
              usuario: true
            }
          },
          usuario: true
        },
        where: {
          OR: [
            { nombreReceta: { contains: query, mode: 'insensitive' } },
            { descripcionReceta: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: searchLimit,
        skip: searchOffset,
      });

      results.recipes = recipes.map(r => {
        let match = 0;
        if (r.nombreReceta && r.nombreReceta.toLowerCase().includes(query.toLowerCase())) match += 10;
        if (r.descripcionReceta && r.descripcionReceta.toLowerCase().includes(query.toLowerCase())) match += 3;
        return { recipe: recipeParse(r), queryMatch: match };
      });
    }

    // Search courses
    if (!type || type === 'course') {
      const courses = await prisma.curso.findMany({
        include: {
          cursoExtra: true,
          cronogramas: {
            include: {
              asistencias: {
                include: {
                  alumno: true
                },
                distinct: ['idAlumno']
              }
            }
          }
        },
        where: {
          OR: [
            { cursoExtra: { titulo: { contains: query, mode: 'insensitive' } } },
            { descripcion: { contains: query, mode: 'insensitive' } },
            { contenidos: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: searchLimit,
        skip: searchOffset,
      });

      results.courses = courses.map(c => {
        let match = 0;
        if (c.cursoExtra?.titulo && c.cursoExtra.titulo.toLowerCase().includes(query.toLowerCase())) match += 10;
        if (c.descripcion && c.descripcion.toLowerCase().includes(query.toLowerCase())) match += 3;
        if (c.contenidos && c.contenidos.toLowerCase().includes(query.toLowerCase())) match += 3;
        return { course: courseParse(c), queryMatch: match };
      });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error performing search' });
  }
}; 