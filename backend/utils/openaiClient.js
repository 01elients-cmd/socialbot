const { OpenAI } = require('openai');
require('dotenv').config();

if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ No se encontró OPENAI_API_KEY en el entorno. Verifica tu archivo .env o configuración en Render.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = openai;
