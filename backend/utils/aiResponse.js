const openai = require('./openaiClient');

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
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo'
    });

    const respuesta = completion.choices?.[0]?.message?.content?.trim();
    if (!respuesta) throw new Error('Respuesta vacía del modelo');

    return respuesta;
  } catch (error) {
    console.error('Error al generar respuesta con OpenAI:', error.message);
    throw error;
  }
};

module.exports = { generarRespuesta };
