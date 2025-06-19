import { Request } from 'express';

// Auth types
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    userType: 'ALUMNO' | 'INSTRUCTOR' | 'ADMIN';
  } | null;
  files?: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[];
}

export interface InitialRegisterInput {
  username: string;
  email: string;
  userType: 'ALUMNO' | 'INSTRUCTOR' | 'ADMIN';
}

export interface CompleteRegistrationInput {
  email: string;
  name: string;
  password: string;
  userType: 'ALUMNO' | 'INSTRUCTOR' | 'ADMIN';
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  tramiteNumber?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}

export interface RequestPasswordResetInput {
  email: string;
}

export interface VerifyResetTokenInput {
  email: string;
  token: string;
}

export interface ResetPasswordInput {
  email: string;
  token: string;
  newPassword: string;
}

// Recipe types
export interface RecipeCreateInput {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  time: number;
  servings: number;
  ingredients: IngredientCreateInput[];
  steps: { content: string; order: number }[];
  utensils: UtensilCreateInput[];
}

export interface RecipeResponse {
  id: number;
  title: string;
  status: string;
}

export interface IngredientCreateInput {
  name: string;
  amount: number;
  unit: string;
}

export interface UtensilCreateInput {
  name: string;
  description: string;
}

// Course types
export interface CourseCreateInput {
  title: string;
  description: string;
  type: string;
  category: string;
  difficulty: string;
  price: number;
  modules: { title: string; content: string }[];
}

export interface CourseResponse {
  id: number;
  title: string;
  status: string;
}

// Review types
export interface ReviewCreateInput {
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string;
  userId: string;
  createdAt: Date;
}

// Resource types
export interface ResourceCreateInput {
  title: string;
  description: string;
  type: string;
  url: string;
}

export interface ResourceResponse {
  id: number;
  title: string;
  status: string;
}

// Search types
export interface SearchQuery {
  query: string;
  type?: 'recipe' | 'course' | 'resource';
  limit?: string;
  offset?: string;
}

export interface SearchResponse {
  recipes: any[];
  courses: any[];
  resources: any[];
} 