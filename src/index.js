const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Importar rutas
const librosRoutes = require('./routes/librosRoutes');

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: 'API REST de Libros activa y lista para recibir peticiones.'
    });
});

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        message: 'Servidor funcionando'
    });
});

// Rutas de libros
app.use('/api/libros', librosRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});