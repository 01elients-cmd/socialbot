const express = require('express');
const router = express.Router();
const { generarRespuesta } = require('../utils/aiResponse');
const pool = require('../db');

// POST /api/respuesta
router.post('/', async (req, res) => {
  const { empresaId, mensajeUsuario } = req.body;

  const id = parseInt(empresaId);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'empresaId debe ser un número válido' });
  }
  if (!mensajeUsuario || typeof mensajeUsuario !== 'string' || mensajeUsuario.trim().length < 2) {
    return res.status(400).json({ error: 'mensajeUsuario debe tener al menos 2 caracteres' });
  }

  try {
    // 1. Generar respuesta IA
    const respuestaGenerada = await generarRespuesta(id, mensajeUsuario.trim());

    // 2. Guardar interacción en BD (sin bloquear la respuesta al cliente)
    pool.query(
      `INSERT INTO interacciones (empresa_id, tipo, respuesta, reaccion, modo)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, 'respuesta', respuestaGenerada, null, 'panel']
    ).catch(dbErr => console.error('❌ Error al guardar interacción en BD:', dbErr.message));

    // 3. Devolver al frontend
    res.status(200).json({ respuesta: respuestaGenerada });
  } catch (error) {
    console.error('❌ Error en /api/respuesta:', error.message);
    res.status(500).json({ error: 'No se pudo generar la respuesta. Intenta de nuevo.' });
  }
});

module.exports = router;
