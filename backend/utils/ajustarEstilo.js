const ajustarEstilo = (branding, reaccion) => {
  if (reaccion === 'negativa') {
    branding.estiloRespuesta = 'más suave y empático';
    branding.emojiFavorito = '🙂';
  } else if (reaccion === 'positiva') {
    branding.estiloRespuesta = 'más directo y atrevido';
    branding.emojiFavorito = '🔥';
  }
  return branding;
};

module.exports = { ajustarEstilo };
