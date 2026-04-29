/**
 * Validación de datos de entrada
 * Funciones para validar tipos, campos obligatorios, formatos, etc.
 */

const VALID_TYPES = ['gd', 'dev'];

// Mapeo de categorías válidas por tipo
const VALID_CATEGORIES = {
  gd: [
    'carteleria',
    'editorial',
    'etiquetas',
    'logotipos',
    'multimedia',
    'packaging',
    'papeleria',
    'proyectos-especiales',
  ],
  dev: ['vanilla', 'wordpress', 'frameworks'],
};

/**
 * Valida que el tipo sea 'gd' o 'dev'
 */
function validateType(type) {
  if (!type || !VALID_TYPES.includes(type)) {
    throw new Error(`Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`);
  }
  return true;
}

/**
 * Valida que la categoría es válida para el tipo
 */
function validateCategory(type, category) {
  if (!category) {
    throw new Error('Missing required field: category');
  }

  if (!VALID_CATEGORIES[type] || !VALID_CATEGORIES[type].includes(category)) {
    const validCats = VALID_CATEGORIES[type] || [];
    throw new Error(`Invalid category for type '${type}'. Must be one of: ${validCats.join(', ')}`);
  }

  return true;
}

/**
 * Valida un proyecto completo (POST/PUT)
 */
function validateProject(data, isUpdate = false) {
  const errors = [];

  // Para creación, type y category son obligatorios
  if (!isUpdate) {
    if (!data.type) errors.push('Missing required field: type');
    if (!data.category) errors.push('Missing required field: category');
  }

  // Siempre validar type si se proporciona
  if (data.type) {
    try {
      validateType(data.type);
    } catch (e) {
      errors.push(e.message);
    }
  }

  // Siempre validar category si se proporciona
  if (data.category) {
    try {
      validateCategory(data.type || 'gd', data.category);
    } catch (e) {
      errors.push(e.message);
    }
  }

  // title y cliente son obligatorios solo en creación
  if (!isUpdate) {
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push('Missing or invalid required field: title');
    }

    if (!data.cliente || typeof data.cliente !== 'string' || data.cliente.trim() === '') {
      errors.push('Missing or invalid required field: cliente');
    }
  } else {
    // En actualización, validar solo si se proporciona
    if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim() === '')) {
      errors.push('Field "title" must be a non-empty string');
    }

    if (
      data.cliente !== undefined &&
      (typeof data.cliente !== 'string' || data.cliente.trim() === '')
    ) {
      errors.push('Field "cliente" must be a non-empty string');
    }
  }

  // Validar tipos de arrays opcionales
  if (data.imagenes !== undefined && !Array.isArray(data.imagenes)) {
    errors.push('Field "imagenes" must be an array');
  }

  if (data.videos !== undefined && !Array.isArray(data.videos)) {
    errors.push('Field "videos" must be an array');
  }

  if (data.extras !== undefined && !Array.isArray(data.extras)) {
    errors.push('Field "extras" must be an array');
  }

  if (data.stack !== undefined && !Array.isArray(data.stack)) {
    errors.push('Field "stack" must be an array');
  }

  // Validar visible es boolean
  if (data.visible !== undefined && typeof data.visible !== 'boolean') {
    errors.push('Field "visible" must be a boolean');
  }

  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }

  return true;
}

/**
 * Valida que un ID es un número válido
 */
function validateId(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new Error('Invalid project ID');
  }
  return numId;
}

/**
 * Valida visibilidad (string: 'true', 'false', 'all')
 */
function validateVisibility(visible) {
  if (!visible) return null; // Si no se proporciona, devolver null (sin filtro)
  if (!['true', 'false', 'all'].includes(visible.toLowerCase())) {
    throw new Error('Invalid visibility filter. Must be "true", "false", or "all"');
  }
  return visible.toLowerCase();
}

/**
 * Valida lote de IDs para PATCH
 */
function validateIdArray(ids) {
  if (!Array.isArray(ids)) {
    throw new Error('Field "ids" must be an array');
  }

  if (ids.length === 0) {
    throw new Error('Field "ids" cannot be empty');
  }

  const validIds = ids.map((id) => validateId(id));
  return validIds;
}

module.exports = {
  validateType,
  validateCategory,
  validateProject,
  validateId,
  validateVisibility,
  validateIdArray,
  VALID_TYPES,
  VALID_CATEGORIES,
};
