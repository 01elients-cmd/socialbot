const openai = require('./openaiClient');

const generarRespuesta = async (mensajeUsuario, estilo) => {
  const prompt = `
Eres un bot que responde mensajes en redes sociales para una empresa.
Usa un tono ${estilo.tono}, incluye el emoji favorito (${estilo.emoji}) y responde con estilo "${estilo.firma}".
Mensaje recibido: "${mensajeUsuario}"
`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo'
  });

  return completion.choices[0].message.content;
};

module.exports = { generarRespuesta };
