const express = require('express');
const router = express.Router();
const { generarRespuesta } = require('../utils/aiResponse');

// Ejemplo: Telegram webhook
router.post('/telegram/:empresaId', async (req, res) => {
  const empresaId = req.params.empresaId;
  const mensaje = req.body.message?.text;
  const chatId = req.body.message?.chat?.id;

  const respuesta = await generarRespuesta(empresaId, mensaje);

  // Enviar respuesta al usuario
  const token = obtenerTokenTelegram(empresaId);
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: respuesta })
  });

  res.sendStatus(200);
});
