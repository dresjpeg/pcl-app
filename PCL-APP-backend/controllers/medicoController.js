const pool = require('../config/db');

// Obtener todos los médicos
const obtenerMedicos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Medico');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener médicos:', error);
    res.status(500).json({ error: 'Error al obtener médicos', detalle: error.message });
  }
};

module.exports = { obtenerMedicos };
