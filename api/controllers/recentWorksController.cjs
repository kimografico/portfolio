/**
 * Controlador para gestionar recent-works.json
 * Proporciona endpoints para leer y actualizar trabajos recientes en la landing
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || 'src/data';
const RECENT_WORKS_PATH = path.join(process.cwd(), DATA_DIR, 'recent-works.json');

/**
 * Leer el archivo recent-works.json
 */
function readRecentWorks() {
  try {
    if (!fs.existsSync(RECENT_WORKS_PATH)) {
      return [];
    }
    const data = fs.readFileSync(RECENT_WORKS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading recent-works.json:', error);
    throw new Error(`Error reading recent-works.json: ${error.message}`);
  }
}

/**
 * Escribir el archivo recent-works.json
 */
function writeRecentWorks(data) {
  try {
    const dir = path.dirname(RECENT_WORKS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(RECENT_WORKS_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing recent-works.json:', error);
    throw new Error(`Error writing recent-works.json: ${error.message}`);
  }
}

/**
 * GET /api/recent-works
 * Devuelve todos los trabajos recientes
 */
function getRecentWorks(req, res) {
  try {
    const recentWorks = readRecentWorks();
    res.json({
      success: true,
      data: recentWorks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * PUT /api/recent-works
 * Actualiza el archivo de recent-works con los datos proporcionados
 * Body esperado: { data: array de proyectos seleccionados }
 */
function updateRecentWorks(req, res) {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: 'El campo "data" debe ser un array',
      });
    }

    // Validar que cada entrada tenga los campos requeridos
    const required = ['num', 'title', 'tipo', 'year', 'category', 'href'];
    for (const item of data) {
      for (const field of required) {
        if (!(field in item)) {
          return res.status(400).json({
            success: false,
            error: `Campo requerido faltante: ${field}`,
          });
        }
      }
    }

    writeRecentWorks(data);

    res.json({
      success: true,
      message: 'recent-works.json actualizado correctamente',
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  getRecentWorks,
  updateRecentWorks,
};
