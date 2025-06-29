import { Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { RecipeCreateInput, ReviewCreateInput } from '../types';

const prisma = new PrismaClient();

interface RecipeQuery {
  limit?: string;
  offset?: string;
}

export const getRecipes = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = '10', offset = '0' }: RecipeQuery = req.query;

    const recipes = await prisma.receta.findMany({
      take: Number(limit),
      skip: Number(offset),
      include: {
        utilizados: true,
        tipo: true,
        pasos: true,
        calificaciones: true,
        usuario: true
      }
    });

    res.json(recipes.map(recipeParse));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las recetas' });
  }
};

export const getRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const recipe = await prisma.receta.findUnique({
      where: { idReceta: id },
      include: {
        utilizados: true,
        tipo: true,
        pasos: true,
        calificaciones: true,
        usuario: true
      }
    });

    if (!recipe) {
      res.status(404).json({ error: 'Receta no encontrada' });
      return;
    }

    res.json(recipeParse(recipe));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la receta' });
  }
};

export const createRecipe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const recipeData: RecipeCreateInput = req.body;

    const receta = await prisma.receta.create({
      data: {
        nombreReceta: recipeData.nombreReceta,
        descripcionReceta: recipeData.descripcionReceta,
        porciones: recipeData.porciones,
        cantidadPersonas: recipeData.cantidadPersonas,
        utilizados: {
          create: recipeData.ingredientes.map((ing) => ({
            cantidad: ing.cantidad,
            ingrediente: {
              connectOrCreate: {
                where: {
                  nombre: ing.nombre,
                },
                create: {
                  nombre: ing.nombre,
                },
              },
            },
          })),
        },
        pasos: {
          create: recipeData.pasos.map((step) => ({
            texto: step.texto,
            nroPaso: step.nroPaso,
          })),
        },
        idUsuario: req.user.idUsuario,
      },
    });

    res.status(201).json({
      idReceta: receta.idReceta,
      nombreReceta: receta.nombreReceta,
      status: 'active',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la receta' });
  }
};

export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const id = Number(req.params.id);
    const reviewData: ReviewCreateInput = req.body;

    if (!reviewData.calificacion || reviewData.calificacion < 1 || reviewData.calificacion > 5) {
      res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' });
      return;
    }

    const recipe = await prisma.receta.findUnique({
      where: { idReceta: id },
    });

    if (!recipe) {
      res.status(404).json({ error: 'Receta no encontrada' });
      return;
    }

    const review = await prisma.calificacion.create({
      data: {
        calificacion: reviewData.calificacion,
        comentarios: reviewData.comentarios,
        idUsuario: req.user.idUsuario,
        idReceta: id,
      },
    });

    // Update recipe average rating (if you want to store it, add a field in Receta)
    // const reviews = await prisma.calificacion.findMany({ where: { idReceta: id } });
    // const averageRating = reviews.reduce((acc, curr) => acc + (curr.calificacion || 0), 0) / reviews.length;
    // await prisma.receta.update({ where: { idReceta: id }, data: { averageRating } });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar la reseña' });
  }
}; 

export function recipeParse(
  recipe: Partial<
    Prisma.RecetaGetPayload<{
      include: {
        utilizados: true,
        tipo: true,
        pasos: true,
        calificaciones: true,
        usuario: true
      }
    }>
  >
) {
  return {
    idReceta: recipe.idReceta,
    nombreReceta: recipe.nombreReceta,
    descripcionReceta: recipe.descripcionReceta,
    fotoPrincipal: recipe.fotoPrincipal,
    porciones: recipe.porciones,
    cantidadPersonas: recipe.cantidadPersonas,
    idTipo: recipe.idTipo,
    utilizados: recipe.utilizados,
    pasos: recipe.pasos,
    calificaciones: recipe.calificaciones,
    calificacion: recipe.calificaciones
      ? recipe.calificaciones?.reduce((acc, curr) => acc + (curr.calificacion || 0), 0) /
        (recipe.calificaciones?.length || 1)
      : 0,
    usuario: recipe.usuario
  }
}