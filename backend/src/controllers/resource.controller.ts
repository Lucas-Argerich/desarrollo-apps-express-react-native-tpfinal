import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { ResourceCreateInput, ResourceResponse } from '../types';

const prisma = new PrismaClient();

interface ResourceQuery {
  limit?: string;
  offset?: string;
}

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

export const getResources = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = '10', offset = '0' }: ResourceQuery = req.query;

    const resources = await prisma.resource.findMany({
      take: Number(limit),
      skip: Number(offset),
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching resources' });
  }
};

export const getResource = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const resource = await prisma.resource.findUnique({
      where: { id: Number(id) },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching resource' });
  }
};

export const createResource = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const resourceData: ResourceCreateInput = req.body;

    const resource = await prisma.resource.create({
      data: {
        title: resourceData.title,
        description: resourceData.description,
        type: resourceData.type,
        url: resourceData.url,
        createdById: req.user.id,
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
      id: resource.id,
      title: resource.title,
      status: 'active',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating resource' });
  }
};

export const updateResource = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const resourceData: Partial<ResourceCreateInput> = req.body;

    // Check if resource exists and user is the creator
    const existingResource = await prisma.resource.findUnique({
      where: { id: Number(id) },
    });

    if (!existingResource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    if (existingResource.createdById !== req.user.id) {
      res.status(403).json({ error: 'Not authorized to update this resource' });
      return;
    }

    const resource = await prisma.resource.update({
      where: { id: Number(id) },
      data: resourceData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error updating resource' });
  }
};

export const deleteResource = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    // Check if resource exists and user is the creator
    const existingResource = await prisma.resource.findUnique({
      where: { id: Number(id) },
    });

    if (!existingResource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    if (existingResource.createdById !== req.user.id) {
      res.status(403).json({ error: 'Not authorized to delete this resource' });
      return;
    }

    await prisma.resource.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting resource' });
  }
}; 