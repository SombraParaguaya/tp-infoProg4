const express = require('express');
const path = require('path');

const connectRouter = require('./routes/connect'); // Ruta del microservicio

const app = express();
const PORT = 3000;

// Middleware para analizar datos en formato JSON
app.use(express.json());

// Sirve archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Ruta principal para mostrar la página de conexión (login)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/login.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/home.html'));
});

// Usar el microservicio de conexión
app.use('/connect', connectRouter);

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});