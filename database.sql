-- =============================================================
-- SocialBot - Esquema de base de datos
-- =============================================================

-- Tabla: empresas
CREATE TABLE IF NOT EXISTS empresas (
  id              SERIAL PRIMARY KEY,
  nombre          VARCHAR(255) NOT NULL,
  tono            VARCHAR(50)  DEFAULT 'neutral',
  emoji           VARCHAR(10)  DEFAULT '🤖',
  firma           TEXT         DEFAULT '',
  color           VARCHAR(10)  DEFAULT '#333',
  fecha_creacion  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: interacciones
-- NOTA: Las columnas 'tipo' y 'modo' fueron añadidas en el código pero faltaban en el SQL original.
-- La columna 'mensaje' también falta (el código sólo guarda 'respuesta').
CREATE TABLE IF NOT EXISTS interacciones (
  id          SERIAL PRIMARY KEY,
  empresa_id  INTEGER      NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo        VARCHAR(50)  DEFAULT 'respuesta',   -- 'respuesta', 'telegram', etc.
  mensaje     TEXT,                                -- mensaje original del usuario (opcional)
  respuesta   TEXT         NOT NULL,
  reaccion    VARCHAR(50),                         -- 'positiva', 'negativa', 'neutral', etc.
  modo        VARCHAR(50)  DEFAULT 'normal',       -- 'normal', 'voz', 'panel', etc.
  fecha       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: publicaciones
CREATE TABLE IF NOT EXISTS publicaciones (
  id          SERIAL PRIMARY KEY,
  empresa_id  INTEGER      NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  contenido   TEXT         NOT NULL,
  fecha       DATE         DEFAULT CURRENT_DATE,
  plataforma  VARCHAR(50)  DEFAULT 'Instagram',   -- 'Instagram', 'TikTok', 'Twitter', etc.
  estado      VARCHAR(50)  DEFAULT 'pendiente'    -- 'pendiente', 'publicado', 'cancelado'
);

-- Índices para mejorar performance de queries frecuentes
CREATE INDEX IF NOT EXISTS idx_interacciones_empresa ON interacciones(empresa_id);
CREATE INDEX IF NOT EXISTS idx_interacciones_fecha   ON interacciones(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_publicaciones_empresa ON publicaciones(empresa_id);
CREATE INDEX IF NOT EXISTS idx_publicaciones_fecha   ON publicaciones(fecha DESC);
