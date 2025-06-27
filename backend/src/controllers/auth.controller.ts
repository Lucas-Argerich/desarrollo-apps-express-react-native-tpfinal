import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest, CompleteRegistrationInput, InitialRegisterInput, LoginInput, RequestPasswordResetInput, UpdateUserInput } from '../types';
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
    const { nickname, mail } = req.body as InitialRegisterInput;

    if (!nickname || !mail) {
      res.status(400).json({ error: 'Nickname y email son requeridos' });
      return;
    }

    // Check if username already exists
    const existingUsername = await prisma.usuario.findFirst({
      where: { nickname },
    });

    if (existingUsername) {
      // Generate username suggestions by adding numbers
      const suggestions = [];
      for (let i = 1; i <= 5; i++) {
        suggestions.push(`${nickname}${i}`);
      }

      res.status(400).json({
        error: 'El nombre de usuario ya existe',
        suggestions: suggestions,
      });
      return;
    }

    // Check if email already exists
    const existingEmail = await prisma.usuario.findUnique({
      where: { mail },
    });

    if (existingEmail) {
      if (existingEmail.habilitado === 'Si') {
        res.status(400).json({ error: 'El email ya está registrado' });
        return;
      } else {
        res.status(400).json({ error: 'El email está pendiente de verificación. Por favor, contacta a soporte para liberar el email.' });
        return;
      }
    }

    // Generate verification code
    const codigoVerificacion = crypto.randomBytes(3).toString('hex').toUpperCase();
    const vencimiento = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create temporary user and verification code
    const user = await prisma.usuario.create({
      data: {
        nickname,
        mail,
        habilitado: 'No',
        codigosVerificacion: {
          create: {
            codigo: codigoVerificacion,
            vencimiento,
          }
        }
      },
    });

    // Send verification email
    const sentFrom = new Sender(process.env.MAILERSEND_FROM_EMAIL || '', process.env.MAILERSEND_FROM_NAME || '');
    const recipients = [new Recipient(mail)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject('Código de verificación')
      .setTemplateId('verification-code-template-id') // Replace with your template ID
      .setPersonalization([{ email: mail, data: { name: nickname, code: codigoVerificacion } }]);

    console.log('Verification code: ', codigoVerificacion);
    //await mailerSend.email.send(emailParams);

    res.status(201).json({ message: 'Código de verificación enviado' });
  } catch (error) {
    console.error('Error en registro inicial:', error);
    res.status(500).json({ error: 'Error en registro inicial' });
  }
};

