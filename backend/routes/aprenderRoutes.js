const express = require('express');
const router = express.Router();
const pool = require('../db'); // conexión a PostgreSQL

router.post('/', async (req, res) => {
  const { empresaId, usuario, mensajeUsuario, respuestaBot, reaccion } = req.body;

  try {
    await pool.query(
      `INSERT INTO interacciones (empresa_id, tipo, respuesta, reaccion)
       VALUES ($1, $2, $3, $4)`,
      [empresaId, mensajeUsuario, respuestaBot, reaccion]
    );

    res.status(201).json({ mensaje: 'Interacción guardada' });
  } catch (error) {
    console.error('Error al guardar interacción:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
