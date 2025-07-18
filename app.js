// Importamos los módulos necesarios
const express = require('express');
const cors = require('cors'); // Importamos cors
const db = require('./config/db');

// Importamos las rutas
//const juegoRoutes = require('./routes/juegoRoutes');
const generoRoutes = require('./routes/generoRoutes');
const plataformaRoutes = require('./routes/plataformaRoutes');

// Inicializamos la aplicación Express
const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente con buenas prácticas!');
});

// Usar las rutas
//app.use('/', juegoRoutes);
app.use('/', generoRoutes);
app.use('/', plataformaRoutes);

// Prueba de conexión a la base de datos
db.getConnection()
  .then(conn => {
    console.log('Conexión a MySQL exitosa!');
    conn.release();
  })
  .catch(err => {
    console.error('Error de conexión a MySQL:', err);
  });

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});