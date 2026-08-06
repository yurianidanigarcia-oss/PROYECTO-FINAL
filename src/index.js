const express = require('express');
const db = require('./config/db');
const productosRouter = require('./routes/productos');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Requisito 5: Endpoint de Monitoreo /health
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: 'CONNECTED'
    });
  } catch (error) {
    res.status(500).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      database: 'DISCONNECTED',
      error: error.message
    });
  }
});

// Endpoint de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Operativa y funcionando correctamente' });
});

// Rutas principales
app.use('/api/productos', productosRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});