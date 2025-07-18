const express = require('express');
const router = express.Router();

const {
  getAllGeneros,
  getGeneroById,   // 👈 Importamos la nueva función
  createGenero,
  updateGenero,
  deleteGenero
} = require('../controllers/generoController');

// Ruta para obtener todos los géneros
router.get('/generos', getAllGeneros);

// Ruta para obtener un género por ID 👇
router.get('/generos/:id', getGeneroById);

// Ruta para crear un nuevo género
router.post('/generos', createGenero);

// Ruta para actualizar un género por ID
router.put('/generos/:id', updateGenero);

// Ruta para eliminar un género por ID
router.delete('/generos/:id', deleteGenero);

module.exports = router;