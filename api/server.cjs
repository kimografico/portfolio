/**
 * Servidor API REST
 * Punto de entrada principal del backend
 * Ejecutar con: node api/server.cjs
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const projectsRouter = require('./routes/projects.cjs');
const uploadRouter = require('./routes/upload.cjs');
const recentWorksRouter = require('./routes/recent-works.cjs');
const resumeRouter = require('./routes/resume.cjs');
const kimoRouter = require('./routes/kimo.cjs');
const errorHandler = require('./middleware/errorHandler.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// CORS: permitir localhost:5173 (puerto por defecto de Vite)
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  }),
);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Rutas
app.use('/api/projects', projectsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/recent-works', recentWorksRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/kimo', kimoRouter);

/**
 * GET /api/categories
 * Endpoint directo para listar categorías
 */
app.get('/api/categories', (req, res, next) => {
  try {
    const projectController = require('./controllers/projectController.cjs');
    projectController.getCategories(req, res);
  } catch (error) {
    next(error);
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
  });
});

// Error handler (SIEMPRE al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📁 Data directory: ${process.env.DATA_DIR || 'src/data'}`);
  console.log(`🌐 CORS enabled for: http://localhost:5173`);
});
