const express = require('express');
const 
{ 
    getAllclientes
}= require('../controllers/clientesController');


const router = express.Router();

router.get('/clientes', getAllclientes);


module.exports = router;