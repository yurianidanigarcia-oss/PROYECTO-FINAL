const express = require('express');
const router = express.Router();

const db = require('../config/db');

// GET - Obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM public.libros ORDER BY id ASC'
        );

        res.json(result.rows);

    } catch (error) {
        console.error('ERROR EN /api/libros:', error);

        res.status(500).json({
            error: error.message,
            detalle: error
        });
    }
});

// POST - Agregar libro
router.post('/', async (req, res) => {
    const { titulo, autor, precio } = req.body;

    if (!titulo || !autor) {
        return res.status(400).json({
            error: 'El título y el autor son obligatorios'
        });
    }

    try {
        const result = await db.query(
            `INSERT INTO public.libros
            (titulo, autor, precio)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [titulo, autor, precio || 0]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('ERROR AL INSERTAR LIBRO:', error);

        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;