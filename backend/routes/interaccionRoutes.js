// routes/interaccionRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('../db'); // conexión a PostgreSQL

// 🧠 Registrar una interacción
router.post('/', async (req, res) => {
  const { empresaId, usuario, mensajeUsuario, respuestaBot, reaccion, modo = 'normal' } = req.body;

  if (!empresaId || !mensajeUsuario || !respuestaBot) {
    return res.status(400).json({ error: 'Datos incompletos para registrar interacción' });
  }

  try {
await pool.query(
  `INSERT INTO interacciones (empresa_id, tipo, respuesta, reaccion, modo)
   VALUES ($1, $2, $3, $4, $5)`,
  [empresaId, 'respuesta', respuestaBot, reaccion, modo]
);


    res.status(201).json({ mensaje: 'Interacción guardada' });
  } catch (error) {
    console.error('Error al guardar interacción:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 🔍 Obtener todas las interacciones
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM interacciones ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener interacciones:', error.message);
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
    console.error('Error al obtener interacciones por empresa:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
