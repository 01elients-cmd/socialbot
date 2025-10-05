const fetch = require('node-fetch');

const generarRespuesta = async (mensajeUsuario, estilo = {}) => {
  if (!mensajeUsuario || typeof mensajeUsuario !== 'string') {
    throw new Error('Mensaje inválido para generar respuesta');
  }

  const { tono = 'neutral', emoji = '🤖', firma = '', color = '#333' } = estilo;

  const prompt = `Responde al siguiente mensaje como si fueras el bot de atención al cliente de una empresa. Usa un tono ${tono}, incluye el emoji favorito (${emoji}) y firma como "${firma}". Mensaje: "${mensajeUsuario}"`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      model: "openchat-3.5",
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
