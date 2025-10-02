const express = require('express');
const router = express.Router();
const { generarRespuesta } = require('../utils/aiResponse');
const pool = require('../db'); // conexión a PostgreSQL

router.post('/', async (req, res) => {
  const { empresaId, mensajeUsuario } = req.body;

  // 🔒 Validación quirúrgica
  if (!empresaId || isNaN(parseInt(empresaId))) {
    return res.status(400).json({ error: 'empresaId inválido' });
  }

  try {
    // 1. Obtener estilo desde PostgreSQL
    const result = await pool.query(
      `SELECT tono, emoji, firma, color FROM empresas WHERE id = $1`,
      [empresaId]
    );

    const empresa = result.rows[0];

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    // 2. Construir estilo
    const estilo = {
      tono: empresa.tono || 'neutral',
      emoji: empresa.emoji || '🤖',
      firma: empresa.firma || '',
      color: empresa.color || '#333',
    };

    // 3. Generar respuesta con estilo
    const respuesta = await generarRespuesta(mensajeUsuario, estilo);

    // 4. Guardar interacción en PostgreSQL
    await pool.query(
      `INSERT INTO interacciones (empresa_id, mensaje, respuesta, reaccion)
       VALUES ($1, $2, $3, $4)`,
      [empresaId, mensajeUsuario, respuesta, null]
    );

// 5. Devolver al frontend
res.status(200).json({ respuesta });
} catch (error) {
  console.error('Error en /api/respuesta:', error); // ← muestra el objeto completo
  res.status(500).json({ error: error.message });
}

});

module.exports = router;

