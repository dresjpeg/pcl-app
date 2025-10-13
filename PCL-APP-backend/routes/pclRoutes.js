const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 1. Obtener todas las PCL
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, u.nombre as solicitante_nombre 
      FROM PCL p
      LEFT JOIN Usuario u ON p.solicitante_id = u.id
      ORDER BY p.fecha DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener PCL:', error);
    res.status(500).json({ error: 'Error al obtener PCL' });
  }
});

// 2. Obtener estadísticas para el dashboard
router.get('/stats', async (req, res) => {
  try {
    const [total] = await pool.query('SELECT COUNT(*) as total FROM PCL');
    const [pendientes] = await pool.query('SELECT COUNT(*) as pendientes FROM PCL WHERE estado = "pendiente"');
    const [aprobados] = await pool.query('SELECT COUNT(*) as aprobados FROM PCL WHERE estado = "aprobado"');
    const [rechazados] = await pool.query('SELECT COUNT(*) as rechazados FROM PCL WHERE estado = "rechazado"');
    
    // Últimos 5 PCL
    const [recientes] = await pool.query(`
      SELECT p.*, u.nombre as solicitante_nombre 
      FROM PCL p
      LEFT JOIN Usuario u ON p.solicitante_id = u.id
      ORDER BY p.fecha DESC
      LIMIT 5
    `);

    res.json({
      total: total[0].total,
      pendientes: pendientes[0].pendientes,
      aprobados: aprobados[0].aprobados,
      rechazados: rechazados[0].rechazados,
      recientes: recientes
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// 3. Obtener un PCL por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, u.nombre as solicitante_nombre 
      FROM PCL p
      LEFT JOIN Usuario u ON p.solicitante_id = u.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'PCL no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener PCL:', error);
    res.status(500).json({ error: 'Error al obtener PCL' });
  }
});

// 4. Crear un nuevo PCL
router.post('/', async (req, res) => {
  const { fecha, estado, paciente, solicitante_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO PCL (fecha, estado, paciente, solicitante_id) VALUES (?, ?, ?, ?)',
      [fecha, estado || 'pendiente', paciente, solicitante_id]
    );
    res.json({ 
      mensaje: 'PCL creado exitosamente', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error al crear PCL:', error);
    res.status(500).json({ error: 'Error al crear PCL' });
  }
});

// 5. Actualizar un PCL
router.put('/:id', async (req, res) => {
  const { fecha, estado, paciente } = req.body;
  try {
    await pool.query(
      'UPDATE PCL SET fecha = ?, estado = ?, paciente = ? WHERE id = ?',
      [fecha, estado, paciente, req.params.id]
    );
    res.json({ mensaje: 'PCL actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar PCL:', error);
    res.status(500).json({ error: 'Error al actualizar PCL' });
  }
});

// 6. Eliminar un PCL
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM PCL WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'PCL eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar PCL:', error);
    res.status(500).json({ error: 'Error al eliminar PCL' });
  }
});

module.exports = router;