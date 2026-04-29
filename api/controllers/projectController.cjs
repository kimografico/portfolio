/**
 * Controller para proyectos
 * Contiene la lógica de negocio para todos los endpoints
 */

const fs = require('../utils/fileSystem.cjs');
const val = require('../utils/validation.cjs');

/**
 * GET /api/projects
 * Listar proyectos con filtros opcionales
 */
async function listProjects(req, res) {
  try {
    const { type, category, visible } = req.query;

    // Cargar proyectos según filtro de tipo
    let projects;
    if (type) {
      val.validateType(type);
      projects = fs.loadProjectsByType(type);
    } else {
      projects = fs.loadAllProjects();
    }

    // Filtrar por categoría si se proporciona
    if (category) {
      projects = projects.filter((p) => p.category === category);
    }

    // Filtrar por visibilidad
    if (visible) {
      const visFilter = val.validateVisibility(visible);
      if (visFilter === 'true') {
        projects = projects.filter((p) => p.visible !== false);
      } else if (visFilter === 'false') {
        projects = projects.filter((p) => p.visible === false);
      }
      // Si es 'all', no filtrar
    }

    // Ordenar por fecha (descendente)
    projects.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB - dateA;
    });

    res.status(200).json({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    error.status = 400;
    throw error;
  }
}

/**
 * GET /api/projects/:id
 * Obtener un proyecto específico por ID
 */
async function getProjectById(req, res) {
  try {
    const id = val.validateId(req.params.id);
    const project = fs.findProjectById(id);

    if (!project) {
      const error = new Error('Project not found');
      error.status = 404;
      throw error;
    }

    // Remover campo interno _filePath
    const { _filePath, ...safeProject } = project;

    res.status(200).json({
      success: true,
      data: safeProject,
    });
  } catch (error) {
    if (!error.status) error.status = 400;
    throw error;
  }
}

/**
 * POST /api/projects
 * Crear un nuevo proyecto
 */
async function createProject(req, res) {
  try {
    const { type, category, ...projectData } = req.body;

    // Validar campos obligatorios y tipos
    val.validateProject({ type, category, ...projectData });

    // Crear proyecto
    const newProject = fs.addProject(type, category, projectData);

    res.status(201).json({
      success: true,
      data: newProject,
      message: 'Project created successfully',
    });
  } catch (error) {
    error.status = 400;
    throw error;
  }
}

/**
 * PUT /api/projects/:id
 * Actualizar un proyecto existente (parcial)
 */
async function updateProject(req, res) {
  try {
    const id = val.validateId(req.params.id);
    const updates = req.body;

    // Validar que el body no está vacío
    if (Object.keys(updates).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    // Validar campos si se modifican
    val.validateProject(updates, true);

    // Actualizar proyecto
    const updated = fs.updateProject(id, updates);

    // Remover campo interno _filePath
    const { _filePath, ...safeProject } = updated;

    res.status(200).json({
      success: true,
      data: safeProject,
      message: 'Project updated successfully',
    });
  } catch (error) {
    if (error.message === 'Project not found') {
      error.status = 404;
    } else if (!error.status) {
      error.status = 400;
    }
    throw error;
  }
}

/**
 * DELETE /api/projects/:id
 * Eliminar un proyecto
 */
async function deleteProject(req, res) {
  try {
    const id = val.validateId(req.params.id);
    fs.deleteProject(id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    if (error.message === 'Project not found') {
      error.status = 404;
    } else if (!error.status) {
      error.status = 400;
    }
    throw error;
  }
}

/**
 * PATCH /api/projects/visibility
 * Cambiar visibilidad de múltiples proyectos
 */
async function updateVisibility(req, res) {
  try {
    const { ids, visible } = req.body;

    // Validar campos
    if (ids === undefined || visible === undefined) {
      const error = new Error('Missing required fields: ids, visible');
      error.status = 400;
      throw error;
    }

    if (typeof visible !== 'boolean') {
      const error = new Error('Field "visible" must be a boolean');
      error.status = 400;
      throw error;
    }

    const validIds = val.validateIdArray(ids);

    // Actualizar en lote
    const updated = fs.updateVisibilityBatch(validIds, visible);

    res.status(200).json({
      success: true,
      message: `Visibility updated for ${updated.length} project(s)`,
      count: updated.length,
    });
  } catch (error) {
    if (!error.status) error.status = 400;
    throw error;
  }
}

/**
 * GET /api/categories
 * Listar todas las categorías disponibles
 */
async function getCategories(req, res) {
  try {
    const categories = fs.getCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    error.status = 500;
    throw error;
  }
}

module.exports = {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateVisibility,
  getCategories,
};
