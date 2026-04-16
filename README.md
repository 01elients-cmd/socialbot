# SocialBot 🧠

**SocialBot** es una plataforma de automatización de respuestas de atención al cliente usando IA, integrada con Telegram y un panel de control web.

## 📁 Estructura del proyecto

```
SocialBot/
├── socialbot-master/          # Monorepo principal
│   ├── backend/               # API Node.js + Express
│   │   ├── app.js             # Punto de entrada del servidor
│   │   ├── db.js              # Pool de conexión PostgreSQL
│   │   ├── .env               # Variables de entorno (NO commitear)
│   │   ├── .env.example       # Plantilla de variables
│   │   ├── config/            # Brandigs por empresa (empresa-{id}.json)
│   │   ├── routes/            # Rutas REST
│   │   ├── utils/             # Utilidades (IA, Telegram, estilos)
│   │   └── controllers/       # Controladores (legado)
│   ├── frontend/              # Panel básico (versión simple)
│   └── database.sql           # Esquema de base de datos
│
└── socialbot-panel-main/      # Panel de control principal (mejorado)
    ├── index.html
    ├── style.css
    ├── script.js
    └── modules/               # Módulos ES6
```

## 🚀 Inicio rápido

### 1. Configurar variables de entorno
```bash
cp backend/.env.example backend/.env
# Editar .env con tus credenciales
```

### 2. Instalar dependencias del backend
```bash
cd socialbot-master/backend
npm install
```

### 3. Crear la base de datos
```bash
# En PostgreSQL, ejecutar:
psql -U postgres -f database.sql
```

### 4. Iniciar el servidor
```bash
npm start          # producción
npm run dev        # desarrollo (requiere nodemon)
```

### 5. Abrir el panel
Abre `socialbot-panel-main/index.html` en un servidor local (e.g. Live Server en VS Code).

---

## ⚙️ Variables de entorno requeridas

| Variable | Descripción | Requerida |
|---|---|---|
| `DATABASE_URL` | URL de conexión PostgreSQL | ✅ |
| `OPENROUTER_API_KEY` | Clave de OpenRouter.ai | ✅ |
| `TELEGRAM_BOT_TOKEN` | Token del bot de Telegram | Solo si usas Telegram |
| `TELEGRAM_EMPRESA_ID` | ID de empresa para el webhook | Solo si usas Telegram |
| `NODE_ENV` | `development` o `production` | Opcional |
| `PORT` | Puerto del servidor (default: 5000) | Opcional |

---

## 🌐 Endpoints API

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/api/empresas` | Listar empresas |
| `POST` | `/api/empresas` | Crear empresa |
| `PUT` | `/api/empresas/:id` | Actualizar empresa |
| `POST` | `/api/respuesta` | Generar respuesta IA |
| `GET` | `/api/interacciones/:empresaId` | Historial de interacciones |
| `POST` | `/api/interacciones` | Registrar interacción |
| `GET` | `/api/publicaciones/:empresaId` | Listar publicaciones |
| `POST` | `/api/publicaciones` | Crear publicación |
| `GET` | `/api/branding?empresaId=X` | Leer branding |
| `PUT` | `/api/branding?empresaId=X` | Guardar branding |
| `POST` | `/api/telegram/webhook` | Webhook de Telegram |

---

## 🧠 Configuración de branding por empresa

Cada empresa tiene un archivo `config/empresa-{id}.json` con:

```json
{
  "empresa_id": 1,
  "nombre": "Mi Empresa",
  "tono": "amigable",
  "emoji": "💚",
  "firma": "—Equipo Mi Empresa",
  "color": "#60E84D",
  "modelo": "meta-llama/llama-3-70b-instruct",
  "estilo": {
    "intro": "¡Hola! Gracias por escribirnos.",
    "cierre": "Si tienes más dudas, estamos aquí.",
    "formato": "breve y directo"
  },
  "entrenamiento": [
    {
      "keywords": ["precio", "costo"],
      "respuesta": "💚 Para precios, contáctanos al WhatsApp."
    }
  ]
}
```
