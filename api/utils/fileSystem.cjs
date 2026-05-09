/**
 * Utilidades para lectura/escritura de archivos JSON
 * Maneja rutas, carga, guardado y búsqueda de proyectos
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || 'src/data';

/**
 * Construye la ruta completa a un archivo JSON
 */
function getFilePath(type, category) {
  const typeDir = type === 'gd' ? 'graphic-design' : type === 'dev' ? 'development' : null;

  if (!typeDir) {
    throw new Error(`Invalid type: ${type}`);
  }

  return path.join(process.cwd(), DATA_DIR, typeDir, `${category}.json`);
}

/**
 * Lee un archivo JSON y devuelve el array de proyectos
 */
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading file ${filePath}: ${error.message}`);
  }
}

/**
 * Escribe un array de proyectos a un archivo JSON con formato legible
 */
function writeJsonFile(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`Error writing file ${filePath}: ${error.message}`);
  }
}

/**
 * Carga todos los proyectos de un tipo (gd o dev)
 * Devuelve array con metadata del archivo (type, category)
 */
function loadProjectsByType(type) {
  const { VALID_CATEGORIES } = require('./validation.cjs');
  const categories = VALID_CATEGORIES[type];

  if (!categories) {
    throw new Error(`Invalid type: ${type}`);
  }

  const allProjects = [];

  categories.forEach((category) => {
    try {
      const filePath = getFilePath(type, category);
      const projects = readJsonFile(filePath);

      // Añadir metadata a cada proyecto
      const enriched = projects.map((proj) => ({
        ...proj,
        type,
        category,
      }));

      allProjects.push(...enriched);
    } catch (error) {
      console.warn(`Warning: Could not load ${type}/${category}: ${error.message}`);
    }
  });

  return allProjects;
}

/**
 * Carga todos los proyectos de todas las categorías
 */
function loadAllProjects() {
  const gd = loadProjectsByType('gd');
  const dev = loadProjectsByType('dev');
  return [...gd, ...dev];
}

/**
 * Busca un proyecto por ID en todos los archivos
 * Devuelve el proyecto con metadata (type, category) e info del archivo
 */
function findProjectById(id) {
  const allProjects = loadAllProjects();
  const project = allProjects.find((p) => p.id === id);

  if (!project) {
    return null;
  }

  // Devolver proyecto con información de ubicación
  return {
    ...project,
    _filePath: getFilePath(project.type, project.category),
  };
}

/**
 * Encuentra el máximo ID en un archivo JSON
 */
function getMaxId(filePath) {
  const projects = readJsonFile(filePath);
  if (projects.length === 0) return 0;
  return Math.max(...projects.map((p) => p.id || 0));
}

/**
 * Encuentra el máximo ID en TODOS los proyectos (todas las categorías y tipos)
 * Esto evita duplicados de IDs entre diferentes categorías
 */
function getMaxIdGlobally() {
  try {
    const allProjects = loadAllProjects();
    if (allProjects.length === 0) return 0;
    return Math.max(...allProjects.map((p) => p.id || 0));
  } catch (error) {
    console.warn('Warning: Could not get global max ID:', error.message);
    return 0;
  }
}

/**
 * Genera un nuevo ID único considerando TODOS los proyectos
 * (máximo ID global + 1)
 */
function generateNewId(type, category) {
  const maxId = getMaxIdGlobally();
  return maxId + 1;
}

/**
 * Añade un nuevo proyecto a un archivo JSON
 */
function addProject(type, category, projectData) {
  const filePath = getFilePath(type, category);
  const projects = readJsonFile(filePath);

  const newId = generateNewId(type, category);
  // Si projectData ya tiene una fecha, usarla; si no, generar la actual
  const dateToUse = projectData.date || new Date().toISOString().replace('T', ' ').slice(0, 16);

  const newProject = {
    id: newId,
    date: dateToUse,
    ...projectData,
  };

  projects.push(newProject);
  writeJsonFile(filePath, projects);

  return {
    ...newProject,
    type,
    category,
  };
}

/**
 * Actualiza un proyecto existente (parcial)
 */
function updateProject(id, updates) {
  const project = findProjectById(id);

  if (!project) {
    throw new Error('Project not found');
  }

  const filePath = project._filePath;
  const projects = readJsonFile(filePath);

  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error('Project not found');
  }

  // Actualizar solo los campos proporcionados
  projects[index] = {
    ...projects[index],
    ...updates,
  };

  writeJsonFile(filePath, projects);

  return {
    ...projects[index],
    type: project.type,
    category: project.category,
  };
}

/**
 * Elimina un proyecto
 */
function deleteProject(id) {
  const project = findProjectById(id);

  if (!project) {
    throw new Error('Project not found');
  }

  const filePath = project._filePath;
  const projects = readJsonFile(filePath);

  const filteredProjects = projects.filter((p) => p.id !== id);

  if (filteredProjects.length === projects.length) {
    throw new Error('Project not found');
  }

  writeJsonFile(filePath, filteredProjects);
  return true;
}

/**
 * Actualiza la visibilidad de múltiples proyectos
 */
function updateVisibilityBatch(ids, visible) {
  const updated = [];

  ids.forEach((id) => {
    try {
      const result = updateProject(id, { visible });
      updated.push(result);
    } catch (error) {
      console.warn(`Warning: Could not update project ${id}: ${error.message}`);
    }
  });

  return updated;
}

/**
 * Devuelve todas las categorías disponibles
 */
function getCategories() {
  const { VALID_CATEGORIES } = require('./validation.cjs');
  return {
    gd: VALID_CATEGORIES.gd,
    dev: VALID_CATEGORIES.dev,
  };
}

module.exports = {
  getFilePath,
  readJsonFile,
  writeJsonFile,
  loadProjectsByType,
  loadAllProjects,
  findProjectById,
  getMaxId,
  generateNewId,
  addProject,
  updateProject,
  deleteProject,
  updateVisibilityBatch,
  getCategories,
};
