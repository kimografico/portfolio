/**
 * Rutas para gestionar resume.json
 */

const express = require('express');
const { getResume, updateResume } = require('../controllers/resumeController.cjs');
const requireKimoAuth = require('../middleware/kimoAuth.cjs');

const router = express.Router();

router.get('/', getResume);
router.put('/', requireKimoAuth, updateResume);

module.exports = router;
