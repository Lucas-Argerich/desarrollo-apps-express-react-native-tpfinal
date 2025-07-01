import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { SearchResponse } from '../types';
import { courseParse } from './course.controller';
import { recipeParse } from './recipe.controller';

const prisma = new PrismaClient();

export const search = async (req: AuthRequest, res: Response) => {
  try {
    const { q: query, type, limit = '10', offset = '0' } = req.query;

    if (typeof query !== 'string') {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    const searchLimit = Number(limit);
    const searchOffset = Number(offset);

    let results: SearchResponse & { ingredients?: any[] } = {
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
          cursoExtra: {
            include: {
              utilizados: {
                include: {
                  ingrediente: true,
                  utencilio: true,
                  unidad: true
                }
              }
            }
          },
          modulos: true,
          cronogramas: {
            include: {
              sede: true,
              asistencias: {
                include: {
                  alumno: true
                },
                distinct: ['idAlumno']
              }
            }
          },
          usuario: {
            select: {
              idUsuario: true,
              nombre: true,
              nickname: true,
              mail: true
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

    // Search ingredients
    if (type === 'ingrediente') {
      // Recipes with matching ingredient
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
          utilizados: {
            some: {
              ingrediente: {
                nombre: { contains: query, mode: 'insensitive' }
              }
            }
          }
        },
        take: searchLimit,
        skip: searchOffset,
      });
      results.recipes = recipes.map(r => {
        let match = 0;
        if (r.utilizados.some(u => u.ingrediente && u.ingrediente.nombre.toLowerCase().includes(query.toLowerCase()))) match += 10;
        return { recipe: recipeParse(r), queryMatch: match };
      });

      // Courses with matching ingredient
      const courses = await prisma.curso.findMany({
        include: {
          cursoExtra: {
            include: {
              utilizados: {
                include: {
                  ingrediente: true,
                  utencilio: true,
                  unidad: true
                }
              }
            }
          },
          modulos: true,
          cronogramas: {
            include: {
              sede: true,
              asistencias: {
                include: {
                  alumno: true
                },
                distinct: ['idAlumno']
              }
            }
          },
          usuario: {
            select: {
              idUsuario: true,
              nombre: true,
              nickname: true,
              mail: true
            }
          }
        },
        where: {
          cursoExtra: {
            utilizados: {
              some: {
                ingrediente: {
                  nombre: { contains: query, mode: 'insensitive' }
                }
              }
            }
          }
        },
        take: searchLimit,
        skip: searchOffset,
      });
      results.courses = courses.map(c => {
        let match = 0;
        if (c.cursoExtra?.utilizados.some(u => u.ingrediente && u.ingrediente.nombre.toLowerCase().includes(query.toLowerCase()))) match += 10;
        return { course: courseParse(c), queryMatch: match };
      });
    } else {
      // Search ingredients
      const ingredients = await prisma.ingrediente.findMany({
        where: {
          nombre: { contains: query, mode: 'insensitive' },
        },
        include: {
          utilizados: {
            include: {
              receta: true,
            },
          },
        },
        take: searchLimit,
        skip: searchOffset,
      });
      results.ingredients = ingredients.map(ing => ({
        ingredient: {
          idIngrediente: ing.idIngrediente,
          nombre: ing.nombre,
        },
        recipes: ing.utilizados
          .filter(u => u.receta)
          .map(u => u.receta ? recipeParse(u.receta) : null)
          .filter(Boolean),
        queryMatch: ing.nombre.toLowerCase().includes(query.toLowerCase()) ? 10 : 0,
      }));
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error performing search' });
  }
}; 