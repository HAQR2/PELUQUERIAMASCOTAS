// Menú móvil
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('nav').classList.toggle('active');
});

// Smooth scroll para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Cerrar menú móvil después de hacer clic
            if(window.innerWidth <= 768) {
                document.querySelector('nav').classList.remove('active');
            }
        }
    });
});

// Sistema de turnos público
document.getElementById('turnoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validación básica
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const mascota = document.getElementById('mascota').value;
    const servicio = document.getElementById('servicio').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    
    if (!nombre || !email || !telefono || !mascota || !servicio || !fecha || !hora) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }
    
    // En una implementación real, aquí enviaríamos los datos al servidor Python
    const datosTurno = {
        nombre: nombre,
        email: email,
        telefono: telefono,
        mascota: mascota,
        servicio: servicio,
        fecha: fecha,
        hora: hora,
        mensaje: document.getElementById('mensaje').value
    };
    
    enviarDatosAlBackend(datosTurno);
    
    // Mostrar modal de confirmación
    document.getElementById('confirmationModal').style.display = 'block';
    
    // Limpiar formulario
    document.getElementById('turnoForm').reset();
});

// Cerrar modal
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

document.getElementById('modalClose').addEventListener('click', function() {
    document.getElementById('confirmationModal').style.display = 'none';
});

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', function(e) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Configurar fecha mínima como hoy
const today = new Date();
const formattedDate = today.toISOString().split('T')[0];
document.getElementById('fecha').min = formattedDate;

// Simulación de envío de datos al backend Python
function enviarDatosAlBackend(datosTurno) {
    // En una implementación real, usaríamos fetch o axios para enviar los datos
    // al backend Python
    
    // Por ahora, solo mostramos los datos en consola
    console.log('Datos del turno:', datosTurno);
}

// ================= SISTEMA DE ADMINISTRACIÓN =================

// Funcionalidad de pestañas
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remover active de todos los botones y paneles
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));
        
        // Activar la pestaña clickeada
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Datos de ejemplo para clientes y turnos
let clientes = JSON.parse(localStorage.getItem('clientes')) || [
    { 
        id: 1, 
        nombre: "Juan", 
        apellido: "Pérez", 
        telefono: "123456789", 
        correo: "juan@example.com", 
        mascotas: [
            { id: 1, nombre: "Max", tipo: "Perro" }
        ] 
    },
    { 
        id: 2, 
        nombre: "María", 
        apellido: "Gómez", 
        telefono: "987654321", 
        correo: "maria@example.com", 
        mascotas: [
            { id: 2, nombre: "Luna", tipo: "Gato" }
        ] 
    }
];

let turnos = JSON.parse(localStorage.getItem('turnos')) || [
    { id: 1, clienteId: 1, mascotaId: 1, fecha: new Date().toISOString().split('T')[0], hora: "10:00", servicio: "Peluquería" },
    { id: 2, clienteId: 2, mascotaId: 2, fecha: new Date().toISOString().split('T')[0], hora: "11:00", servicio: "Consulta Veterinaria" }
];

// Guardar datos en localStorage
function guardarDatos() {
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('turnos', JSON.stringify(turnos));
}

// Formulario de cliente
document.getElementById('formCliente').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const clienteId = document.getElementById('clienteId').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;
    const mascotaNombre = document.getElementById('mascotaNombre').value;
    const mascotaTipo = document.getElementById('mascotaTipo').value;
    
    if (clienteId) {
        // Editar cliente existente
        const index = clientes.findIndex(c => c.id == clienteId);
        if (index !== -1) {
            clientes[index].nombre = nombre;
            clientes[index].apellido = apellido;
            clientes[index].telefono = telefono;
            clientes[index].correo = correo;
            
            // Si se proporcionó una mascota, agregarla
            if (mascotaNombre && mascotaTipo) {
                const nuevaMascota = {
                    id: clientes[index].mascotas.length > 0 ? 
                        Math.max(...clientes[index].mascotas.map(m => m.id)) + 1 : 1,
                    nombre: mascotaNombre,
                    tipo: mascotaTipo
                };
                clientes[index].mascotas.push(nuevaMascota);
            }
            
            mostrarMensaje('Cliente actualizado exitosamente');
        }
    } else {
        // Crear nuevo cliente
        const nuevoCliente = {
            id: clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1,
            nombre: nombre,
            apellido: apellido,
            telefono: telefono,
            correo: correo,
            mascotas: []
        };
        
        // Si se proporcionó una mascota, agregarla
        if (mascotaNombre && mascotaTipo) {
            nuevoCliente.mascotas.push({
                id: 1,
                nombre: mascotaNombre,
                tipo: mascotaTipo
            });
        }
        
        clientes.push(nuevoCliente);
        mostrarMensaje('Cliente guardado exitosamente');
    }
    
    this.reset();
    document.getElementById('clienteId').value = '';
    document.getElementById('cancelarEdicion').style.display = 'none';
    guardarDatos();
    cargarTablaClientes();
    actualizarSelectClientes();
});

