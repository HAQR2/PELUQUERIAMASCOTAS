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

let turnosAdmin = JSON.parse(localStorage.getItem('turnosAdmin')) || [
    { id: 1, clienteId: 1, mascotaId: 1, fecha: new Date().toISOString().split('T')[0], hora: "10:00", servicio: "Peluquería" },
    { id: 2, clienteId: 2, mascotaId: 2, fecha: new Date().toISOString().split('T')[0], hora: "11:00", servicio: "Consulta Veterinaria" }
];

// Guardar datos en localStorage
function guardarDatos() {
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('turnosAdmin', JSON.stringify(turnosAdmin));
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
    const servicio = document.getElementById('turnoServicio').value;
    const fecha = document.getElementById('turnoFecha').value;
    const hora = document.getElementById('turnoHora').value;
    const mensaje = document.getElementById('turnoMensaje').value;
    
    if (!clienteId || !mascotaId || !servicio || !fecha || !hora) {
        mostrarMensaje('Por favor, complete todos los campos obligatorios');
        return;
    }
    
    const nuevoTurno = {
        id: turnosAdmin.length > 0 ? Math.max(...turnosAdmin.map(t => t.id)) + 1 : 1,
        clienteId: clienteId,
        mascotaId: mascotaId,
        servicio: servicio,
        fecha: fecha,
        hora: hora,
        mensaje: mensaje
    };
    
    turnosAdmin.push(nuevoTurno);
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
    const listaTurnos = document.getElementById('listaTurnosAdmin');
    
    listaTurnos.innerHTML = '';
    
    // Obtener turnos públicos
    const turnosPublicos = JSON.parse(localStorage.getItem('turnosPublicos')) || [];
    
    // Obtener turnos del administrador
    const turnosDelDiaAdmin = turnosAdmin.filter(t => t.fecha === fecha);
    
    // Combinar y filtrar turnos públicos del día
    const turnosDelDiaPublicos = turnosPublicos.filter(t => t.fecha === fecha);
    
    // Combinar todos los turnos del día
    const todosLosTurnosDelDia = [...turnosDelDiaAdmin, ...turnosDelDiaPublicos];
    
    if (todosLosTurnosDelDia.length === 0) {
        listaTurnos.innerHTML = '<div class="turno-item">No hay turnos para esta fecha</div>';
        return;
    }
    
    // Ordenar por hora
    todosLosTurnosDelDia.sort((a, b) => a.hora.localeCompare(b.hora));
    
    todosLosTurnosDelDia.forEach(turno => {
        let turnoElement;
        
        if (turno.clienteId) {
            // Turno del administrador (con cliente registrado)
            const cliente = clientes.find(c => c.id === turno.clienteId);
            const mascota = cliente ? cliente.mascotas.find(m => m.id === turno.mascotaId) : null;
            
            if (!cliente || !mascota) return;
            
            turnoElement = document.createElement('div');
            turnoElement.className = 'turno-item';
            turnoElement.innerHTML = `
                <div class="turno-info">
                    <div class="turno-header">
                        <strong>${cliente.nombre} ${cliente.apellido}</strong>
                        <span class="turno-hora">${turno.hora}</span>
                    </div>
                    <p><i class="fas fa-paw"></i> ${mascota.nombre} (${mascota.tipo})</p>
                    <p><i class="fas fa-concierge-bell"></i> ${turno.servicio}</p>
                    ${turno.mensaje ? `
                        <div class="turno-mensaje">
                            <strong><i class="fas fa-comment"></i> Mensaje:</strong>
                            <p>${turno.mensaje}</p>
                        </div>
                    ` : ''}
                </div>
                <div class="turno-actions">
                    <button class="action-btn btn-delete" onclick="eliminarTurnoAdmin(${turno.id})">
                        <i class="fas fa-trash"></i> Cancelar
                    </button>
                </div>
            `;
        } else {
            // Turno público
            turnoElement = document.createElement('div');
            turnoElement.className = 'turno-item';
            turnoElement.innerHTML = `
                <div class="turno-info">
                    <div class="turno-header">
                        <strong>${turno.nombre}</strong>
                        <span class="turno-hora">${turno.hora}</span>
                    </div>
                    <p><i class="fas fa-paw"></i> ${turno.mascota}</p>
                    <p><i class="fas fa-concierge-bell"></i> ${turno.servicio}</p>
                    <p class="turno-contacto">
                        <i class="fas fa-phone"></i> ${turno.telefono} 
                        | <i class="fas fa-envelope"></i> ${turno.email}
                    </p>
                    ${turno.mensaje ? `
                        <div class="turno-mensaje">
                            <strong><i class="fas fa-comment"></i> Mensaje adicional:</strong>
                            <p>${turno.mensaje}</p>
                        </div>
                    ` : ''}
                </div>
                <div class="turno-actions">
                    <button class="action-btn btn-delete" onclick="eliminarTurnoPublico(${turno.id})">
                        <i class="fas fa-trash"></i> Cancelar
                    </button>
                </div>
            `;
        }
        
        listaTurnos.appendChild(turnoElement);
    });
}

