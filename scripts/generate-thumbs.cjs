/* global require, process, console */
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Script para generar thumbnails optimizados de proyectos
 *
 * Modos de ejecución:
 *   node scripts/generate-thumbs.cjs               → Regenera TODOS los thumbs
 *   node scripts/generate-thumbs.cjs --new        → Genera solo los que FALTAN
 *   node scripts/generate-thumbs.cjs --id 023     → Genera thumb de UN proyecto específico
 *
 * Resultado:
 *   - Thumbs guardados en: public/images/portfolio/thumbs/{id}.jpg
 *   - Tamaño máximo: 400px de ancho, altura proporcional
 *   - Formato: JPEG (optimizado para web)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = process.cwd();
const DATA_ROOT = path.join(ROOT, 'src', 'data');
const THUMBS_DIR = path.join(ROOT, 'public', 'images', 'portfolio', 'thumbs');
const APP_BASENAME = '/portfolio';

const THUMB_WIDTH = 500;

// --- Parsear argumentos ---
const args = new Set(process.argv.slice(2));
const isNew = args.has('--new');

// Buscar --id=XXX, --id XXX, o varios ids: --id 5 6 7
let idArgs = [];
const idEq = process.argv.find((arg) => arg.startsWith('--id='));
if (idEq) {
  idArgs = [idEq.split('=')[1]];
} else {
  const idIndex = process.argv.indexOf('--id');
  if (idIndex !== -1) {
    // Recoge todos los argumentos después de --id que no empiezan por --
    for (let i = idIndex + 1; i < process.argv.length; i++) {
      if (process.argv[i].startsWith('--')) break;
      idArgs.push(process.argv[i]);
    }
  }
}

function printHelp() {
  console.log(
    `\nUSO:\n  pnpm thumbs            # Regenera TODOS los thumbs\n  pnpm thumbs:new        # Genera solo los que FALTAN\n  pnpm thumbs:id 5 6 7   # Genera thumbs para los IDs indicados\n`,
  );
}

console.log('------------------------------------');
console.log('Iniciando generador de thumbnails...');
console.log('------------------------------------\n');

// --- Utilidades ---

function walkJsonFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkJsonFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files.filter((filePath) => {
    const normalized = filePath.replace(/\\/g, '/');
    return (
      normalized.includes('/src/data/graphic-design/') ||
      normalized.includes('/src/data/development/')
    );
  });
}

function ensureThumbsDir() {
  if (!fs.existsSync(THUMBS_DIR)) {
    fs.mkdirSync(THUMBS_DIR, { recursive: true });
    console.log(`Carpeta creada: ${THUMBS_DIR}`);
  }
}

function getThumbPath(projectId) {
  return path.join(THUMBS_DIR, `${projectId}.jpg`);
}

function thumbExists(projectId) {
  return fs.existsSync(getThumbPath(projectId));
}

