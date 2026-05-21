const express = require('express');
const router = express.Router();
const { getCarousel, updateCarousel } = require('../controllers/carouselController.cjs');

router.get('/', getCarousel);
router.put('/', updateCarousel);

module.exports = router;
