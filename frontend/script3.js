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
let clientes = [
    { id: 1, nombre: "Juan", apellido: "Pérez", telefono: "123456789", correo: "juan@example.com", mascotas: [] },
    { id: 2, nombre: "María", apellido: "Gómez", telefono: "987654321", correo: "maria@example.com", mascotas: [] }
];

let turnos = [
    { id: 1, clienteId: 1, mascotaId: 1, fecha: "2023-12-01", hora: "10:00", servicio: "Peluquería" },
    { id: 2, clienteId: 2, mascotaId: 2, fecha: "2023-12-01", hora: "11:00", servicio: "Consulta Veterinaria" }
];

let mascotas = [
    { id: 1, clienteId: 1, nombre: "Max", tipo: "Perro" },
    { id: 2, clienteId: 2, nombre: "Luna", tipo: "Gato" }
];

// Formulario de cliente
document.getElementById('formCliente').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nuevoCliente = {
        id: clientes.length + 1,
        nombre: document.getElementById('clienteNombre').value,
        apellido: document.getElementById('clienteApellido').value,
        telefono: document.getElementById('clienteTelefono').value,
        correo: document.getElementById('clienteCorreo').value,
        mascotas: []
    };
    
    clientes.push(nuevoCliente);
    this.reset();
    mostrarMensaje('Cliente guardado exitosamente');
    actualizarSelectClientes();
});

// Formulario de mascota
document.getElementById('formMascota').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nuevaMascota = {
        id: mascotas.length + 1,
        clienteId: parseInt(document.getElementById('mascotaClienteId').value),
        nombre: document.getElementById('mascotaNombre').value,
        tipo: document.getElementById('mascotaTipo').value
    };
    
    mascotas.push(nuevaMascota);
    this.reset();
    document.getElementById('cardMascota').style.display = 'none';
    mostrarMensaje('Mascota agregada exitosamente');
    actualizarSelectMascotas();
});

// Formulario de turno (administración)
document.getElementById('formTurnoAdmin').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nuevoTurno = {
        id: turnos.length + 1,
        clienteId: parseInt(document.getElementById('turnoClienteId').value),
        mascotaId: parseInt(document.getElementById('turnoMascotaId').value),
        fecha: document.getElementById('turnoFecha').value,
        hora: document.getElementById('turnoHora').value,
        servicio: "Peluquería" // Por defecto
    };
    
    turnos.push(nuevoTurno);
    this.reset();
    mostrarMensaje('Turno agendado exitosamente');
    cargarTurnosDia();
});

// Funciones auxiliares
function buscarClientes() {
    const busqueda = document.getElementById('buscarCliente').value.toLowerCase();
    const resultados = clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(busqueda) || 
        cliente.apellido.toLowerCase().includes(busqueda)
    );
    
    const listaClientes = document.getElementById('listaClientes');
    listaClientes.innerHTML = '';
    
    if (resultados.length === 0) {
        listaClientes.innerHTML = '<div class="cliente-item">No se encontraron clientes</div>';
        return;
    }
    
    resultados.forEach(cliente => {
        const clienteElement = document.createElement('div');
        clienteElement.className = 'cliente-item';
        clienteElement.innerHTML = `
            <div class="cliente-info">
                <h4>${cliente.nombre} ${cliente.apellido}</h4>
                <p>${cliente.telefono} | ${cliente.correo}</p>
            </div>
            <div class="cliente-actions">
                <button class="action-btn btn-add" onclick="agregarMascota(${cliente.id})">
                    <i class="fas fa-plus"></i> Mascota
                </button>
            </div>
        `;
        listaClientes.appendChild(clienteElement);
    });
}

function agregarMascota(clienteId) {
    document.getElementById('mascotaClienteId').value = clienteId;
    document.getElementById('cardMascota').style.display = 'block';
}

function cargarMascotasCliente() {
    const clienteId = parseInt(document.getElementById('turnoClienteId').value);
    const mascotasCliente = mascotas.filter(m => m.clienteId === clienteId);
    const selectMascota = document.getElementById('turnoMascotaId');
    
    selectMascota.innerHTML = '<option value="">Seleccione una mascota...</option>';
    mascotasCliente.forEach(mascota => {
        const option = document.createElement('option');
        option.value = mascota.id;
        option.textContent = `${mascota.nombre} (${mascota.tipo})`;
        selectMascota.appendChild(option);
    });
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
        const mascota = mascotas.find(m => m.id === turno.mascotaId);
        
        const turnoElement = document.createElement('div');
        turnoElement.className = 'turno-item';
        turnoElement.innerHTML = `
            <div class="turno-info">
                <h4>${cliente.nombre} ${cliente.apellido}</h4>
                <p>${mascota.nombre} (${mascota.tipo}) - ${turno.hora}</p>
                <small>${turno.servicio}</small>
            </div>
        `;
        listaTurnos.appendChild(turnoElement);
    });
}

function cargarTurnosSemana() {
    const fechaInicio = document.getElementById('consultaSemana').value || new Date().toISOString().split('T')[0];
    // Simulamos una semana a partir de la fecha seleccionada
    const listaTurnos = document.getElementById('listaTurnosSemana');
    
    listaTurnos.innerHTML = '';
    
    // Filtramos turnos de los próximos 7 días
    const turnosSemana = turnos.filter(t => {
        const fechaTurno = new Date(t.fecha);
        const fechaInicioObj = new Date(fechaInicio);
        const diferencia = fechaTurno - fechaInicioObj;
        return diferencia >= 0 && diferencia <= 7 * 24 * 60 * 60 * 1000;
    });
    
    if (turnosSemana.length === 0) {
        listaTurnos.innerHTML = '<div class="turno-item">No hay turnos para esta semana</div>';
        return;
    }
    
    turnosSemana.forEach(turno => {
        const cliente = clientes.find(c => c.id === turno.clienteId);
        const mascota = mascotas.find(m => m.id === turno.mascotaId);
        
        const turnoElement = document.createElement('div');
        turnoElement.className = 'turno-item';
        turnoElement.innerHTML = `
            <div class="turno-info">
                <h4>${cliente.nombre} ${cliente.apellido}</h4>
                <p>${mascota.nombre} (${mascota.tipo}) - ${turno.fecha} ${turno.hora}</p>
                <small>${turno.servicio}</small>
            </div>
        `;
        listaTurnos.appendChild(turnoElement);
    });
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

function actualizarSelectMascotas() {
    // Actualizar select de mascotas según el cliente seleccionado
    if (document.getElementById('turnoClienteId').value) {
        cargarMascotasCliente();
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    actualizarSelectClientes();
    cargarTurnosDia();
    
    // Configurar fecha mínima para los inputs de fecha
    const fechaInputs = document.querySelectorAll('input[type="date"]');
    fechaInputs.forEach(input => {
        input.min = new Date().toISOString().split('T')[0];
    });
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