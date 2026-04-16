// routes/publicacionRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// 🔍 Obtener todas las publicaciones
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM publicaciones ORDER BY fecha DESC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener todas las publicaciones:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 📝 Crear nueva publicación
router.post('/', async (req, res) => {
  const { empresaId, contenido, fecha, estado } = req.body;

  if (!empresaId || isNaN(parseInt(empresaId)) || !contenido) {
    return res.status(400).json({ error: 'Datos inválidos para crear publicación' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO publicaciones (empresa_id, contenido, fecha, estado)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        empresaId,
        contenido,
        fecha || new Date(),
        estado || 'pendiente'
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear publicación:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 🔍 Obtener publicaciones por empresa
router.get('/:empresaId', async (req, res) => {
  const { empresaId } = req.params;

  if (!empresaId || isNaN(parseInt(empresaId))) {
    return res.status(400).json({ error: 'empresaId inválido' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM publicaciones
       WHERE empresa_id = $1
       ORDER BY fecha DESC`,
      [empresaId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener publicaciones por empresa:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
