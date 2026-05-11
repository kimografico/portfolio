/**
 * Ruta para subida de imágenes
 * Usa multer en modo memory storage (buffer) para máximo control
 */

const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController.cjs');
const requireKimoAuth = require('../middleware/kimoAuth.cjs');

const router = express.Router();

/**
 * Configuración de multer:
 * - memoryStorage: guarda el archivo en buffer (RAM), no en disco temporal.
 *   El controller se encarga de escribirlo en la ruta final.
 * - limits: máximo 20 archivos, 10 MB por archivo.
 * - fileFilter: solo acepta imágenes.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 20,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
    }
  },
});

/**
 * POST /api/upload
 * Subir imágenes de un proyecto.
 * Campo del formulario: "images" (array de archivos)
 * Campos de texto: type, category, title
 */
router.post('/', requireKimoAuth, upload.array('images', 20), async (req, res, next) => {
  try {
    await uploadController.uploadImages(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
