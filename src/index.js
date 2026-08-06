//prueba
const express = require('express');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ⚡ AUTO-CREACIÓN DE TABLA AL INICIAR
const initDb = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        precio NUMERIC(10, 2) NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla "productos" lista y verificada');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
  }
};

// Llamamos a la función de inicialización
initDb();

// --- TUS ENDPOINTS DE SIEMPRE ---

app.get('/', (req, res) => {
  res.json({ message: 'API Funcional - Proyecto Express + PostgreSQL' });
});

app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({ status: 'UP', database: 'CONNECTED' });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', error: error.message });
  }
});

app.get('/api/productos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/productos', async (req, res) => {
  const { nombre, precio } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son requeridos' });
  }
  try {
    const result = await db.query(
      'INSERT INTO productos (nombre, precio) VALUES ($1, $2) RETURNING *',
      [nombre, precio]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});