// Cancelar edición
document.getElementById('cancelarEdicion').addEventListener('click', function() {
    document.getElementById('formCliente').reset();
    document.getElementById('clienteId').value = '';
    this.style.display = 'none';
});

// Formulario de turno (administración)
document.getElementById('formTurnoAdmin').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const clienteId = parseInt(document.getElementById('turnoClienteId').value);
    const mascotaId = parseInt(document.getElementById('turnoMascotaId').value);
    const fecha = document.getElementById('turnoFecha').value;
    const hora = document.getElementById('turnoHora').value;
    
    if (!clienteId || !mascotaId || !fecha || !hora) {
        mostrarMensaje('Por favor, complete todos los campos');
        return;
    }
    
    const nuevoTurno = {
        id: turnos.length > 0 ? Math.max(...turnos.map(t => t.id)) + 1 : 1,
        clienteId: clienteId,
        mascotaId: mascotaId,
        fecha: fecha,
        hora: hora,
        servicio: "Peluquería" // Por defecto
    };
    
    turnos.push(nuevoTurno);
    this.reset();
    mostrarMensaje('Turno agendado exitosamente');
    guardarDatos();
    cargarTurnosDia();
    cargarTurnosSemana();
});

// Funciones auxiliares
function cargarTablaClientes() {
    const tablaClientes = document.getElementById('tablaClientes');
    tablaClientes.innerHTML = '';
    
    if (clientes.length === 0) {
        tablaClientes.innerHTML = '<tr><td colspan="8" class="text-center">No hay clientes registrados</td></tr>';
        return;
    }
    
    clientes.forEach(cliente => {
        const fila = document.createElement('tr');
        
        // Mostrar información del cliente
        fila.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellido}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.correo}</td>
            <td>${cliente.mascotas.length > 0 ? cliente.mascotas[0].nombre : '-'}</td>
            <td>${cliente.mascotas.length > 0 ? cliente.mascotas[0].tipo : '-'}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editarCliente(${cliente.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="action-btn btn-delete" onclick="eliminarCliente(${cliente.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        
        tablaClientes.appendChild(fila);
    });
}

function editarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;
    
    document.getElementById('clienteId').value = cliente.id;
    document.getElementById('nombre').value = cliente.nombre;
    document.getElementById('apellido').value = cliente.apellido;
    document.getElementById('telefono').value = cliente.telefono;
    document.getElementById('correo').value = cliente.correo;
    
    // Limpiar campos de mascota para nueva mascota
    document.getElementById('mascotaNombre').value = '';
    document.getElementById('mascotaTipo').value = '';
    
    document.getElementById('cancelarEdicion').style.display = 'inline-block';
    
    // Scroll al formulario
    document.getElementById('formCliente').scrollIntoView({ behavior: 'smooth' });
}

function eliminarCliente(id) {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
        clientes = clientes.filter(c => c.id !== id);
        guardarDatos();
        cargarTablaClientes();
        actualizarSelectClientes();
        mostrarMensaje('Cliente eliminado exitosamente');
    }
}

function cargarMascotasCliente() {
    const clienteId = parseInt(document.getElementById('turnoClienteId').value);
    const cliente = clientes.find(c => c.id === clienteId);
    const selectMascota = document.getElementById('turnoMascotaId');
    
    selectMascota.innerHTML = '<option value="">Seleccione una mascota...</option>';
    
    if (cliente && cliente.mascotas.length > 0) {
        cliente.mascotas.forEach(mascota => {
            const option = document.createElement('option');
            option.value = mascota.id;
            option.textContent = `${mascota.nombre} (${mascota.tipo})`;
            selectMascota.appendChild(option);
        });
    }
}

function cargarTurnosDia() {
    const fecha = document.getElementById('consultaFecha').value || new Date().toISOString().split('T')[0];
    const turnosDia = turnos.filter(t => t.fecha === fecha);
    const listaTurnos = document.getElementById('listaTurnosAdmin');
    
    listaTurnos.innerHTML = '';
    
    if (turnosDia.length === 0) {
        listaTurnos.innerHTML = '<div class="turno-item">No hay turnos para esta fecha</div>';
        return;
    }
    
    turnosDia.forEach(turno => {
        const cliente = clientes.find(c => c.id === turno.clienteId);
        const mascota = cliente ? cliente.mascotas.find(m => m.id === turno.mascotaId) : null;
        
        if (!cliente || !mascota) return;
        
        const turnoElement = document.createElement('div');
        turnoElement.className = 'turno-item';
        turnoElement.innerHTML = `
            <div class="turno-info">
                <h4>${cliente.nombre} ${cliente.apellido}</h4>
                <p>${mascota.nombre} (${mascota.tipo}) - ${turno.hora}</p>
                <small>${turno.servicio}</small>
            </div>
            <div class="turno-actions">
                <button class="action-btn btn-delete" onclick="eliminarTurno(${turno.id})">
                    <i class="fas fa-trash"></i> Cancelar
                </button>
            </div>
        `;
        listaTurnos.appendChild(turnoElement);
    });
}

