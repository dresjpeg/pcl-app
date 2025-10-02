const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const pclRoutes = require('./routes/pclRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

// Usar rutas
app.use('/api/pcl', pclRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend hospitalDB funcionando correctamente');
});

// Probar conexión a base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = require('./config/db');
    const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
    res.json({ mensaje: 'Conexión exitosa a MySQL', resultado: rows[0].resultado });
  } catch (error) {
    res.status(500).json({ error: 'Error de conexión a MySQL', detalle: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
