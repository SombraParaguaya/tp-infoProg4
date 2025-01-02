const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Obtener todas las reservas
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM RESERVAS');
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/*
// Crear una nueva reserva
router.post('/', async (req, res) => {
    const { id_cliente, id_cancha, fecha_inicio, fecha_fin } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Reservas (id_cliente, id_cancha, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)',
            [id_cliente, id_cancha, fecha_inicio, fecha_fin, 'confirmada']
        );
        res.status(201).json({ id: result.insertId, message: 'Reserva creada exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
*/
module.exports = router;