const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 1. Obtener todos los usuarios y su rol
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.nombre, u.email, u.activo, u.rol_id, r.nombre AS rol
      FROM Usuario u
      LEFT JOIN Rol r ON u.rol_id = r.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// 2. Login
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

// 3. Crear usuario
router.post('/', async (req, res) => {
  const { nombre, email, password, rol_id, activo } = req.body;
  try {
    await pool.query(
      `INSERT INTO Usuario (nombre, email, password, activo, rol_id) VALUES (?, ?, ?, ?, ?)`,
      [nombre, email, password, activo ?? true, rol_id]
    );
    res.json({ mensaje: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: 'Error creando usuario' });
  }
});

router.put('/:id', async (req, res) => {
  const { nombre, email, password, rol_id, activo } = req.body;
  const usuarioId = req.params.id;

  try {
    if (typeof password === 'undefined' || password === '') {
      // No cambiar contraseña
      await pool.query(
        `UPDATE Usuario SET nombre=?, email=?, rol_id=?, activo=? WHERE id=?`,
        [nombre, email, rol_id, activo, usuarioId]
      );
    } else {
      // Cambiar contraseña
      await pool.query(
        `UPDATE Usuario SET nombre=?, email=?, password=?, rol_id=?, activo=? WHERE id=?`,
        [nombre, email, password, rol_id, activo, usuarioId]
      );
    }
    res.json({ mensaje: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error editando usuario:', error);
    res.status(500).json({ error: 'Error editando usuario' });
  }
});

// 5. Eliminar usuario (opcional)
router.delete('/:id', async (req, res) => {
  try {
    await pool.query(`DELETE FROM Usuario WHERE id=?`, [req.params.id]);
    res.json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error eliminando usuario' });
  }
});

module.exports = router;
