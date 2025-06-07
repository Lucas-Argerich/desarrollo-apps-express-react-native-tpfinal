import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ingredient controllers
export const getIngredients = async (req: Request, res: Response) => {
  try {
    const ingredients = await prisma.ingredient.findMany();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ingredients' });
  }
};

export const createIngredient = async (req: Request, res: Response) => {
  try {
    const { name, unit, default_quantity } = req.body;

    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        unit,
        defaultQuantity: default_quantity,
      },
    });

    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: 'Error creating ingredient' });
  }
};

// Utensil controllers
export const getUtensils = async (req: Request, res: Response) => {
  try {
    const utensils = await prisma.utensil.findMany();
    res.json(utensils);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching utensils' });
  }
};

export const createUtensil = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const utensil = await prisma.utensil.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(utensil);
  } catch (error) {
    res.status(500).json({ error: 'Error creating utensil' });
  }
}; 