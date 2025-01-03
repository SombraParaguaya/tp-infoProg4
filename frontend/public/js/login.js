// Event Listener para la tecla Enter
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Evita que la página se recargue
        connectDatabase();  // Llama a la función connectDatabase()
    }
});


// Función para enviar datos de conexión al servidor
async function connectDatabase() {
    const username = document.getElementById('username').value.toLowerCase();
    const password = document.getElementById('password').value;

    try {
        // Enviar solicitud de conexión al backend
        //Connecion para la session
        const responseLogin = await fetch('/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!responseLogin.ok) {
            const errorLogin = await responseLogin.json();
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-message').innerText = errorLogin.message;
            return
        }
        //Connecion a la Base de Datos
        const responseDB = await fetch('/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!responseDB.ok) {
            const errorDB = await responseDB.json();
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-message').innerText = errorDB.message;
            return
        }

        window.location.href = '/home'; // Redirige a home en caso de éxito
    } catch (error) {
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').innerText = "Error al conectar.";
    }
}
