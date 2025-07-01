import { courseParse } from '@/controllers/course.controller';
import { recipeParse } from '@/controllers/recipe.controller';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

// Auth types
export interface AuthRequest extends Request {
  user?: {
    idUsuario: number;
    mail: string | null;
    nickname: string;
    habilitado: string;
    nombre: string | null;
    direccion: string | null;
    avatar: string | null;
    rol: 'alumno' | 'profesor' | 'admin';
  } | null;
  files?: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[];
}

export interface InitialRegisterInput {
  nickname: string;
  mail?: string;
}

export interface CompleteRegistrationInput {
  mail?: string;
  nombre?: string;
  password: string;
  numeroTarjeta?: string;
  vencimientoTarjeta?: string;
  CVVTarjeta?: string;
  numeroTramite?: string;
}

export interface LoginInput {
  mail?: string;
  password: string;
}

export interface UpdateUserInput {
  nombre?: string;
  mail?: string;
  password?: string;
  direccion?: string;
  avatar?: string;
}

export interface RequestPasswordResetInput {
  mail?: string;
}

export interface VerifyResetTokenInput {
  mail?: string;
  token: string;
}

export interface ResetPasswordInput {
  mail?: string;
  token: string;
  newPassword: string;
}

// Recipe types
export interface RecipeCreateInput {
  nombreReceta: string;
  descripcionReceta?: string;
  fotoPrincipal?: string;
  porciones?: number;
  cantidadPersonas?: number;
  idTipo?: number;
  ingredientes: IngredientCreateInput[];
  utencilios: UtencilCreateInput[];
  pasos: PasoCreateInput[];
}

export interface RecipeResponse {
  idReceta: number;
  nombreReceta?: string;
  status: string;
}

export interface IngredientCreateInput {
  nombre?: string;
  cantidad?: number;
  unidad?: string;
}

export interface UtencilCreateInput {
  nombre?: string;
  cantidad?: number;
  descripcion?: string;
}

export interface PasoCreateInput {
  texto?: string;
  nroPaso?: number;
}

// Course types
export interface Cronograma {
  idCronograma: number;
  idSede: number;
  idCurso: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  vacantesDisponibles: number | null;
  sede?: {
    idSede: number;
    nombreSede: string;
    direccionSede: string;
    telefonoSede: string | null;
    mailSede: string | null;
    whatsApp: string | null;
  };
}

export interface CourseCreateInput {
  descripcion?: string;
  contenidos?: string;
  requerimientos?: string;
  duracion?: number;
  precio?: number;
  modalidad: string;
  titulo?: string;
  dificultad?: string;
  modulos?: ModuleCreateInput[];
  cronogramas?: Cronograma[];
  ingredientes?: IngredientCreateInput[];
  utencilios?: UtencilCreateInput[];
}

export interface ModuleCreateInput {
  titulo: string;
  orden: number;
  contenido?: string;
  duracion?: number;
  video?: string;
}

export interface CourseResponse {
  idCurso: number;
  descripcion?: string;
  status: string;
}

// Review types
export interface ReviewCreateInput {
  calificacion?: number;
  comentarios?: string;
}

export interface ReviewResponse {
  idCalificacion: number;
  calificacion?: number;
  comentarios?: string;
  idUsuario?: number;
  createdAt?: Date;
}

// Search types
export interface SearchQuery {
  query: string;
  type?: 'recipe' | 'course';
  limit?: string;
  offset?: string;
}

export interface SearchResponse {
  recipes: { recipe: ReturnType<typeof recipeParse>, queryMatch: number }[];
  courses: { course: ReturnType<typeof courseParse>, queryMatch: number }[];
}

// Alumno type (if needed)
export interface Alumno {
  idAlumno: number;
  numeroTarjeta?: string;
  dniFrente?: string;
  dniFondo?: string;
  tramite?: string;
  cuentaCorriente?: number;
  idUsuario: number;
} 