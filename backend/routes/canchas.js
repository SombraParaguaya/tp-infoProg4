const express = require('express');
const router = express.Router();
const odbc = require('odbc');

// Ruta POST para conectar a la base de datos
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Intentar la conexión usando ODBC
        const connection = await odbc.connect(`DSN=infoProg4;UID=${username};PWD=${password}`);
        res.status(200).send("Conexión exitosa");
    } catch (error) {
        res.status(500).send("Error de conexión");
    }
});



const handleDbError = (err, res, action) => {
    let errorMessage = err?.odbcErrors?.[0]?.message || err.message || 'Unknown database error';
    if (errorMessage.includes("is referenced by foreign key")) {
        errorMessage = "No se puede realizar la operación porque el registro está relacionado con otros datos.";
    }
    console.error(`Error al ${action}:`, errorMessage);
    res.status(500).json({ success: false, error: `Error al ${action}: ${errorMessage}` });
};

router.get('/canchas', async (req, res) => {
    try {
        const connection = await odbc.connect('DSN=infoProg4;UID=informix;PWD=informix');
        const query = 'SELECT * FROM canchas';
        await connection.close();
        res.json({ success: true, data: [] });
    } catch (error) {
        handleDbError(error, res, 'obtener canchas');
    }
});

module.exports = router;