/**
 * Rutas para gestionar recent-works en la landing
 * Endpoints:
 * - GET /api/recent-works → devuelve trabajos recientes actuales
 * - PUT /api/recent-works → actualiza trabajos recientes
 */

const express = require('express');
const { getRecentWorks, updateRecentWorks } = require('../controllers/recentWorksController.cjs');

const router = express.Router();

router.get('/', getRecentWorks);
router.put('/', updateRecentWorks);

module.exports = router;
