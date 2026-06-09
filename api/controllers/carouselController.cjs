/**
 * Controlador para gestionar carousel.json
 * Proporciona endpoints para leer y actualizar las imágenes del carrusel de la home.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || 'src/data';
const CAROUSEL_PATH = path.join(process.cwd(), DATA_DIR, 'carousel.json');

function readCarousel() {
  try {
    if (!fs.existsSync(CAROUSEL_PATH)) {
      return [];
    }
    const data = fs.readFileSync(CAROUSEL_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading carousel.json:', error);
    throw new Error(`Error reading carousel.json: ${error.message}`);
  }
}

function writeCarousel(data) {
  try {
    const dir = path.dirname(CAROUSEL_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CAROUSEL_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing carousel.json:', error);
    throw new Error(`Error writing carousel.json: ${error.message}`);
  }
}

/**
 * GET /api/carousel
 * Devuelve la lista de imágenes del carrusel
 */
function getCarousel(req, res) {
  try {
    const data = readCarousel();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * PUT /api/carousel
 * Actualiza el carousel.json con el array de imágenes proporcionado.
 * Body esperado: { data: [{ src: string, alt: string }] }
 */
function updateCarousel(req, res) {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: 'El campo "data" debe ser un array',
      });
    }

    for (const item of data) {
      if (!item.src || typeof item.src !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Cada imagen debe tener el campo "src" como string',
        });
      }
    }

    writeCarousel(data);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getCarousel, updateCarousel };
