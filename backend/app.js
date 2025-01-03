const express = require('express');
const path = require('path');

// Imports para Autentificacion
const session = require('express-session');
require('dotenv').config();

const connectRouter = require('./routes/connect'); // Ruta del microservicio

const app = express();
const PORT = 3000;

// Middleware para analizar datos en formato JSON
app.use(express.json());

// Sirve archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Configuración de sesiones
app.use(session({
    secret: process.env.SEGURO_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/login');
}

app.post('/authenticate', (req, res) => {
    const { username, password } = req.body;

    const user = { username: process.env.WEB_USER, password: process.env.WEB_PASSWORD };

    // Verificar si el nombre de usuario es incorrecto
    if (username !== user.username) {
        return res.status(401).send({ message: 'El usuario es incorrecto' });
    }

    // Verificar si la contraseña es incorrecta
    if (password !== user.password) {
        return res.status(401).send({ message: 'La contraseña es incorrecta' });
    }
    req.session.isAuthenticated = true;
    res.status(200).send({ message: 'Inicio de sesión exitoso' });
});



// Ruta principal para mostrar la página de conexión (login)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
});

app.get('/home', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/home.html'));
});

// Usar el microservicio de conexión
app.use('/connect', connectRouter);

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});