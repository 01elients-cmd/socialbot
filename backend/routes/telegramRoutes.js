const express = require('express');
const router = express.Router();
const { generarRespuesta } = require('../utils/aiResponse');
const fetch = require('node-fetch');
const pool = require('../db');

router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    console.log("📩 Webhook recibido:", JSON.stringify(body, null, 2));

    const chatId = body.message?.chat?.id;
    const mensajeTexto = body.message?.text;
    const mensajeVoz = body.message?.voice?.file_id;

    if (!chatId) {
      console.warn("⚠️ Chat ID faltante");
      return res.sendStatus(400);
    }

    let mensajeUsuario = mensajeTexto || mensajeVoz;

    if (!mensajeUsuario) {
      console.warn("⚠️ Mensaje no procesable:", { mensajeTexto, mensajeVoz });
      await enviarMensaje(chatId, "No pude entender tu mensaje. ¿Podrías repetirlo o enviarlo como texto?");
      return res.sendStatus(200);
    }

    const empresaId = 5; // 🔧 Modularizable por chatId

    // Si es voz, puedes guardar el file_id y preparar transcripción
    if (mensajeVoz) {
      await pool.query(
        `INSERT INTO interacciones (empresa_id, tipo, respuesta, reaccion, modo)
         VALUES ($1, $2, $3, $4, $5)`,
        [empresaId, 'telegram', `🎙️ Mensaje de voz recibido: ${mensajeVoz}`, null, 'voz']
      );

      await enviarMensaje(chatId, "Recibimos tu mensaje de voz 🎙️. ¿Quieres que lo transcribamos o lo respondamos directamente?");
      return res.sendStatus(200);
    }

    // Si es texto, generar respuesta normal
    const respuesta = await generarRespuesta(empresaId, mensajeUsuario);

    const telegramURL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: respuesta,
      parse_mode: 'Markdown'
    };

    const telegramRes = await fetch(telegramURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const telegramData = await telegramRes.json();
    console.log("📤 Respuesta enviada a Telegram:", telegramData);

    await pool.query(
      `INSERT INTO interacciones (empresa_id, tipo, respuesta, reaccion, modo)
       VALUES ($1, $2, $3, $4, $5)`,
      [empresaId, 'telegram', respuesta, null, 'respuesta']
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error en webhook de Telegram:", error);
    res.sendStatus(500);
  }
});

module.exports = router;

