/* global require, process, console */
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Script: refresh-clients
 *
 * Lee la carpeta public/images/clients/ y genera src/data/clients.json
 * con una entrada por cada archivo de imagen encontrado.
 *
 * Formato de salida:
 *   [{ "name": "Logo.jpg", "rate": 1 }, ...]
 *
 * RATE:
 *   0 = nunca aparece  |  1 = frecuencia normal (default)  |  2-3 = mayor frecuencia en modo random
 *
 * Si el JSON ya existe, conserva el rate de entradas anteriores
 * para que las ediciones manuales no se pierdan al regenerar.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CLIENTS_DIR = path.join(ROOT, 'public', 'images', 'clients');
const OUTPUT_FILE = path.join(ROOT, 'src', 'data', 'clients.json');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif']);

// --- Leer el JSON existente (si existe) para conservar rates manuales ---
let existingRates = {};
if (fs.existsSync(OUTPUT_FILE)) {
  try {
    const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    for (const entry of existing) {
      if (entry.name && typeof entry.rate === 'number') {
        existingRates[entry.name] = entry.rate;
      }
    }
    console.log(`📋 Encontrado JSON existente con ${Object.keys(existingRates).length} entradas.`);
  } catch {
    console.warn('⚠️  No se pudo leer el JSON existente. Se generará desde cero.');
  }
}

// --- Leer archivos de la carpeta clients ---
if (!fs.existsSync(CLIENTS_DIR)) {
  console.error(`❌ No existe la carpeta: ${CLIENTS_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(CLIENTS_DIR).filter((file) => {
  const ext = path.extname(file).toLowerCase();
  // Ignorar archivos ocultos (.DS_Store, etc.) y no-imagen
  return !file.startsWith('.') && IMAGE_EXTENSIONS.has(ext);
});

if (files.length === 0) {
  console.warn('⚠️  No se encontraron imágenes en la carpeta clients. JSON no generado.');
  process.exit(0);
}

// --- Generar entradas conservando rates existentes ---
const entries = files
  .sort((a, b) => a.localeCompare(b)) // orden alfabético para reproducibilidad
  .map((name) => ({
    name,
    // Si ya existía la entrada, conservar su rate; si es nueva, asignar 1
    rate: Object.prototype.hasOwnProperty.call(existingRates, name) ? existingRates[name] : 1,
  }));

// --- Escribir el JSON ---
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(entries, null, 2) + '\n', 'utf-8');

console.log(`✅ clients.json generado con ${entries.length} logos en:`);
console.log(`   ${OUTPUT_FILE}`);

// Avisar si hay entradas en el JSON antiguo que ya no tienen imagen (borradas/renombradas)
const newNames = new Set(files);
const removed = Object.keys(existingRates).filter((name) => !newNames.has(name));
if (removed.length > 0) {
  console.warn(`\n⚠️  Estas entradas del JSON ya no tienen imagen y han sido eliminadas:`);
  removed.forEach((name) => console.warn(`   - ${name}`));
}
