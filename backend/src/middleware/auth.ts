import { Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ').at(1);

    if (!token) {
      req.user = null
      return next()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: number;
      email: string;
    };

    const user = await prisma.usuario.findUnique({
      where: { idUsuario: decoded.id },
      include: { alumno: true }
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const { alumno, ...userData } = user;

    req.user = {
      ...userData,
      rol: alumno ? 'alumno' : 'profesor',
    }

    return next();
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (!roles.includes(req.user.rol)) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    next();
  };
}; 