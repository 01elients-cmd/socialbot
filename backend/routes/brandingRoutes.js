const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const CONFIG_DIR = path.join(__dirname, '../config');

// GET /api/branding?empresaId=X  → leer branding actual
router.get('/', (req, res) => {
  const empresaId = req.query.empresaId;
  if (!empresaId || isNaN(parseInt(empresaId))) {
    return res.status(400).json({ error: 'Falta o es inválido el parámetro empresaId' });
  }

  const filePath = path.join(CONFIG_DIR, `empresa-${empresaId}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe branding para empresa ${empresaId}` });
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(data);
  } catch (err) {
    console.error('❌ Error al leer branding:', err);
    res.status(500).json({ error: 'No se pudo leer el branding' });
  }
});

// PUT /api/branding?empresaId=X  → guardar branding
router.put('/', (req, res) => {
  const empresaId = req.query.empresaId;
  if (!empresaId || isNaN(parseInt(empresaId))) {
    return res.status(400).json({ error: 'Falta o es inválido el parámetro empresaId' });
  }

  if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'El cuerpo del branding no puede estar vacío' });
  }

  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  const filePath = path.join(CONFIG_DIR, `empresa-${empresaId}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true, mensaje: `Branding de empresa ${empresaId} guardado` });
  } catch (error) {
    console.error('❌ Error al guardar branding:', error);
    res.status(500).json({ error: 'No se pudo guardar el branding' });
  }
});

module.exports = router;
