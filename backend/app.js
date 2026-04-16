// Cargar variables de entorno
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });


// Importaciones
const express = require('express');
const cors = require('cors');

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
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Ruta base / health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: '🧠 API SocialBot activa', version: '1.1.0' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
