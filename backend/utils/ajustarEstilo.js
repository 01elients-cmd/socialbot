const ajustarEstilo = (branding, reaccion) => {
  const ajustes = {
    negativa: {
      estiloRespuesta: 'más suave y empático',
      emojiFavorito: '🙂'
    },
    positiva: {
      estiloRespuesta: 'más directo y atrevido',
      emojiFavorito: '🔥'
    },
    neutral: {
      estiloRespuesta: 'equilibrado y profesional',
      emojiFavorito: '🤖'
    },
    confusa: {
      estiloRespuesta: 'más claro y explicativo',
      emojiFavorito: '❓'
    },
    irónica: {
      estiloRespuesta: 'sarcástico pero elegante',
      emojiFavorito: '😏'
    }
  };

  const ajuste = ajustes[reaccion] || ajustes['neutral'];

  return {
    ...branding,
    estiloRespuesta: ajuste.estiloRespuesta,
    emojiFavorito: ajuste.emojiFavorito
  };
};

module.exports = { ajustarEstilo };
