import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ingredient controllers
export const getIngredients = async (req: Request, res: Response) => {
  try {
    const ingredients = await prisma.ingrediente.findMany();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ingredientes' });
  }
};

export const createIngredient = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body;

    const ingredient = await prisma.ingrediente.create({
      data: {
        nombre,
      },
    });

    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el ingrediente' });
  }
};

// Utensil controllers
export const getUtensils = async (req: Request, res: Response) => {
  try {
    const utensils = await prisma.utencilio.findMany();
    res.json(utensils);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los utensilios' });
  }
};

export const createUtensil = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion } = req.body;

    const utensil = await prisma.utencilio.create({
      data: {
        nombre,
        descripcion,
      },
    });

    res.status(201).json(utensil);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el utensilio' });
  }
}; 