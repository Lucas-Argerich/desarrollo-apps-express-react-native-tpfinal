import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest, CompleteRegistrationInput, InitialRegisterInput, LoginInput, UpdateUserInput, RequestPasswordResetInput, VerifyResetTokenInput, ResetPasswordInput } from '../types';
import crypto from 'crypto';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export const initialRegister = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, userType } = req.body as InitialRegisterInput;

    // Check if username already exists
    const existingUsername = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUsername) {
      // Generate username suggestions by adding numbers
      const suggestions = [];
      for (let i = 1; i <= 5; i++) {
        suggestions.push(`${username}${i}`);
      }

      res.status(400).json({
        error: 'El nombre de usuario ya existe',
        suggestions: suggestions,
      });
      return;
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      if (existingEmail.isVerified) {
        res.status(400).json({ error: 'El email ya está registrado' });
        return;
      } else {
        res.status(400).json({ error: 'El email está pendiente de verificación. Por favor, contacta a soporte para liberar el email.' });
        return;
      }
    }

    // Generate verification code
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const codeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create temporary user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        userType,
        verificationCode,
        codeExpiry,
      },
    });

    // Send verification email
    const sentFrom = new Sender(process.env.MAILERSEND_FROM_EMAIL || '', process.env.MAILERSEND_FROM_NAME || '');
    const recipients = [new Recipient(email)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject('Código de verificación')
      .setTemplateId('verification-code-template-id') // Replace with your template ID
      .setPersonalization([{
        email: email,
        data: {
          name: username,
          code: verificationCode,
        },
      }]);

    console.log("Verification code: ", verificationCode)
    //await mailerSend.email.send(emailParams);

    res.status(201).json({ message: 'Código de verificación enviado' });
  } catch (error) {
    console.error('Error en registro inicial:', error);
    res.status(500).json({ error: 'Error en registro inicial' });
  }
};

export const verifyRegistrationCode = async (req: AuthRequest, res: Response) => {
  try {
    const { email, code } = req.body as { email: string; code: string };

    const user = await prisma.user.findFirst({
      where: {
        email,
        verificationCode: code,
        codeExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      res.status(400).json({ error: 'Código inválido o expirado' });
      return;
    }

    res.json({ message: 'Código válido' });
  } catch (error) {
    console.error('Error verificando código:', error);
    res.status(500).json({ error: 'Error verificando código' });
  }
};

export const completeRegistration = async (req: AuthRequest, res: Response) => {
  try {
    const { email, name, password, userType, cardNumber, cardExpiry, cardCVV, tramiteNumber } = req.body as CompleteRegistrationInput;
    if (typeof req.files !== 'object' || Object.keys(req.files).length === 0) {
      res.status(400).json({ error: 'No se han subido archivos' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
        verificationCode: { not: null },
      },
    });

    if (!user) {
      res.status(400).json({ error: 'Usuario no encontrado o ya registrado' });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const dniFront = files['dniFront'][0]
    const dniBack = files['dniBack'][0]

    if (!dniFront || !dniBack) {
      res.status(400).json({ error: 'Se requieren ambas imágenes del DNI' });
      return;
    }

    // Upload files to Supabase
    const [frontResult, backResult] = await Promise.all([
      supabase.storage
        .from('uploads')
        .upload(`${email}/front-${Date.now()}${path.extname(dniFront.originalname)}`, dniFront.buffer, {
          contentType: dniFront.mimetype,
          upsert: false
        }),
      supabase.storage
        .from('uploads')
        .upload(`${email}/back-${Date.now()}${path.extname(dniBack.originalname)}`, dniBack.buffer, {
          contentType: dniBack.mimetype,
          upsert: false
        })
    ]);

    if (frontResult.error || backResult.error) {
      console.error('Error uploading files:', frontResult.error || backResult.error);
      res.status(500).json({ error: 'Error al subir los archivos' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get public URLs for the uploaded files
    const frontUrl = supabase.storage.from('uploads').getPublicUrl(frontResult.data.path).data.publicUrl;
    const backUrl = supabase.storage.from('uploads').getPublicUrl(backResult.data.path).data.publicUrl;

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        password: hashedPassword,
        isVerified: true,
        verificationCode: null,
        codeExpiry: null,
        ...(userType === 'ALUMNO' && cardNumber && cardExpiry && cardCVV && tramiteNumber && {
          student: {
            create: {
              cardNumber,
              cardExpiry,
              cardCVV,
              tramiteNumber,
              dniFront: frontUrl,
              dniBack: backUrl,
            },
          },
        }),
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { id: updatedUser.id, email: updatedUser.email, userType: updatedUser.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      userType: updatedUser.userType,
      token,
    });
  } catch (error) {
    console.error('Error completando registro:', error);
    res.status(500).json({ error: 'Error completando registro' });
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
      where: { verificationCode: token },
    });

    if (!user) {
      res.status(400).json({ error: 'Token de verificación inválido' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null,
      },
    });

    res.send('<h1 style="color: #1B1B1B; font-size: 24px; font-weight: 700; text-align: center; font-family: "Poppins", sans-serif;">Email verificado correctamente</h1>');
  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({ error: 'Error verificando email' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body as LoginInput;

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
    const validPassword = await bcrypt.compare(password, user.password || '');

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

    const { name, email, password } = req.body as UpdateUserInput;

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
    const { email } = req.body as RequestPasswordResetInput;

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
    const { email, token } = req.body as VerifyResetTokenInput;

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
    const { email, token, newPassword } = req.body as ResetPasswordInput;

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