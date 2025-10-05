const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.put('/', (req, res) => {
  const empresaId = req.user?.empresaId || req.query.empresaId;
  if (!empresaId) return res.status(400).json({ error: 'Falta empresaId' });

  const dirPath = path.join(__dirname, '../config');
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath); // ✅ Crea carpeta si no existe

  const filePath = path.join(dirPath, `empresa-${empresaId}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (error) {
    console.error("❌ Error al guardar branding:", error);
    res.status(500).json({ error: 'Error al guardar branding' });
  }
});

module.exports = router;
