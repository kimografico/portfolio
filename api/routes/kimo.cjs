/**
 * Rutas para las altas del espacio Kimo.
 * Incluye libros, ilustraciones, lugares, marcadores y subida de imágenes.
 */

const express = require('express');
const multer = require('multer');
const kimoController = require('../controllers/kimoController.cjs');
const requireKimoAuth = require('../middleware/kimoAuth.cjs');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
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

router.post('/upload', requireKimoAuth, upload.array('images', 20), async (req, res, next) => {
  try {
    await kimoController.uploadKimoImages(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/books', requireKimoAuth, async (req, res, next) => {
  try {
    await kimoController.createBook(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/illustrations', requireKimoAuth, async (req, res, next) => {
  try {
    await kimoController.createIllustration(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/places', requireKimoAuth, async (req, res, next) => {
  try {
    await kimoController.createPlace(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/places-markers', requireKimoAuth, async (req, res, next) => {
  try {
    await kimoController.createPlaceMarker(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
