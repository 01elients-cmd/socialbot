// modules/empresas.js

const API_BASE = 'https://socialbot-backend.onrender.com';

export async function cargarEmpresas() {
  try {
    const res = await fetch(`${API_BASE}/api/empresas`);
    if (!res.ok) throw new Error('Error al cargar empresas');
    const empresas = await res.json();
    return empresas;
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    return [];
  }
}

export async function crearEmpresa(data) {
  try {
    const res = await fetch(`${API_BASE}/api/empresas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al crear empresa');
    const nueva = await res.json();
    return nueva;
  } catch (error) {
    console.error('Error al crear empresa:', error);
    return null;
  }
}
