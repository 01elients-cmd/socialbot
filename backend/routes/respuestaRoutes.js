const express = require('express');
const router = express.Router();
const { generarRespuesta } = require('../utils/aiResponse');
const pool = require('../db');

router.post('/', async (req, res) => {
  const { empresaId, mensajeUsuario } = req.body;

  if (!empresaId || isNaN(parseInt(empresaId)) || !mensajeUsuario || typeof mensajeUsuario !== 'string') {
    return res.status(400).json({ error: 'Datos inválidos para generar respuesta' });
  }

  try {
    // 1. Generar respuesta usando branding.json
    const respuestaGenerada = await generarRespuesta(empresaId, mensajeUsuario);

    // 2. Guardar interacción en PostgreSQL
    await pool.query(
      `INSERT INTO interacciones (empresa_id, tipo, respuesta, reaccion, modo)
       VALUES ($1, $2, $3, $4, $5)`,
      [empresaId, 'respuesta', respuestaGenerada, null, 'respuesta']
    );

    // 3. Devolver al frontend
    res.status(200).json({ respuesta: respuestaGenerada });
  } catch (error) {
    console.error('Error en /api/respuesta:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