export const verifyRegistrationCode = async (req: AuthRequest, res: Response) => {
  try {
    const { mail, code } = req.body as { mail: string; code: string };

    const user = await prisma.usuario.findUnique({
      where: { mail },
      include: { codigosVerificacion: true },
    });

    if (!user || !user.codigosVerificacion.length) {
      res.status(400).json({ error: 'Usuario o código no encontrado' });
      return;
    }

    const codigo = user.codigosVerificacion[0];
    if (
      codigo.codigo !== code ||
      codigo.vencimiento < new Date() ||
      !codigo.activo
    ) {
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
    const { mail, nombre, password, numeroTarjeta, vencimientoTarjeta, CVVTarjeta, numeroTramite } = req.body as CompleteRegistrationInput;
    if (typeof req.files !== 'object' || Object.keys(req.files).length === 0) {
      res.status(400).json({ error: 'No se han subido archivos' });
      return;
    }

    const user = await prisma.usuario.findUnique({
      where: { mail },
      include: { codigosVerificacion: true },
    });

    if (!user || !user.codigosVerificacion.length) {
      res.status(400).json({ error: 'Usuario no encontrado o ya registrado' });
      return;
    }

    const codigo = user.codigosVerificacion[0];
    if (codigo.vencimiento < new Date() || !codigo.activo) {
      res.status(400).json({ error: 'Código de verificación inválido o expirado' });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const dniFront = files['dniFront'][0];
    const dniBack = files['dniBack'][0];

    if (!dniFront || !dniBack) {
      res.status(400).json({ error: 'Se requieren ambas imágenes del DNI' });
      return;
    }

    // Upload files to Supabase
    const [frontResult, backResult] = await Promise.all([
      supabase.storage
        .from('uploads')
        .upload(`${mail}/front-${Date.now()}${path.extname(dniFront.originalname)}`, dniFront.buffer, {
          contentType: dniFront.mimetype,
          upsert: false,
        }),
      supabase.storage
        .from('uploads')
        .upload(`${mail}/back-${Date.now()}${path.extname(dniBack.originalname)}`, dniBack.buffer, {
          contentType: dniBack.mimetype,
          upsert: false,
        }),
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
    const updatedUser = await prisma.usuario.update({
      where: { mail },
      data: {
        nombre,
        password: hashedPassword,
        habilitado: 'Si',
        alumno: numeroTarjeta && vencimientoTarjeta && CVVTarjeta && numeroTramite
          ? {
              create: {
                numeroTarjeta,
                tramite: numeroTramite,
                dniFrente: frontUrl,
                dniFondo: backUrl,
              },
            }
          : undefined,
        codigosVerificacion: {
          updateMany: {
            where: { activo: true },
            data: { activo: false },
          },
        },
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { idUsuario: updatedUser.idUsuario, mail: updatedUser.mail },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      idUsuario: updatedUser.idUsuario,
      nombre: updatedUser.nombre,
      mail: updatedUser.mail,
      token,
    });
  } catch (error) {
    console.error('Error completando registro:', error);
    res.status(500).json({ error: 'Error completando registro' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { mail, password } = req.body as LoginInput;

    // Find user
    const user = await prisma.usuario.findUnique({
      where: { mail },
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
    if (user.habilitado !== 'Si') {
      res.status(403).json({ error: 'Debes verificar tu email antes de iniciar sesión.' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { idUsuario: user.idUsuario, mail: user.mail },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      idUsuario: user.idUsuario,
      nombre: user.nombre,
      mail: user.mail,
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

    const user = await prisma.usuario.findUnique({
      where: { idUsuario: req.user.idUsuario },
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

    const { nombre, mail, password } = req.body as UpdateUserInput;

    const updateData: any = {};
    if (nombre) updateData.nombre = nombre;
    if (mail) updateData.mail = mail;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.usuario.update({
      where: { idUsuario: req.user.idUsuario },
      data: updateData,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando usuario' });
  }
};

export const requestPasswordReset = async (req: AuthRequest, res: Response) => {
  try {
    const { mail } = req.body as RequestPasswordResetInput;

    const user = await prisma.usuario.findUnique({
      where: { mail },
    });

    if (!user) {
      // Return success even if user doesn't exist for security
      res.json({ message: 'Si existe una cuenta con ese email, se ha enviado un token de recuperación' });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();
    const vencimiento = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to CodigosVerificacion
    await prisma.codigosVerificacion.create({
      data: {
        idUsuario: user.idUsuario,
        codigo: resetToken,
        vencimiento,
        activo: true,
      },
    });

    const sentFrom = new Sender(process.env.MAILERSEND_FROM_EMAIL || '', process.env.MAILERSEND_FROM_NAME || '');
    const recipients = [new Recipient(mail || '')];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject('Recuperación de contraseña')
      .setTemplateId('3z0vkloj6p7g7qrx')
      .setPersonalization([{ email: mail || '', data: { name: user.nombre || '', token: resetToken } }]);

    //await mailerSend.email.send(emailParams);

    res.json({ message: 'Si existe una cuenta con ese email, se ha enviado un token de recuperación' });
  } catch (error) {
    console.error('Error solicitando recuperación de contraseña:', error, JSON.stringify(error));
    res.json({ error: 'Error solicitando recuperación de contraseña' })
  }
};

export const verifyResetToken = async (req: AuthRequest, res: Response) => {
  try {
    const { mail, token } = req.body;

    const user = await prisma.usuario.findUnique({
      where: { mail },
      include: { codigosVerificacion: true },
    });

    if (!user || !user.codigosVerificacion.length) {
      res.status(400).json({ error: 'Usuario o token no encontrado' });
      return;
    }

    const codigo = user.codigosVerificacion.find(c => c.codigo === token && c.activo);
    if (!codigo || codigo.vencimiento < new Date()) {
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
    const { mail, token, newPassword } = req.body;

    const user = await prisma.usuario.findUnique({
      where: { mail },
      include: { codigosVerificacion: true },
    });

    if (!user || !user.codigosVerificacion.length) {
      res.status(400).json({ error: 'Usuario o token no encontrado' });
      return;
    }

    const codigo = user.codigosVerificacion.find(c => c.codigo === token && c.activo);
    if (!codigo || codigo.vencimiento < new Date()) {
      res.status(400).json({ error: 'Token inválido o expirado' });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and deactivate token
    await prisma.usuario.update({
      where: { idUsuario: user.idUsuario },
      data: { password: hashedPassword },
    });
    await prisma.codigosVerificacion.update({
      where: { id: codigo.id },
      data: { activo: false },
    });

    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error('Error restableciendo contraseña:', error);
    res.status(500).json({ error: 'Error restableciendo contraseña' });
  }
}; 