const express = require('express');
const path = require('path');

// Imports para Autentificacion
const session = require('express-session');
require('dotenv').config();

const connectRouter = require('./routes/connect'); // Ruta del microservicio
const clientesRouter = require('./routes/clientes'); // Ruta para clientes
const canchasRouter = require('./routes/canchas'); // Ruta de las canchas


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

app.get('/salir', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Error al cerrar sesión");
        };
        res.redirect('/login');
    });
});

app.get('/', (req, res) => {
    res.redirect("/home");
});

// Ruta principal para mostrar la página de conexión (login)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
});

app.get('/home', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/home.html'));
});

app.get('/list_clientes', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/list_clientes.html'));
});

app.get('/add_cliente', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/add_cliente.html'));
});

app.get('/upd_cliente', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/upd_cliente.html'));
});
app.get('/canchas', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/canchas.html'));
});

app.get('/add_cancha', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/add_cancha.html'));
});



// Usar el microservicio de conexión
app.use('/connect', connectRouter);

app.use('/clientes', clientesRouter);  //Ruta para clientes
app.use('/api/canchas', canchasRouter);


// Ruta para 404
app.use(isAuthenticated, (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/views/404.html'));
});
// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
