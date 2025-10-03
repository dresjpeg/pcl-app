const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Usuario');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.rol_id, r.nombre AS rolNombre 
       FROM Usuario u 
       LEFT JOIN Rol r ON u.rol_id = r.id 
       WHERE u.email = ? AND u.password = ?`,
      [email, password]
    );
    if (rows.length > 0) {
      res.json({ usuario: rows[0] });
    } else {
      res.status(401).json({ usuario: null, mensaje: 'Credenciales incorrectas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;


