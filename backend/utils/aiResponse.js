const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const generarRespuesta = async (empresaId, mensajeUsuario) => {
  if (!mensajeUsuario || typeof mensajeUsuario !== 'string') {
    throw new Error('Mensaje inválido para generar respuesta');
  }

  // 🔹 Cargar branding.json de la empresa
  const filePath = path.join(__dirname, `../config/empresa-${empresaId}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`No existe branding para empresa ${empresaId}`);
  }

  const branding = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const {
    tono = 'neutral',
    emoji = '🤖',
    firma = '',
    color = '#333',
    modelo = 'meta-llama/llama-3-70b-instruct',
    estilo = {},
    intenciones = []
  } = branding;

  const mensaje = mensajeUsuario.toLowerCase();

  // 🔍 Detección de intención personalizada por empresa
  for (const intento of intenciones) {
    const match = intento.keywords?.every(k => mensaje.includes(k));
    if (match && intento.respuesta) {
      return intento.respuesta;
    }
  }

  // 🧠 Prompt con estilo de la empresa
  const prompt = `
Eres el bot oficial de atención al cliente de una empresa. Tu estilo debe ser:
- Tono: ${tono}
- Emoji favorito: ${emoji}
- Firma: ${firma}
- Formato: ${estilo.formato || 'claro y directo'}

Responde al siguiente mensaje del usuario de forma clara, empática y profesional:

"${mensajeUsuario}"
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "Eres un bot que responde mensajes en redes sociales para una empresa. Tu estilo debe ser claro, empático y profesional."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    console.log("🧠 Respuesta completa del modelo:", JSON.stringify(data, null, 2));

    const respuesta = data.choices?.[0]?.message?.content?.trim();
    if (!respuesta) {
      console.warn("⚠️ El modelo no respondió. Usando fallback.");
      return "Lo siento, no pude generar una respuesta en este momento. 😕";
    }

    return respuesta;
  } catch (error) {
    console.error("Error al generar respuesta con OpenRouter:", error.message);
    throw error;
  }
};

module.exports = { generarRespuesta };
