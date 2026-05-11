/**
 * Rutas para gestionar recent-works en la landing
 * Endpoints:
 * - GET /api/recent-works → devuelve trabajos recientes actuales
 * - PUT /api/recent-works → actualiza trabajos recientes
 */

const express = require('express');
const { getRecentWorks, updateRecentWorks } = require('../controllers/recentWorksController.cjs');
const requireKimoAuth = require('../middleware/kimoAuth.cjs');

const router = express.Router();

router.get('/', getRecentWorks);
router.put('/', requireKimoAuth, updateRecentWorks);

module.exports = router;
