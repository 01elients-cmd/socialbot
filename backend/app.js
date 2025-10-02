// Cargar variables de entorno
require('dotenv').config();

// Importaciones
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const respuestaRoutes = require('./routes/respuestaRoutes');
const interaccionRoutes = require('./routes/interaccionRoutes');
const publicacionRoutes = require('./routes/publicacionRoutes');
const empresaRoutes = require('./routes/empresaRoutes');

// Inicializar app
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/respuesta', respuestaRoutes);
app.use('/api/interacciones', interaccionRoutes);
app.use('/api/publicaciones', publicacionRoutes);
app.use('/api/empresas', empresaRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
