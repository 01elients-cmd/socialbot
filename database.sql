CREATE DATABASE socialbot;
-- Tabla: empresas
CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tono VARCHAR(50) DEFAULT 'neutral',
  emoji VARCHAR(10) DEFAULT '🤖',
  firma TEXT DEFAULT '',
  color VARCHAR(10) DEFAULT '#333',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: interacciones
CREATE TABLE interacciones (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  mensaje TEXT NOT NULL,
  respuesta TEXT NOT NULL,
  reaccion VARCHAR(50), -- 'like', 'dislike', 'saved', etc.
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: publicaciones
CREATE TABLE publicaciones (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  plataforma VARCHAR(50) NOT NULL, -- 'Instagram', 'TikTok', etc.
  contenido TEXT NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente' -- 'pendiente', 'publicado', 'cancelado'
);
