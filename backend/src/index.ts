import express, { Express, RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { file } from './middleware/file';
import { auth } from './middleware/auth';

// Routes
import authRoutes from './routes/auth.routes';
import recipeRoutes from './routes/recipe.routes';
import courseRoutes from './routes/course.routes';
import resourceRoutes from './routes/resource.routes';
import searchRoutes from './routes/search.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(file);
app.use(express.json());
app.use(auth);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/search', searchRoutes);

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
}); 