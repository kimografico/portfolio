/**
 * Rutas para proyectos
 * Define todos los endpoints relacionados con proyectos
 */

const express = require('express');
const projectController = require('../controllers/projectController.cjs');
const requireKimoAuth = require('../middleware/kimoAuth.cjs');

const router = express.Router();

/**
 * GET /api/projects/:id - Obtener proyecto específico (específico primero para evitar conflictos)
 */
router.get('/:id', async (req, res, next) => {
  try {
    await projectController.getProjectById(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/projects - Listar proyectos con filtros
 */
router.get('/', async (req, res, next) => {
  try {
    await projectController.listProjects(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/projects - Crear nuevo proyecto
 */
router.post('/', requireKimoAuth, async (req, res, next) => {
  try {
    await projectController.createProject(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/projects/:id - Actualizar proyecto
 */
router.put('/:id', requireKimoAuth, async (req, res, next) => {
  try {
    await projectController.updateProject(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/projects/:id - Eliminar proyecto
 */
router.delete('/:id', requireKimoAuth, async (req, res, next) => {
  try {
    await projectController.deleteProject(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/projects/visibility - Cambiar visibilidad en lote
 * (Antes del :id para evitar conflictos de routing)
 */
router.patch('/visibility', requireKimoAuth, async (req, res, next) => {
  try {
    await projectController.updateVisibility(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
