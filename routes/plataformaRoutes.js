const express = require('express');
const { getAllPlataformas, updatePlataformas, deletePlataformas, createPlataformas, getPlataformasById } = require('../controllers/plataformaController');
const { getAllJuegos, getJuegosById, createJuegos, updateJuegos, deleteJuegos } = require('../controllers/juegosController');

const router = express.Router();



// Ruta para obtener todos los juegos
router.get('/plataformas', getAllPlataformas);

// Ruta para obtener un juegos por ID 👇
router.get('/plataformas/:id', getPlataformasById);

// Ruta para crear un nuevo juegos
router.post('/plataformas', createPlataformas);

// Ruta para actualizar un juegos por ID
router.put('/plataformas/:id', updatePlataformas);

// Ruta para eliminar un juegos por ID
router.delete('/plataformas/:id', deletePlataformas);

module.exports = router;