async function generateThumbFromUrl(projectId, imageUrl) {
  try {
    // Convertir URL pública a ruta local
    // URL: /portfolio/images/portfolio/web/vanilla/project001.jpg
    // Ruta: public/images/portfolio/web/vanilla/project001.jpg
    const urlPath = imageUrl.replace(APP_BASENAME, '').replace(/^\//, '');
    const imagePath = path.join(ROOT, 'public', urlPath);

    if (!fs.existsSync(imagePath)) {
      console.warn(`  ⚠️  Imagen no encontrada: ${imagePath}`);
      return false;
    }

    const thumbPath = getThumbPath(projectId);

    // Redimensionar y guardar
    await sharp(imagePath)
      .resize(THUMB_WIDTH, undefined, {
        withoutEnlargement: true,
        fit: 'cover',
      })
      .jpeg({ quality: 80 })
      .toFile(thumbPath);

    return true;
  } catch (error) {
    console.error(`  ❌  Error generando thumb para proyecto ${projectId}:`, error.message);
    return false;
  }
}

async function run() {
  ensureThumbsDir();

  // --- Leer todos los proyectos ---
  const jsonFiles = walkJsonFiles(DATA_ROOT).sort();
  const projects = [];

  for (const filePath of jsonFiles) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(raw);

      // Extraer type y category del filePath
      // Ejemplo: src/data/graphic-design/logotipos.json
      let type = null;
      let category = null;
      const normalized = filePath.replace(/\\/g, '/');
      if (normalized.includes('/src/data/graphic-design/')) {
        type = 'gd';
        const match = normalized.match(/graphic-design\/([^/]+)\.json/);
        category = match ? match[1] : null;
      } else if (normalized.includes('/src/data/development/')) {
        type = 'dev';
        const match = normalized.match(/development\/([^/]+)\.json/);
        category = match ? match[1] : null;
      }

      if (Array.isArray(data)) {
        for (const project of data) {
          if (project.id && Array.isArray(project.imagenes) && project.imagenes.length > 0) {
            const firstImage = project.imagenes[0];
            // Ahora guardamos solo el nombre del archivo en 'image'
            if (firstImage && firstImage.image && type && category) {
              // Reconstruir la URL usando type, category e image
              const typeDir = type === 'gd' ? 'design' : 'web';
              const imageUrl = `/portfolio/images/portfolio/${typeDir}/${category}/${firstImage.image}`;
              projects.push({
                id: project.id,
                title: project.title || `Project ${project.id}`,
                imageUrl: imageUrl,
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️  Error leyendo ${filePath}:`, error.message);
    }
  }

  console.log(`👍 Encontrados ${projects.length} proyectos\n`);

  // --- Filtrar según modo ---
  let toProcess = projects;

  if (process.argv.includes('--id')) {
    // Si se pasa --id pero ningún id, mostrar ayuda y salir
    if (idArgs.length === 0 || (idArgs.length === 1 && !idArgs[0])) {
      console.log('⚠️  Debes indicar uno o más IDs tras --id.');
      console.log('   Ejemplo: pnpm thumbs:id 5 6 7\n');
      printHelp();
      return;
    }
    // Modo --id 5 6 7 ...
    const found = projects.filter((p) => idArgs.includes(String(p.id)));
    const notFound = idArgs.filter((id) => !projects.some((p) => String(p.id) === id));
    if (found.length === 0) {
      console.warn(`⚠️  No hay ningún proyecto con los IDs: ${idArgs.join(', ')}`);
      printHelp();
      process.exit(1);
    }
    if (notFound.length > 0) {
      console.warn(`⚠️  IDs no encontrados: ${notFound.join(', ')}\n`);
    }
    toProcess = found;
    console.log(`Modo: --id ${idArgs.join(', ')} (${toProcess.length} proyecto(s))\n`);
  } else if (isNew) {
    // Modo --new: solo los que faltan
    toProcess = projects.filter((p) => !thumbExists(p.id));
    console.log(`Modo: --new (${toProcess.length} nuevos)\n`);
  } else {
    // Modo default: todos
    console.log(`Modo: default (regenerando todos)\n`);
  }

  if (toProcess.length === 0) {
    if (idArgs.length > 0) {
      printHelp();
    } else {
      console.log('🤷 No hay thumbs para generar. ✓');
    }
    return;
  }

  // --- Generar thumbs ---
  let success = 0;
  let failed = 0;

  for (const project of toProcess) {
    process.stdout.write(`  [${project.id}] ${project.title.substring(0, 50)}... `);
    const ok = await generateThumbFromUrl(project.id, project.imageUrl);
    if (ok) {
      console.log('✓');
      success++;
    } else {
      console.log('✗');
      failed++;
    }
  }

  console.log(`\n👍 Completado: ${success} ✓ | ${failed} ✗`);

  if (failed === 0) {
    console.log('\n\n✅ Todos los thumbs generados correctamente. ✅');
  }
}

run().catch((error) => {
  console.error('❌ ERROR FATAL:', error.message);
  process.exit(1);
});
