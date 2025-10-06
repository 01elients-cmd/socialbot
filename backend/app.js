// Cargar variables de entorno
require('dotenv').config();

// Importaciones
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Rutas
const respuestaRoutes = require('./routes/respuestaRoutes');
const interaccionRoutes = require('./routes/interaccionRoutes');
const publicacionRoutes = require('./routes/publicacionRoutes');
const empresaRoutes = require('./routes/empresaRoutes');
const brandingRoutes = require('./routes/brandingRoutes');
const telegramRoutes = require('./routes/telegramRoutes');

// Inicializar app
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging básico
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use('/api/respuesta', respuestaRoutes);
app.use('/api/interacciones', interaccionRoutes);
app.use('/api/publicaciones', publicacionRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/branding', brandingRoutes);
app.use('/api/telegram', telegramRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('🧠 API SocialBot activa');
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
