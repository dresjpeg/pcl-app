const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - Obtener todos los dictámenes médicos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, u.nombre AS evaluador_nombre
      FROM dictamenmedico d
      LEFT JOIN medico m ON d.evaluador_id = m.id
      LEFT JOIN usuario u ON m.usuario_id = u.id
      ORDER BY d.id DESC  
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener dictámenes:', error);
    res.status(500).json({ error: 'Error al obtener dictámenes médicos' });
  }
});

// POST - Crear un nuevo dictamen médico
router.post('/', async (req, res) => {
  const { diagnostico, cie10, evaluador_id: usuario_id, algoritmo, resultado } = req.body;

  try {
    const [medicoRows] = await pool.query(
      'SELECT id FROM medico WHERE usuario_id = ?',
      [usuario_id]
    );

    if (medicoRows.length === 0) {
      return res.status(400).json({ error: 'Usuario no asociado a médico' });
    }

    const medico_id = medicoRows[0].id;

    await pool.query(
      `INSERT INTO dictamenmedico 
      (diagnostico, cie10, evaluador_id, algoritmo, resultado)
      VALUES (?, ?, ?, ?, ?)`,
      [diagnostico, cie10, medico_id, algoritmo, resultado]
    );

    res.json({ mensaje: 'Dictamen médico guardado exitosamente' });
  } catch (error) {
    console.error('Error guardando dictamen médico:', error);
    res.status(500).json({ error: 'Error al guardar dictamen médico' });
  }
});

module.exports = router;
