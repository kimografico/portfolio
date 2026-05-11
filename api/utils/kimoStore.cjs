/**
 * Utilidades para leer y escribir los JSON del espacio Kimo.
 * Mantiene aislada la lógica de rutas, lectura, guardado e IDs únicos.
 */

const fs = require('fs');
const path = require('path');

const KIMO_DATA_DIR = path.join(process.cwd(), 'src', 'data', 'kimo');

function getKimoFilePath(fileName) {
  return path.join(KIMO_DATA_DIR, fileName);
}

function readJsonFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Error reading file ${filePath}: ${error.message}`);
  }
}

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

function loadCollection(fileName) {
  return readJsonFile(getKimoFilePath(fileName));
}

function saveCollection(fileName, data) {
  writeJsonFile(getKimoFilePath(fileName), data);
}

function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function ensureUniqueStringId(items, id, label) {
  if (items.some((item) => String(item.id) === String(id))) {
    const error = new Error(`${label} with id '${id}' already exists`);
    error.status = 409;
    throw error;
  }
}

function generatePrefixedSequentialId(items, prefix) {
  const used = items
    .map((item) => String(item.id ?? ''))
    .filter((id) => id.startsWith(`${prefix}-`));

  let max = 0;
  for (const id of used) {
    const suffix = id.slice(prefix.length + 1);
    const parsed = Number(suffix);
    if (Number.isInteger(parsed) && parsed > max) {
      max = parsed;
    }
  }

  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

function createUniqueSlugId(items, seed, fallbackPrefix) {
  const base = slugify(seed) || fallbackPrefix;
  let candidate = base;
  let counter = 2;

  while (items.some((item) => String(item.id) === candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  return candidate;
}

function ensureNumeric(value, fieldName) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    const error = new Error(`Field "${fieldName}" must be a valid number`);
    error.status = 400;
    throw error;
  }
  return num;
}

module.exports = {
  getKimoFilePath,
  loadCollection,
  saveCollection,
  slugify,
  ensureUniqueStringId,
  generatePrefixedSequentialId,
  createUniqueSlugId,
  ensureNumeric,
};
