const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todas las PCL
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM PCL');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener PCL:', error);
    res.status(500).json({ error: 'Error al obtener PCL' });
  }
});

module.exports = router;
