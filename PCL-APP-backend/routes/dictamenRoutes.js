const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/dictamen-medico
router.post('/', async (req, res) => {
  // Recibe usuario_id en lugar de medico_id
  const { diagnostico, cie10, evaluador_id: usuario_id, algoritmo, resultado } = req.body;

  try {
    // Consulta el medico_id basado en usuario_id
    const [medicoRows] = await pool.query(
      'SELECT id FROM Medico WHERE usuario_id = ?',
      [usuario_id]
    );

    if (medicoRows.length === 0) {
      return res.status(400).json({ error: 'Usuario no asociado a médico' });
    }

    const medico_id = medicoRows[0].id;

    // Ahora inserta usando medico_id como evaluador_id
    await pool.query(
      `INSERT INTO DictamenMedico 
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
