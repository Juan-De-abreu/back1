const express = require('express');
const { getAllPlataformas, updatePlataformas, deletePlataformas, createPlataformas, getPlataformasById } = require('../controllers/plataformaController');

const router = express.Router();



// Ruta para obtener todos los platafromas
router.get('/plataformas', getAllPlataformas);

// Ruta para obtener un platafromas por ID 👇
router.get('/plataformas/:id', getPlataformasById);

// Ruta para crear un nuevo platafromas
router.post('/plataformas', createPlataformas);

// Ruta para actualizar un platafromas por ID
router.put('/plataformas/:id', updatePlataformas);

// Ruta para eliminar un platafromas por ID
router.delete('/plataformas/:id', deletePlataformas);

module.exports = router;

//  idgenero  fechapublicacion precio valoracion imagen