const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// GET branding
router.get('/', (req, res) => {
  const empresaId = req.user?.empresaId || req.query.empresaId;
  if (!empresaId) return res.status(400).json({ error: 'Falta empresaId' });

  const filePath = path.join(__dirname, `../config/empresa-${empresaId}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'No existe branding para esta empresa' });

  const data = fs.readFileSync(filePath, 'utf8');
  res.json(JSON.parse(data));
});

// PUT branding
router.put('/', (req, res) => {
  const empresaId = req.user?.empresaId || req.query.empresaId;
  if (!empresaId) return res.status(400).json({ error: 'Falta empresaId' });

  const filePath = path.join(__dirname, `../config/empresa-${empresaId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
  res.json({ ok: true });
});

module.exports = router;
