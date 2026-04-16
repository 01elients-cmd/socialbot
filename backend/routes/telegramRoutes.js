const express = require('express');
const router = express.Router();
const { generarRespuesta } = require('../utils/aiResponse');
const fetch = require('node-fetch');
const pool = require('../db');
const enviarMensaje = require('../utils/enviarMensaje');

// POST /api/telegram/webhook
router.post('/webhook', async (req, res) => {
  // Telegram requiere 200 lo antes posible para no reintentar
  res.sendStatus(200);

  try {
    const body = req.body;
    console.log('📩 Webhook Telegram:', JSON.stringify(body, null, 2));

    const message = body.message || body.edited_message;
    if (!message) {
      console.warn('⚠️ No hay mensaje en el payload');
      return;
    }

    const chatId = message.chat?.id;
    const from = message.from?.username || message.from?.first_name || 'Desconocido';
    const mensajeTexto = message.text;
    const mensajeVoz = message.voice?.file_id;

    if (!chatId) {
      console.warn('⚠️ Chat ID faltante');
      return;
    }

    // 🔧 Mapear chatId a empresaId (hardcoded; mejorable con tabla en BD)
    const empresaId = process.env.TELEGRAM_EMPRESA_ID ? parseInt(process.env.TELEGRAM_EMPRESA_ID) : 5;

    if (!mensajeTexto && !mensajeVoz) {
      console.warn('⚠️ Tipo de mensaje no soportado:', message);
      await enviarMensaje(chatId, 'No pude entender tu mensaje. ¿Podrías enviarlo como texto?', empresaId);
      return;
    }

    // Si es mensaje de voz
    if (mensajeVoz) {
      pool.query(
        `INSERT INTO interacciones (empresa_id, tipo, respuesta, reaccion, modo)
         VALUES ($1, $2, $3, $4, $5)`,
        [empresaId, 'telegram', `🎙️ Voz: ${mensajeVoz}`, null, 'voz']
      ).catch(err => console.error('❌ DB voz:', err.message));

      await enviarMensaje(chatId, '🎙️ Recibí tu nota de voz. ¿Quieres que la transcribamos o prefieres escribirlo?', empresaId);
      return;
    }

    // Generar respuesta IA para el texto
    console.log(`💬 Mensaje de @${from}: ${mensajeTexto}`);
    const respuesta = await generarRespuesta(empresaId, mensajeTexto);

    // Enviar respuesta a Telegram
    const telegramURL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const telegramRes = await fetch(telegramURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: respuesta,
        parse_mode: 'Markdown'
      })
    });

    if (!telegramRes.ok) {
      const errBody = await telegramRes.text();
      console.error(`❌ Telegram API error ${telegramRes.status}:`, errBody);
    } else {
      console.log('📤 Respuesta enviada a Telegram OK');
    }

    // Registrar en BD (sin bloquear)
    pool.query(
      `INSERT INTO interacciones (empresa_id, tipo, respuesta, reaccion, modo)
       VALUES ($1, $2, $3, $4, $5)`,
      [empresaId, 'telegram', respuesta, null, 'respuesta']
    ).catch(err => console.error('❌ DB interacción:', err.message));

  } catch (error) {
    console.error('❌ Error interno en webhook Telegram:', error);
  }
});

module.exports = router;
