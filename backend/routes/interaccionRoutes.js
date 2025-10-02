const express = require('express');
const router = express.Router();
const pool = require('../db'); // usa tu archivo db.js

// 🔍 Obtener todas las interacciones
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM interacciones ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener interacciones:', error);
    res.status(500).json({ error: error.message });
  }
});

// 🔍 Obtener interacciones por empresa
router.get('/:empresaId', async (req, res) => {
  const { empresaId } = req.params;

  if (!empresaId || isNaN(parseInt(empresaId))) {
    return res.status(400).json({ error: 'empresaId inválido' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM interacciones WHERE empresa_id = $1 ORDER BY id DESC',
      [empresaId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener interacciones por empresa:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
