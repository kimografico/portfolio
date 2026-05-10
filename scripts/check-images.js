import fs from 'fs';
import path from 'path';

const IMAGE_DIRS = [
  path.join(process.cwd(), 'public', 'images'),
  // Puedes añadir más carpetas si tienes imágenes en otros sitios
];

const MB = 1024 * 1024;
const WARNING_LIMIT = 1 * MB;
const ERROR_LIMIT = 2.5 * MB;

let hasError = false;
let hasWarning = false;

function checkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      checkDir(fullPath);
    } else if (isImage(file)) {
      if (stat.size > ERROR_LIMIT) {
        console.error(
          `\n❌ Imagen demasiado grande (>2.5MB): ${fullPath} (${(stat.size / MB).toFixed(2)} MB)`,
        );
        hasError = true;
      } else if (stat.size > WARNING_LIMIT) {
        console.warn(`\n⚠️  Imagen grande (>1MB): ${fullPath} (${(stat.size / MB).toFixed(2)} MB)`);
        hasWarning = true;
      }
    }
  }
}

function isImage(filename) {
  return /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(filename);
}

console.log('\n🔎 Comprobando tamaño de imágenes...');
IMAGE_DIRS.forEach(checkDir);

if (!hasError && !hasWarning) {
  console.log('✅ Todas las imágenes están dentro de los límites.');
}
if (hasError) {
  console.error('\n❌ Hay imágenes que superan los 2.5MB. Corrige antes de continuar.');
  process.exit(1);
}
if (hasWarning) {
  console.warn('\n⚠️  Hay imágenes grandes (>1MB). Considera optimizarlas.');
}
