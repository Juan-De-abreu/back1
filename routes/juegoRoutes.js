const express = require('express');
const 
{ 
    getAllJuegos, createJuegos
    ,updateJuegos, deleteJuegos 

}= require('../controllers/juegoController');


const router = express.Router();

router.get('/juegos', getAllJuegos);
router.post('/juegos', createJuegos);
router.put("/juegos/id", updateJuegos)
router.delete("/juegos/id",deleteJuegos)

module.exports = router;