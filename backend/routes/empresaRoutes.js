// routes/empresaRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// 🧠 Crear empresa
router.post('/', async (req, res) => {
  const { nombre, tono = 'neutral', emoji = '🤖', firma = '', color = '#333' } = req.body;

  if (!nombre) return res.status(400).json({ error: 'El nombre de la empresa es obligatorio' });

  try {
    const result = await pool.query(
      `INSERT INTO empresas (nombre, tono, emoji, firma, color)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, tono, emoji, firma, color]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear empresa:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 🔍 Obtener todas las empresas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM empresas ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener empresas:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 🔧 Actualizar empresa
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, tono, emoji, firma, color } = req.body;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const result = await pool.query(
      `UPDATE empresas SET
        nombre = $1,
        tono = $2,
        emoji = $3,
        firma = $4,
        color = $5
       WHERE id = $6
       RETURNING *`,
      [nombre, tono, emoji, firma, color, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar empresa:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
