document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addCanchaForm');
    const cancelButton = document.getElementById('cancel-button');

    // Cargar lista de tipos de suelo
    const loadTiposDeSuelo = () => {
        fetch('/tipos-suelo/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const tipoSueloSelect = document.getElementById('tipo');
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Selecciona un tipo de suelo';
                    defaultOption.selected = true;
                    defaultOption.disabled = true;
                    tipoSueloSelect.appendChild(defaultOption);

                    data.tipos.forEach(tipo => {
                        const option = document.createElement('option');
                        option.value = tipo.ID;
                        option.textContent = tipo.NOMBRE;
                        tipoSueloSelect.appendChild(option);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar los tipos de suelo.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar tipos de suelo:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor para cargar los tipos de suelo.',
                    confirmButtonText: 'Aceptar'
                });
            });
    };

    // Llamar a la función para cargar tipos de suelo
    loadTiposDeSuelo();

    // Procesar el formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const canchaData = {
            numero: document.getElementById('numero').value.trim(),
            ubicacion: document.getElementById('ubicacion').value.trim(),
            tipo_suelo: document.getElementById('tipo_suelo').value,
            luminica: document.getElementById('luminica').checked ? 1 : 0,
            bebedero: document.getElementById('bebedero').checked ? 1 : 0,
            banos: document.getElementById('banos').checked ? 1 : 0,
            cambiador: document.getElementById('cambiador').checked ? 1 : 0,
            estado: document.getElementById('estado').value.trim()
        };

        fetch('/api/canchas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(canchaData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Cancha agregada',
                    text: 'La cancha se ha agregado correctamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.href = './canchas.html'; // Redirige tras el éxito
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al agregar la cancha.',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error al agregar cancha:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor para agregar la cancha.',
                confirmButtonText: 'Aceptar'
            });
        });
    });

    // Manejar el botón de cancelar
    if (cancelButton) {
        cancelButton.addEventListener('click', function () {
            window.location.href = '/canchas'; // Redirige a la lista de canchas
        });
    }
});
