#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, no-undef */
/**
 * imagecheck.cjs
 * Busca imágenes no referenciadas en los JSON de proyectos y permite borrarlas.
 *
 * Uso:
 *   node scripts/imagecheck.cjs           # Solo muestra la lista
 *   node scripts/imagecheck.cjs --delete  # Pide confirmación y borra las no usadas
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = process.cwd();
const DATA_ROOT = path.join(ROOT, 'src', 'data');
const IMG_ROOT = path.join(ROOT, 'public', 'images', 'portfolio');
const DESIGN_DIR = path.join(IMG_ROOT, 'design');
const WEB_DIR = path.join(IMG_ROOT, 'web');
const THUMBS_DIR = path.join(IMG_ROOT, 'thumbs');
const EXCLUDE_FILES = new Set(['_blank.jpg', 'no-cover.jpg', 'no-thumb.jpg']);
const EXCLUDE_DIRS = ['ui'];

function walkFiles(dir, exts = ['.jpg', '.jpeg', '.png', '.webp']) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !EXCLUDE_DIRS.includes(entry.name)) {
      files.push(...walkFiles(path.join(dir, entry.name), exts));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (exts.includes(ext) && !EXCLUDE_FILES.has(entry.name)) {
        files.push(path.join(dir, entry.name));
      }
    }
  }
  return files;
}

function getAllJsonFiles() {
  const result = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith('.json')) result.push(full);
    }
  }
  walk(DATA_ROOT);
  return result;
}

function getAllUsedImagesAndIds() {
  const usedImages = new Set();
  const usedThumbs = new Set();
  const allIds = new Set();
  for (const file of getAllJsonFiles()) {
    let arr;
    try {
      arr = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      continue;
    }
    if (!Array.isArray(arr)) continue;
    for (const entry of arr) {
      if (entry.id) allIds.add(String(entry.id));
      if (Array.isArray(entry.imagenes)) {
        for (const img of entry.imagenes) {
          if (img && typeof img.image === 'string' && img.image.trim()) {
            usedImages.add(img.image.trim());
          }
        }
      }
    }
  }
  return { usedImages, allIds };
}

// Devuelve un Map de basename -> [rutas completas]
function basenameMap(paths) {
  const map = new Map();
  for (const p of paths) {
    const base = path.basename(p);
    if (!map.has(base)) map.set(base, []);
    map.get(base).push(p);
  }
  return map;
}

function main() {
  // 1. Imágenes usadas en JSON
  const { usedImages, allIds } = getAllUsedImagesAndIds();

  // 2. Imágenes en disco

  const designImgs = walkFiles(DESIGN_DIR);
  const webImgs = walkFiles(WEB_DIR);
  const thumbImgs = walkFiles(THUMBS_DIR, ['.jpg']);

  const allDiskImgs = [...designImgs, ...webImgs];
  const diskImgMap = basenameMap(allDiskImgs); // basename -> [fullpath]
  const thumbImgMap = basenameMap(thumbImgs);

  // 3. Imágenes no usadas (array de rutas completas)
  const unusedImgs = [];
  for (const [base, pathsArr] of diskImgMap.entries()) {
    if (!usedImages.has(base)) unusedImgs.push(...pathsArr);
  }
  // 4. Thumbs sin proyecto (array de rutas completas)
  const unusedThumbs = [];
  for (const [base, pathsArr] of thumbImgMap.entries()) {
    const id = base.replace(/\..+$/, '');
    if (!allIds.has(id)) unusedThumbs.push(...pathsArr);
  }

  // 5. Mostrar resultados

  console.log('--- Imágenes no usadas (design/web) ---');
  if (unusedImgs.length === 0) console.log('✓ Ninguna');
  else unusedImgs.forEach((img) => console.log('  ' + path.relative(ROOT, img)));

  console.log('\n--- Thumbs sin proyecto ---');
  if (unusedThumbs.length === 0) console.log('✓ Ninguno');
  else unusedThumbs.forEach((img) => console.log('  ' + path.relative(ROOT, img)));

  if (unusedImgs.length === 0 && unusedThumbs.length === 0) return;

  // 6. Confirmación interactiva
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(
    `\n¿Eliminar ${unusedImgs.length + unusedThumbs.length} archivo(s)? (y/N): `,
    (answer) => {
      rl.close();
      if (answer.trim().toLowerCase() !== 'y') {
        console.log('No se ha borrado nada.');
        return;
      }
      // 7. Borrar archivos
      for (const img of unusedImgs) {
        if (fs.existsSync(img)) {
          fs.unlinkSync(img);
          console.log('🗑️  Borrado:', img);
        } else {
          console.log('⚠️  No encontrado para borrar:', img);
        }
      }
      for (const img of unusedThumbs) {
        if (fs.existsSync(img)) {
          fs.unlinkSync(img);
          console.log('🗑️  Borrado:', img);
        } else {
          console.log('⚠️  No encontrado para borrar:', img);
        }
      }
      console.log('Limpieza completada.');
    },
  );
}

main();
