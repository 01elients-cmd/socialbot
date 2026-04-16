const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const CONFIG_DIR = path.join(__dirname, '../config');

/**
 * Genera una respuesta IA usando el branding JSON de la empresa.
 * Soporta intenciones por keywords y fallback al modelo LLM via OpenRouter.
 */
const generarRespuesta = async (empresaId, mensajeUsuario) => {
  if (!mensajeUsuario || typeof mensajeUsuario !== 'string' || mensajeUsuario.trim().length === 0) {
    throw new Error('Mensaje inválido para generar respuesta');
  }

  // 🔹 Cargar branding.json de la empresa
  const filePath = path.join(CONFIG_DIR, `empresa-${empresaId}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`No existe configuración de branding para empresa ${empresaId}`);
  }

  let branding;
  try {
    branding = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    throw new Error(`Error al parsear branding de empresa ${empresaId}: ${e.message}`);
  }

  const {
    tono = 'neutral',
    emoji = '🤖',
    firma = '',
    nombre: nombreEmpresa = 'la empresa',
    modelo: modeloBranding,
    estilo = {},
    intenciones = [],
    entrenamiento = []   // ✅ también soportamos "entrenamiento" (alias de intenciones)
  } = branding;

  const model = typeof modeloBranding === 'string' && modeloBranding.length > 0
    ? modeloBranding
    : 'meta-llama/llama-3-70b-instruct';

  console.log(`🧠 [Empresa ${empresaId}] Modelo: ${model}`);

  const mensajeLower = mensajeUsuario.toLowerCase();

  // 🔍 Detección de intención por keywords (intenciones + entrenamiento)
  const todasIntenciones = [...intenciones, ...entrenamiento];
  for (const intento of todasIntenciones) {
    if (intento.keywords && Array.isArray(intento.keywords)) {
      const match = intento.keywords.every(k => mensajeLower.includes(k.toLowerCase()));
      if (match && intento.respuesta) {
        console.log(`✅ Intención detectada por keywords: [${intento.keywords.join(', ')}]`);
        return intento.respuesta;
      }
    }
  }

  // 🧠 Prompt enriquecido con contexto de empresa
  const intro = estilo.intro || '';
  const cierre = estilo.cierre || '';
  const formato = estilo.formato || 'claro y directo';

  const systemPrompt = `Eres el asistente virtual oficial de "${nombreEmpresa}". Responde siempre de forma ${tono}, usando el emoji ${emoji} cuando sea apropiado, y termina con la firma "${firma}". Sé ${formato}. No inventes información que no conozcas de la empresa.`;

  const userPrompt = `El cliente escribe: "${mensajeUsuario.trim()}"

${intro ? `Intro sugerida: ${intro}` : ''}
${cierre ? `Cierre sugerido: ${cierre}` : ''}

Responde al cliente de manera ${tono} y profesional.`;

  if (!process.env.OPENROUTER_API_KEY) {
    console.warn('⚠️ OPENROUTER_API_KEY no definida.');
    return 'Lo siento, el servicio de IA no está configurado correctamente. 😕';
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://socialbot-7xjz.onrender.com',
        'X-Title': 'SocialBot'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 400,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`❌ OpenRouter error ${response.status}:`, errBody);
      return `Lo siento, no pude generar una respuesta en este momento. ${emoji}`;
    }

    const data = await response.json();
    const respuesta = data.choices?.[0]?.message?.content?.trim();

    if (!respuesta) {
      console.warn('⚠️ El modelo no devolvió contenido. Usando fallback.');
      return `Lo siento, no pude generar una respuesta en este momento. ${emoji}`;
    }

    return respuesta;
  } catch (error) {
    console.error('❌ Error al llamar a OpenRouter:', error.message);
    throw error;
  }
};

module.exports = { generarRespuesta };
