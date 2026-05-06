/**
 * Rutas para gestionar resume.json
 */

const express = require('express');
const { getResume, updateResume } = require('../controllers/resumeController.cjs');

const router = express.Router();

router.get('/', getResume);
router.put('/', updateResume);

module.exports = router;
