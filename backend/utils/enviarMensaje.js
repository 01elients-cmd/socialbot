const fetch = require('node-fetch');
const pool = require('../db');

// Función principal
async function enviarMensaje(chatId, texto, empresaId = null) {
  try {
    let firma = '';
    let emoji = '';

    // Si se pasa empresaId, aplicar branding
    if (empresaId) {
      const { rows } = await pool.query(
        `SELECT firma, emoji FROM empresas WHERE id = $1`,
        [empresaId]
      );
      const branding = rows[0];
      if (branding) {
        firma = branding.firma || '';
        emoji = branding.emoji || '';
      }
    }

    const mensajeFinal = `${emoji} ${texto}\n${firma}`.trim();

    const telegramURL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: mensajeFinal,
      parse_mode: 'Markdown'
    };

    const res = await fetch(telegramURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("📤 Mensaje enviado a Telegram:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
    return null;
  }
}

module.exports = enviarMensaje;
