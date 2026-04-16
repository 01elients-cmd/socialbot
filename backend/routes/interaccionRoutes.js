// routes/interaccionRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/interacciones  → registrar una interacción
router.post('/', async (req, res) => {
  const { empresaId, mensajeUsuario, respuestaBot, reaccion, modo = 'normal' } = req.body;

  const id = parseInt(empresaId);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'empresaId debe ser un número válido' });
  }
  if (!mensajeUsuario || typeof mensajeUsuario !== 'string') {
    return res.status(400).json({ error: 'mensajeUsuario es requerido' });
  }
  if (!respuestaBot || typeof respuestaBot !== 'string') {
    return res.status(400).json({ error: 'respuestaBot es requerido' });
  }

  try {
    await pool.query(
      `INSERT INTO interacciones (empresa_id, tipo, respuesta, reaccion, modo)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, 'respuesta', respuestaBot, reaccion || null, modo]
    );
    res.status(201).json({ mensaje: 'Interacción guardada' });
  } catch (error) {
    console.error('❌ Error al guardar interacción:', error.message);
    res.status(500).json({ error: 'No se pudo guardar la interacción' });
  }
});

// GET /api/interacciones  → todas las interacciones
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const result = await pool.query(
      'SELECT * FROM interacciones ORDER BY id DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener interacciones:', error.message);
    res.status(500).json({ error: 'No se pudieron obtener las interacciones' });
  }
});

// GET /api/interacciones/:empresaId  → interacciones de una empresa
router.get('/:empresaId', async (req, res) => {
  const id = parseInt(req.params.empresaId);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'empresaId inválido' });
  }

  const limit = parseInt(req.query.limit) || 50;

  try {
    const result = await pool.query(
      'SELECT * FROM interacciones WHERE empresa_id = $1 ORDER BY id DESC LIMIT $2',
      [id, limit]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener interacciones por empresa:', error.message);
    res.status(500).json({ error: 'No se pudieron obtener las interacciones' });
  }
});

module.exports = router;
