function showErrorToast(message) {
    const toastContainer = document.getElementById('toast-container');

    // Verificar si el contenedor existe
    if (!toastContainer) {
        console.error('¡Elemento del contenedor del Toast no encontrado!');
        return;
    }

    // Crear un nuevo elemento Toast
    const newToast = document.createElement('div');
    newToast.className = 'toast align-items-center text-bg-danger border-0';
    newToast.setAttribute('role', 'alert');
    newToast.setAttribute('aria-live', 'assertive');
    newToast.setAttribute('aria-atomic', 'true');

    // Crear la estructura interna del Toast
    newToast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button
                type="button"
                class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"></button>
        </div>
    `;

    // Agregar el nuevo Toast al contenedor
    toastContainer.appendChild(newToast);

    // Crear una instancia del Toast de Bootstrap
    const bootstrapToast = new bootstrap.Toast(newToast, {
        delay: 5000 // Ocultar automáticamente después de 5 segundos
    });

    // Mostrar el Toast
    bootstrapToast.show();

    // Eliminar el Toast del DOM después de que se cierre
    newToast.addEventListener('hidden.bs.toast', () => {
        newToast.remove();
    });
}





document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-cliente-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Obtiene los campos del formulario donde se mostrará la información del cliente
        const newDocumentoId = document.getElementById('documento_id').value.trim()
        const newNombre = document.getElementById('nombre').value.trim();
        const newApellido = document.getElementById('apellido').value.trim();
        const newFechaNacimiento = document.getElementById('fecha_nacimiento').value;
        const newCiudad = document.getElementById('ciudad').value.trim();
        const newDireccion = document.getElementById('direccion').value.trim();
        const newTelefono = document.getElementById('telefono').value.trim();
        const newEmail = document.getElementById('email').value.trim();
        const newNacionalidad = document.getElementById('nacionalidad').value.trim() || null;
        console.log({ documento_id: newDocumentoId, nombre: newNombre, apellido: newApellido, fecha_nacimiento: newFechaNacimiento, ciudad: newCiudad, direccion: newDireccion, telefono: newTelefono, email: newEmail, nacionalidad: newNacionalidad });
        fetch('/clientes/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documento_id: newDocumentoId, nombre: newNombre, apellido: newApellido, fecha_nacimiento: newFechaNacimiento, ciudad: newCiudad, direccion: newDireccion, telefono: newTelefono, email: newEmail, nacionalidad: newNacionalidad })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/list_clientes';
                } else {
                    ;
                    showErrorToast(data.error || 'Error al agregar el cliente.');
                }
            })
            .catch(error => {
                showErrorToast(error || 'Error en la conexión con el servidor.');
            });
    });

});