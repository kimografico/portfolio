/**
 * Controller para subida de imágenes
 *
 * Recibe archivos vía multipart/form-data y los guarda en:
 *   public/images/portfolio/{design|web}/{category}/{slug}{NNN}.{ext}
 *
 * Devuelve un array con las rutas públicas de las imágenes guardadas.
 */

const fs = require('fs');
const path = require('path');

/** Carpeta raíz de imágenes del portfolio */
const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'images', 'portfolio');

/** Mapeo de tipo de proyecto a carpeta */
const TYPE_DIR = {
  gd: 'design',
  dev: 'web',
};

/** Extensiones de imagen permitidas */
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];

/** Tamaño máximo por archivo: 10 MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Convierte un título a un slug seguro para nombre de archivo.
 * Ejemplo: "Prueba de subida" → "prueba-de-subida"
 */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9]+/g, '-') // caracteres no alfanuméricos → guión
    .replace(/^-+|-+$/g, '') // quitar guiones al inicio/final
    .slice(0, 60); // limitar longitud
}

/**
 * Serializa un número a 3 dígitos: 1 → "001", 12 → "012"
 */
function pad(n) {
  return String(n).padStart(3, '0');
}

/**
 * Calcula el siguiente número serial disponible en la carpeta destino
 * para un slug dado. Busca archivos que empiecen por el slug.
 */
function getNextSerial(destDir, slug) {
  if (!fs.existsSync(destDir)) return 1;

  const files = fs.readdirSync(destDir);
  const prefix = slug;
  let maxNum = 0;

  for (const file of files) {
    const name = path.parse(file).name; // sin extensión
    if (name.startsWith(prefix)) {
      // Extraer los dígitos del final: "prueba-de-subida003" → "003"
      const suffix = name.slice(prefix.length);
      const num = parseInt(suffix, 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }

  return maxNum + 1;
}

/**
 * POST /api/upload
 *
 * Body (multipart/form-data):
 *   - files: archivos de imagen (campo "images")
 *   - type: "gd" | "dev"
 *   - category: slug de la categoría (ej: "carteleria")
 *   - title: título del proyecto (se convierte a slug para el nombre de archivo)
 *
 * Respuesta:
 *   { success: true, data: [{ ruta: "/images/portfolio/design/carteleria/prueba001.jpg", label: "archivo.jpg" }] }
 */
async function uploadImages(req, res) {
  try {
    const { type, category, title } = req.body;

    // --- Validaciones ---
    if (!type || !category || !title) {
      const error = new Error('Faltan campos obligatorios: type, category, title');
      error.status = 400;
      throw error;
    }

    const typeDir = TYPE_DIR[type];
    if (!typeDir) {
      const error = new Error(`Tipo inválido: ${type}. Usar "gd" o "dev"`);
      error.status = 400;
      throw error;
    }

    if (!req.files || req.files.length === 0) {
      const error = new Error('No se han recibido archivos');
      error.status = 400;
      throw error;
    }

    // Validar extensiones y tamaño
    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        const error = new Error(
          `Extensión no permitida: ${ext}. Permitidas: ${ALLOWED_EXTENSIONS.join(', ')}`,
        );
        error.status = 400;
        throw error;
      }
      if (file.size > MAX_FILE_SIZE) {
        const error = new Error(
          `El archivo "${file.originalname}" excede el tamaño máximo de 10 MB`,
        );
        error.status = 400;
        throw error;
      }
    }

    // --- Crear directorio destino ---
    const destDir = path.join(UPLOAD_ROOT, typeDir, category);
    fs.mkdirSync(destDir, { recursive: true });

    // --- Guardar archivos ---
    const slug = slugify(title);
    let serial = getNextSerial(destDir, slug);
    const savedImages = [];

    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const fileName = `${slug}${pad(serial)}${ext}`;
      const destPath = path.join(destDir, fileName);

      // Escribir el archivo desde el buffer de multer
      fs.writeFileSync(destPath, file.buffer);

      // Ruta pública (relativa a la raíz del servidor web)
      const publicPath = `/images/portfolio/${typeDir}/${category}/${fileName}`;

      savedImages.push({
        ruta: publicPath,
        label: file.originalname.replace(/\.[^.]+$/, ''), // nombre original sin extensión
      });

      serial++;
    }

    res.status(200).json({
      success: true,
      data: savedImages,
      message: `${savedImages.length} imagen(es) subida(s) correctamente`,
    });
  } catch (error) {
    if (!error.status) error.status = 500;
    throw error;
  }
}

module.exports = { uploadImages };
