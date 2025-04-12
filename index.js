import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './lib/DB.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
dotenv.config()
// Routes
import authRoutes from './routes/auth.routes.js';
// import userRoutes from './routes/user.routes.js';

const app = express();

// Connect to MongoDB

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Hungerz Backend API');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  connectDB()
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});