function cargarTurnosSemana() {
    const fechaInicio = document.getElementById('consultaSemana').value || new Date().toISOString().split('T')[0];
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaInicioObj);
    fechaFinObj.setDate(fechaFinObj.getDate() + 6); // 7 días incluyendo el inicial
    
    const listaTurnos = document.getElementById('listaTurnosSemana');
    listaTurnos.innerHTML = '';
    
    // Filtramos turnos de la semana seleccionada
    const turnosSemana = turnos.filter(t => {
        const fechaTurno = new Date(t.fecha);
        return fechaTurno >= fechaInicioObj && fechaTurno <= fechaFinObj;
    });
    
    if (turnosSemana.length === 0) {
        listaTurnos.innerHTML = '<div class="turno-item">No hay turnos para esta semana</div>';
        return;
    }
    
    // Agrupar turnos por fecha
    const turnosPorFecha = {};
    turnosSemana.forEach(turno => {
        if (!turnosPorFecha[turno.fecha]) {
            turnosPorFecha[turno.fecha] = [];
        }
        turnosPorFecha[turno.fecha].push(turno);
    });
    
    // Mostrar turnos agrupados por fecha
    Object.keys(turnosPorFecha).sort().forEach(fecha => {
        const fechaElement = document.createElement('div');
        fechaElement.className = 'fecha-group';
        fechaElement.innerHTML = `<h4>${formatearFecha(fecha)}</h4>`;
        listaTurnos.appendChild(fechaElement);
        
        turnosPorFecha[fecha].forEach(turno => {
            const cliente = clientes.find(c => c.id === turno.clienteId);
            const mascota = cliente ? cliente.mascotas.find(m => m.id === turno.mascotaId) : null;
            
            if (!cliente || !mascota) return;
            
            const turnoElement = document.createElement('div');
            turnoElement.className = 'turno-item';
            turnoElement.innerHTML = `
                <div class="turno-info">
                    <p><strong>${cliente.nombre} ${cliente.apellido}</strong> - ${mascota.nombre} (${mascota.tipo})</p>
                    <p>${turno.hora} - ${turno.servicio}</p>
                </div>
            `;
            listaTurnos.appendChild(turnoElement);
        });
    });
}

function eliminarTurno(id) {
    if (confirm('¿Está seguro de que desea cancelar este turno?')) {
        turnos = turnos.filter(t => t.id !== id);
        guardarDatos();
        cargarTurnosDia();
        cargarTurnosSemana();
        mostrarMensaje('Turno cancelado exitosamente');
    }
}

function formatearFecha(fecha) {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

function mostrarMensaje(mensaje) {
    // En una implementación real, usaríamos un sistema de notificaciones
    alert(mensaje);
}

function actualizarSelectClientes() {
    const selectCliente = document.getElementById('turnoClienteId');
    selectCliente.innerHTML = '<option value="">Seleccione un cliente...</option>';
    
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = `${cliente.nombre} ${cliente.apellido}`;
        selectCliente.appendChild(option);
    });
}

// Búsqueda de clientes
document.getElementById('buscarCliente').addEventListener('input', function() {
    const busqueda = this.value.toLowerCase();
    const filas = document.querySelectorAll('#tablaClientes tr');
    
    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        fila.style.display = textoFila.includes(busqueda) ? '' : 'none';
    });
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    cargarTablaClientes();
    actualizarSelectClientes();
    cargarTurnosDia();
    cargarTurnosSemana();
    
    // Configurar fecha mínima para los inputs de fecha
    const fechaInputs = document.querySelectorAll('input[type="date"]');
    fechaInputs.forEach(input => {
        input.min = new Date().toISOString().split('T')[0];
        // Establecer fecha actual por defecto
        if (!input.value) {
            input.value = new Date().toISOString().split('T')[0];
        }
    });
    
    // Configurar fecha de la semana (lunes de la semana actual)
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - hoy.getDay() + 1); // +1 porque getDay() devuelve 0 para domingo
    document.getElementById('consultaSemana').value = lunes.toISOString().split('T')[0];
});

// Efecto de aparición al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar elementos para animación
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.service-card, .product-card, .testimonial-card');
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
});