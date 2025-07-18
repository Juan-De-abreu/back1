const express = require('express');
const { getAllJuegos } = require('../controllers/juegoController');

const router = express.Router();

router.get('/juegos', getAllJuegos);

module.exports = router;