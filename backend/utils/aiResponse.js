import fetch from 'node-fetch'; // solo si tu entorno lo necesita

const generarRespuesta = async (mensajeUsuario, estilo = {}) => {
  if (!mensajeUsuario || typeof mensajeUsuario !== 'string') {
    throw new Error('Mensaje inválido para generar respuesta');
  }

  const { tono = 'neutral', emoji = '🤖', firma = '', color = '#333' } = estilo;

  const prompt = `
Eres un bot que responde mensajes en redes sociales para una empresa.
Usa un tono ${tono}, incluye el emoji favorito (${emoji}) y responde con estilo "${firma}".
Mensaje recibido: "${mensajeUsuario}"
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral-7b",
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
    const respuesta = data.choices?.[0]?.message?.content?.trim();
    if (!respuesta) throw new Error("Respuesta vacía del modelo");

    console.log("🧠 Respuesta del modelo:", data);
    return respuesta;
  } catch (error) {
    console.error("Error al generar respuesta con OpenRouter:", error.message);
    throw error;
  }
};

module.exports = { generarRespuesta };
