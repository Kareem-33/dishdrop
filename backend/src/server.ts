import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './config/db';
import userRoutes from './modules/user/user.route';
import recipeRoutes from './modules/recipe/recipe.route';
import collectionRoutes from './modules/collection/collection.route';
import savedRoutes from './modules/saved/saved.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2525;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

//cors
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/collections', collectionRoutes);
app.use('/api/v1/saved', savedRoutes);


app.listen(PORT, () => {
  console.log(`Running server on port: http://localhost:${PORT}/api/v1/`);
  connectDB();
})