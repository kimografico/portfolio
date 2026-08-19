const express = require('express');

const router = express.Router();

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

router.post('/', async (req, res, next) => {
  try {
    const { q, countrycode } = req.body;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El parámetro q (nombre del lugar) es obligatorio',
      });
    }

    const query = countrycode ? `${q.trim()} ${countrycode.trim()}` : q.trim();

    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '1',
      'accept-language': 'es',
    });

    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        'User-Agent': 'PortfolioApp/1.0 (https://github.com/kimografico)',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim respondió con status ${response.status}`);
    }

    const results = await response.json();

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontraron resultados para esa búsqueda',
      });
    }

    const { lat, lon, display_name } = results[0];

    res.json({
      success: true,
      data: {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        display_name,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