function cargarTurnosSemana() {
    const fechaSeleccionada = document.getElementById('consultaSemana').value || new Date().toISOString().split('T')[0];
    const fechaSeleccionadaObj = new Date(fechaSeleccionada);
    
    const listaTurnos = document.getElementById('listaTurnosSemana');
    listaTurnos.innerHTML = '';
    
    // Mostrar loading
    document.getElementById('loadingSemana').style.display = 'block';
    
    // Obtener turnos públicos
    const turnosPublicos = JSON.parse(localStorage.getItem('turnosPublicos')) || [];
    
    // Obtener turnos del administrador
    const todosLosTurnos = [...turnosAdmin, ...turnosPublicos];
    
    if (todosLosTurnos.length === 0) {
        document.getElementById('loadingSemana').style.display = 'none';
        listaTurnos.innerHTML = '<div class="turno-item">No hay turnos registrados</div>';
        return;
    }
    
    // Crear array de los últimos 7 días (3 días antes + hoy + 3 días después)
    const diasSemana = [];
    for (let i = -3; i <= 3; i++) {
        const fecha = new Date(fechaSeleccionadaObj);
        fecha.setDate(fecha.getDate() + i);
        diasSemana.push(fecha.toISOString().split('T')[0]);
    }
    
    // Agrupar turnos por fecha
    const turnosPorFecha = {};
    diasSemana.forEach(fecha => {
        turnosPorFecha[fecha] = todosLosTurnos.filter(turno => turno.fecha === fecha);
    });
    
    // Mostrar turnos agrupados por fecha
    setTimeout(() => {
        document.getElementById('loadingSemana').style.display = 'none';
        
        Object.keys(turnosPorFecha).sort().forEach(fecha => {
            const fechaObj = new Date(fecha);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            fechaObj.setHours(0, 0, 0, 0);
            
            const fechaElement = document.createElement('div');
            fechaElement.className = 'fecha-group';
            
            // Determinar si es pasado, presente o futuro
            let estado = '';
            if (fechaObj < hoy) {
                estado = '<span class="estado-pasado">(Pasado)</span>';
            } else if (fechaObj.getTime() === hoy.getTime()) {
                estado = '<span class="estado-hoy">(Hoy)</span>';
            } else {
                estado = '<span class="estado-futuro">(Próximo)</span>';
            }
            
            fechaElement.innerHTML = `
                <h4>${formatearFecha(fecha)} ${estado}</h4>
            `;
            listaTurnos.appendChild(fechaElement);
            
            const turnosDelDia = turnosPorFecha[fecha];
            
            if (turnosDelDia.length === 0) {
                const sinTurnosElement = document.createElement('div');
                sinTurnosElement.className = 'turno-item sin-turnos';
                sinTurnosElement.innerHTML = '<p>No hay turnos para este día</p>';
                listaTurnos.appendChild(sinTurnosElement);
            } else {
                // Ordenar turnos por hora
                turnosDelDia.sort((a, b) => a.hora.localeCompare(b.hora));
                
                turnosDelDia.forEach(turno => {
                    let turnoElement;
                    
                    if (turno.clienteId) {
                        // Turno del administrador
                        const cliente = clientes.find(c => c.id === turno.clienteId);
                        const mascota = cliente ? cliente.mascotas.find(m => m.id === turno.mascotaId) : null;
                        
                        if (!cliente || !mascota) return;
                        
                        turnoElement = document.createElement('div');
                        turnoElement.className = 'turno-item';
                        turnoElement.innerHTML = `
                            <div class="turno-info">
                                <div class="turno-header">
                                    <strong>${cliente.nombre} ${cliente.apellido}</strong>
                                    <span class="turno-hora">${turno.hora}</span>
                                </div>
                                <p><i class="fas fa-paw"></i> ${mascota.nombre} (${mascota.tipo})</p>
                                <p><i class="fas fa-concierge-bell"></i> ${turno.servicio}</p>
                                ${turno.mensaje ? `
                                    <div class="turno-mensaje">
                                        <strong><i class="fas fa-comment"></i> Mensaje:</strong>
                                        <p>${turno.mensaje}</p>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="turno-actions">
                                <button class="action-btn btn-delete" onclick="eliminarTurnoAdmin(${turno.id})">
                                    <i class="fas fa-trash"></i> Cancelar
                                </button>
                            </div>
                        `;
                    } else {
                        // Turno público
                        turnoElement = document.createElement('div');
                        turnoElement.className = 'turno-item';
                        turnoElement.innerHTML = `
                            <div class="turno-info">
                                <div class="turno-header">
                                    <strong>${turno.nombre}</strong>
                                    <span class="turno-hora">${turno.hora}</span>
                                </div>
                                <p><i class="fas fa-paw"></i> ${turno.mascota}</p>
                                <p><i class="fas fa-concierge-bell"></i> ${turno.servicio}</p>
                                <p class="turno-contacto">
                                    <i class="fas fa-phone"></i> ${turno.telefono} 
                                    | <i class="fas fa-envelope"></i> ${turno.email}
                                </p>
                                ${turno.mensaje ? `
                                    <div class="turno-mensaje">
                                        <strong><i class="fas fa-comment"></i> Mensaje adicional:</strong>
                                        <p>${turno.mensaje}</p>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="turno-actions">
                                <button class="action-btn btn-delete" onclick="eliminarTurnoPublico(${turno.id})">
                                    <i class="fas fa-trash"></i> Cancelar
                                </button>
                            </div>
                        `;
                    }
                    
                    listaTurnos.appendChild(turnoElement);
                });
            }
        });
    }, 500); // Simular carga
}

function eliminarTurnoAdmin(id) {
    if (confirm('¿Está seguro de que desea cancelar este turno?')) {
        // Buscar en turnosAdmin
        const turnoIndex = turnosAdmin.findIndex(t => t.id === id);
        if (turnoIndex !== -1) {
            turnosAdmin.splice(turnoIndex, 1);
            guardarDatos();
        } else {
            // Si no está en turnosAdmin, buscar en turnos públicos
            let turnosPublicos = JSON.parse(localStorage.getItem('turnosPublicos')) || [];
            turnosPublicos = turnosPublicos.filter(t => t.id !== id);
            localStorage.setItem('turnosPublicos', JSON.stringify(turnosPublicos));
        }
        
        cargarTurnosDia();
        cargarTurnosSemana();
        mostrarMensaje('Turno cancelado exitosamente');
    }
}

function eliminarTurnoPublico(id) {
    if (confirm('¿Está seguro de que desea cancelar este turno?')) {
        let turnosPublicos = JSON.parse(localStorage.getItem('turnosPublicos')) || [];
        turnosPublicos = turnosPublicos.filter(t => t.id !== id);
        localStorage.setItem('turnosPublicos', JSON.stringify(turnosPublicos));
        cargarTurnosDia();
        cargarTurnosSemana();
        mostrarMensaje('Turno cancelado exitosamente');
    }
}

function formatearFecha(fecha) {
    const fechaObj = new Date(fecha);
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return fechaObj.toLocaleDateString('es-ES', opciones);
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
    
    // Configurar fecha de la semana (hoy por defecto)
    const hoy = new Date();
    document.getElementById('consultaSemana').value = hoy.toISOString().split('T')[0];
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