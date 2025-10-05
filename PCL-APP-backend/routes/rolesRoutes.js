const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Listar todos los roles
router.get('/', async (req, res) => {
  try {
    const [roles] = await pool.query('SELECT * FROM Rol');
    res.json(roles);
  } catch (error) {
    console.error('Error obteniendo roles:', error);
    res.status(500).json({ error: 'Error obteniendo roles' });
  }
});

module.exports = router;
