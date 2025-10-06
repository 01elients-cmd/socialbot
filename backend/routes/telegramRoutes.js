// backend/routes/telegramRoutes.js
const express = require('express');
const router = express.Router();
const { generarRespuesta } = require('../utils/aiResponse');
const fetch = require('node-fetch');
const pool = require('../db');

router.post('/webhook', async (req, res) => {
  const mensajeUsuario = req.body.message?.text;
  const chatId = req.body.message?.chat?.id;

  if (!mensajeUsuario || !chatId) return res.sendStatus(400);

  try {
    const empresaId = 5; // 🔧 Puedes modularizar esto por chatId si lo deseas
    const respuesta = await generarRespuesta(empresaId, mensajeUsuario);

    // Enviar respuesta al usuario
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: respuesta })
    });

    // Registrar interacción
    await pool.query(
      `INSERT INTO interacciones (empresa_id, tipo, respuesta, reaccion, modo)
       VALUES ($1, $2, $3, $4, $5)`,
      [empresaId, 'telegram', respuesta, null, 'respuesta']
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error en webhook de Telegram:", error.message);
    res.sendStatus(500);
  }
});

module.exports = router;
