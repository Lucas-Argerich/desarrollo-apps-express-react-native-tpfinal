import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import crypto from 'crypto';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

const prisma = new PrismaClient();
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
});

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  userType: 'ALUMNO' | 'INSTRUCTOR' | 'ADMIN';
}

interface LoginInput {
  email: string;
  password: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}

interface RequestPasswordResetInput {
  email: string;
}

interface VerifyResetTokenInput {
  email: string;
  token: string;
}

interface ResetPasswordInput {
  email: string;
  token: string;
  newPassword: string;
}

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, userType }: RegisterInput = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'Usuario con ese email ya existe' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userType,
        verificationToken,
      },
    });

    // Send verification email
    const sentFrom = new Sender(process.env.MAILERSEND_FROM_EMAIL || '', process.env.MAILERSEND_FROM_NAME || '');
    const recipients = [new Recipient(email)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject('Verificación de email')
      .setTemplateId('k68zxl2e7q3lj905') // Replace with your actual template ID
      .setPersonalization([{
        email: email,
        data: {
          name: user.name,
          verificationLink: `http://localhost:8000/api/auth/verify-email?token=${verificationToken}`,
        },
      }]);

    await mailerSend.email.send(emailParams);

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      token,
    });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).json({ error: 'Error registrando usuario' });
  }
};

export const verifyEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Token de verificación requerido' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      res.status(400).json({ error: 'Token de verificación inválido' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    res.send('<h1 style="color: #1B1B1B; font-size: 24px; font-weight: 700; text-align: center;">Email verificado correctamente</h1>');
  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({ error: 'Error verificando email' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password }: LoginInput = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        userType: true,
        isVerified: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Check if email is verified
    if (!user.isVerified) {
      res.status(403).json({ error: 'Debes verificar tu email antes de iniciar sesión.' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error iniciando sesión' });
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo usuario' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { name, email, password }: UpdateUserInput = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando usuario' });
  }
};

export const requestPasswordReset = async (req: AuthRequest, res: Response) => {
  try {
    const { email }: RequestPasswordResetInput = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist for security
      res.json({ message: 'Si existe una cuenta con ese email, se ha enviado un token de recuperación' });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(2).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: tokenExpiry,
      },
    });

    const sentFrom = new Sender(process.env.MAILERSEND_FROM_EMAIL || '', process.env.MAILERSEND_FROM_NAME || '');
    const recipients = [new Recipient(email)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject('Recuperación de contraseña')
      .setTemplateId('3z0vkloj6p7g7qrx')
      .setPersonalization([{
        email: email,
        data: {
          name: user.name,
          token: resetToken,
        },
      }]);

    await mailerSend.email.send(emailParams);

    res.json({ message: 'Si existe una cuenta con ese email, se ha enviado un token de recuperación' });
  } catch (error) {
    console.error('Error solicitando recuperación de contraseña:', error, JSON.stringify(error));
    res.json({ error: 'Error solicitando recuperación de contraseña' })
  }
};

export const verifyResetToken = async (req: AuthRequest, res: Response) => {
  try {
    const { email, token }: VerifyResetTokenInput = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      res.status(400).json({ error: 'Token inválido o expirado' });
      return;
    }

    res.json({ message: 'Token válido' });
  } catch (error) {
    console.error('Error verificando token de recuperación:', error);
    res.status(500).json({ error: 'Error verificando token de recuperación' });
  }
};

export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { email, token, newPassword }: ResetPasswordInput = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      res.status(400).json({ error: 'Token inválido o expirado' });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error('Error restableciendo contraseña:', error);
    res.status(500).json({ error: 'Error restableciendo contraseña' });
  }
}; 