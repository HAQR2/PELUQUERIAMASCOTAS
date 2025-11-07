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

// ================= SISTEMA DE ANIMACIONES =================

class NumberAnimator {
    constructor() {
        this.animations = [];
    }
    
    // Animación principal para números
    animateNumber(element, finalValue, options = {}) {
        const {
            duration = 1200,
            prefix = '',
            suffix = '',
            startValue = 0,
            easing = 'easeOutQuart',
            onComplete = null
        } = options;
        
        return new Promise((resolve) => {
            let startTime = null;
            const elementToAnimate = typeof element === 'string' ? 
                document.querySelector(element) : element;
            
            // Guardar el texto original para restaurar después de la animación
            const originalText = elementToAnimate.textContent;
            
            function animate(currentTime) {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                
                // Diferentes funciones de easing
                let easedProgress;
                switch(easing) {
                    case 'easeOutQuart':
                        easedProgress = 1 - Math.pow(1 - progress, 4);
                        break;
                    case 'easeOutBack':
                        easedProgress = 1 - Math.pow(1 - progress, 3);
                        break;
                    case 'easeOutElastic':
                        easedProgress = 1 - Math.pow(1 - progress, 3) * Math.cos(progress * Math.PI * 4);
                        break;
                    default:
                        easedProgress = progress;
                }
                
                const currentValue = Math.floor(startValue + (finalValue - startValue) * easedProgress);
                
                if (elementToAnimate) {
                    elementToAnimate.textContent = `${prefix}${currentValue.toLocaleString()}${suffix}`;
                    
                    // Efecto visual durante la animación
                    if (progress < 1) {
                        elementToAnimate.style.color = '#ff7a5a';
                        elementToAnimate.style.fontWeight = 'bold';
                    } else {
                        elementToAnimate.style.color = '';
                        elementToAnimate.style.fontWeight = '';
                        if (onComplete) onComplete();
                        resolve();
                    }
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }
            
            requestAnimationFrame(animate);
        });
    }
    
    // Animación para barras de progreso
    animateBar(barraElement, finalPercentage, duration = 1000) {
        return new Promise((resolve) => {
            let startTime = null;
            
            function animate(currentTime) {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const currentPercentage = finalPercentage * easedProgress;
                
                if (barraElement) {
                    barraElement.style.width = `${currentPercentage}%`;
                    
                    // Actualizar el texto dentro de la barra
                    const progressText = barraElement.querySelector('.barra-progreso-texto');
                    if (progressText) {
                        progressText.textContent = Math.floor(currentPercentage);
                    }
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            }
            
            requestAnimationFrame(animate);
        });
    }
    
    // Ejecutar múltiples animaciones en secuencia
    async animateSequence(animations) {
        for (const animation of animations) {
            await this.animateNumber(...animation);
            await new Promise(resolve => setTimeout(resolve, 100)); // Pequeña pausa entre animaciones
        }
    }
}

// Crear instancia global del animador
const animator = new NumberAnimator();

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

// Horarios disponibles
const horariosDisponibles = [
    "09:00", "10:00", "11:00", "12:00", 
    "14:00", "15:00", "16:00", "17:00"
];

// Precios de servicios (simulados para el ejemplo)
const preciosServicios = {
    "peluqueria": 1500,
    "veterinaria": 2000,
    "guarderia": 1200,
    "adiestramiento": 1800,
    "paseos": 800,
    "Vacunas": 1500,
    "Atencion al bienestar": 1700,
    "Cuidado Dental": 2200,
    "Atencion de Emergencia": 3500,
    "Microchip": 2500,
    "Telemedicina": 1200,
    "otros": 1000
};

// Función para obtener horas ocupadas para una fecha específica
function obtenerHorasOcupadas(fecha) {
    const turnosPublicos = JSON.parse(localStorage.getItem('turnosPublicos')) || [];
    const turnosAdmin = JSON.parse(localStorage.getItem('turnosAdmin')) || [];
    
    // Combinar todos los turnos
    const todosLosTurnos = [...turnosPublicos, ...turnosAdmin];
    
    // Filtrar turnos para la fecha específica y obtener las horas
    const horasOcupadas = todosLosTurnos
        .filter(turno => turno.fecha === fecha)
        .map(turno => turno.hora);
    
    return horasOcupadas;
}

// Función para actualizar las horas disponibles en el select
function actualizarHorasDisponiblesAdmin() {
    const fechaSeleccionada = document.getElementById('turnoFecha').value;
    const selectHora = document.getElementById('turnoHora');
    
    // Limpiar el select
    selectHora.innerHTML = '<option value="">Seleccione una hora</option>';
    
    if (!fechaSeleccionada) return;
    
    // Obtener horas ocupadas para la fecha seleccionada
    const horasOcupadas = obtenerHorasOcupadas(fechaSeleccionada);
    
    // Agregar opciones de horas disponibles
    horariosDisponibles.forEach(hora => {
        const option = document.createElement('option');
        option.value = hora;
        option.textContent = `${hora} ${hora < '12:00' ? 'AM' : 'PM'}`;
        
        // Deshabilitar opción si la hora está ocupada
        if (horasOcupadas.includes(hora)) {
            option.disabled = true;
            option.textContent += ' (No disponible)';
        }
        
        selectHora.appendChild(option);
    });
}

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
    
    // Verificar si la hora ya está ocupada
    const horasOcupadas = obtenerHorasOcupadas(fecha);
    if (horasOcupadas.includes(hora)) {
        mostrarMensaje('Lo sentimos, esa hora ya está ocupada. Por favor, elija otra.');
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

// ================= SISTEMA DE REPORTES CON ANIMACIONES =================

// Mostrar/ocultar fechas personalizadas
document.getElementById('reportePeriodo').addEventListener('change', function() {
    const fechasPersonalizadas = document.getElementById('fechasPersonalizadas');
    if (this.value === 'personalizado') {
        fechasPersonalizadas.style.display = 'block';
    } else {
        fechasPersonalizadas.style.display = 'none';
    }
});

// Función principal para generar reportes
async function generarReportes() {
    const periodo = document.getElementById('reportePeriodo').value;
    let fechaInicio, fechaFin;

    // Calcular fechas según el período seleccionado
    const hoy = new Date();
    switch (periodo) {
        case 'hoy':
            fechaInicio = new Date(hoy);
            fechaFin = new Date(hoy);
            break;
        case 'semana':
            fechaInicio = new Date(hoy);
            fechaInicio.setDate(hoy.getDate() - 7);
            fechaFin = new Date(hoy);
            break;
        case 'mes':
            fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
            fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
            break;
        case 'trimestre':
            fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 2, 1);
            fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
            break;
        case 'personalizado':
            fechaInicio = new Date(document.getElementById('fechaInicio').value);
            fechaFin = new Date(document.getElementById('fechaFin').value);
            break;
    }

    // Obtener todos los turnos del período
    const turnosPublicos = JSON.parse(localStorage.getItem('turnosPublicos')) || [];
    const turnosAdminData = JSON.parse(localStorage.getItem('turnosAdmin')) || [];
    const todosLosTurnos = [...turnosPublicos, ...turnosAdminData];

    const turnosFiltrados = todosLosTurnos.filter(turno => {
        const fechaTurno = new Date(turno.fecha);
        return fechaTurno >= fechaInicio && fechaTurno <= fechaFin;
    });

    // Generar todos los reportes con animaciones
    await generarResumenGeneral(turnosFiltrados);
    await generarReporteServicios(turnosFiltrados);
    await generarReporteHorarios(turnosFiltrados);
    generarReporteClientesFrecuentes(turnosFiltrados);
    generarReporteEficiencia(turnosFiltrados);
}

// 1. Resumen General con Animaciones
async function generarResumenGeneral(turnos) {
    const totalTurnos = turnos.length;
    
    // Calcular ingresos totales
    const ingresosTotales = turnos.reduce((total, turno) => {
        const precio = preciosServicios[turno.servicio] || preciosServicios.otros;
        return total + precio;
    }, 0);

    const totalClientes = new Set(turnos.map(t => t.clienteId || t.nombre)).size;

    // Servicio más popular
    const serviciosCount = {};
    turnos.forEach(turno => {
        serviciosCount[turno.servicio] = (serviciosCount[turno.servicio] || 0) + 1;
    });
    
    const servicioPopular = Object.keys(serviciosCount).reduce((a, b) => 
        serviciosCount[a] > serviciosCount[b] ? a : b, '');

    // Animar los valores en secuencia
    await animator.animateNumber(
        document.getElementById('totalIngresos'), 
        ingresosTotales, 
        { prefix: '$', duration: 1500, easing: 'easeOutElastic' }
    );

    await animator.animateNumber(
        document.getElementById('totalTurnos'), 
        totalTurnos, 
        { duration: 1200, easing: 'easeOutQuart' }
    );

    await animator.animateNumber(
        document.getElementById('totalClientes'), 
        totalClientes, 
        { duration: 1000, easing: 'easeOutQuart' }
    );

    document.getElementById('servicioPopular').textContent = servicioPopular || '-';
}

// 2. Servicios Más Populares con Animaciones
async function generarReporteServicios(turnos) {
    const serviciosCount = {};
    const serviciosIngresos = {};

    turnos.forEach(turno => {
        const servicio = turno.servicio;
        const precio = preciosServicios[servicio] || preciosServicios.otros;
        
        serviciosCount[servicio] = (serviciosCount[servicio] || 0) + 1;
        serviciosIngresos[servicio] = (serviciosIngresos[servicio] || 0) + precio;
    });

    const serviciosArray = Object.keys(serviciosCount).map(servicio => ({
        servicio,
        cantidad: serviciosCount[servicio],
        ingresos: serviciosIngresos[servicio]
    })).sort((a, b) => b.cantidad - a.cantidad);

    const maxCantidad = Math.max(...serviciosArray.map(s => s.cantidad));

    let html = '<div class="grafico-barras">';
    serviciosArray.forEach(item => {
        const porcentaje = (item.cantidad / maxCantidad) * 100;
        html += `
            <div class="barra-container">
                <div class="barra-label">
                    <span>${item.servicio}</span>
                    <span>${item.cantidad} turnos ($${item.ingresos.toLocaleString()})</span>
                </div>
                <div class="barra">
                    <div class="barra-progreso" data-servicio="${item.servicio}" style="width: 0%">
                        <span class="barra-progreso-texto">0</span>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    document.getElementById('graficoServicios').innerHTML = html;

    // Animar las barras después de un pequeño delay
    setTimeout(async () => {
        for (let i = 0; i < serviciosArray.length; i++) {
            const item = serviciosArray[i];
            const porcentaje = (item.cantidad / maxCantidad) * 100;
            const barraElement = document.querySelector(`[data-servicio="${item.servicio}"]`);
            
            if (barraElement) {
                await animator.animateBar(barraElement, porcentaje, 800);
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }, 300);
}

// 3. Horarios Pico con Animaciones
async function generarReporteHorarios(turnos) {
    const horariosCount = {
        "09:00": 0, "10:00": 0, "11:00": 0, "12:00": 0,
        "14:00": 0, "15:00": 0, "16:00": 0, "17:00": 0
    };

    turnos.forEach(turno => {
        if (horariosCount.hasOwnProperty(turno.hora)) {
            horariosCount[turno.hora]++;
        }
    });

    const maxHorarios = Math.max(...Object.values(horariosCount));

    let html = '<div class="grafico-barras">';
    Object.entries(horariosCount).forEach(([hora, cantidad]) => {
        const porcentaje = maxHorarios > 0 ? (cantidad / maxHorarios) * 100 : 0;
        html += `
            <div class="barra-container">
                <div class="barra-label">
                    <span>${hora} ${hora < '12:00' ? 'AM' : 'PM'}</span>
                    <span>${cantidad} turnos</span>
                </div>
                <div class="barra">
                    <div class="barra-progreso" data-hora="${hora}" style="width: 0%">
                        <span class="barra-progreso-texto">0</span>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    document.getElementById('graficoHorarios').innerHTML = html;

    // Animar las barras después de un pequeño delay
    setTimeout(async () => {
        const horariosEntries = Object.entries(horariosCount);
        for (let i = 0; i < horariosEntries.length; i++) {
            const [hora, cantidad] = horariosEntries[i];
            const porcentaje = maxHorarios > 0 ? (cantidad / maxHorarios) * 100 : 0;
            const barraElement = document.querySelector(`[data-hora="${hora}"]`);
            
            if (barraElement) {
                await animator.animateBar(barraElement, porcentaje, 600);
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    }, 300);
}

// 4. Clientes Frecuentes
function generarReporteClientesFrecuentes(turnos) {
    const clientesMap = {};

    turnos.forEach(turno => {
        const clienteId = turno.clienteId || turno.nombre;
        const clienteNombre = turno.clienteId ? 
            (clientes.find(c => c.id === turno.clienteId)?.nombre + ' ' + clientes.find(c => c.id === turno.clienteId)?.apellido) : 
            turno.nombre;
        
        if (!clientesMap[clienteId]) {
            clientesMap[clienteId] = {
                nombre: clienteNombre,
                visitas: 0,
                totalGastado: 0,
                ultimaVisita: ''
            };
        }

        const precio = preciosServicios[turno.servicio] || preciosServicios.otros;
        clientesMap[clienteId].visitas++;
        clientesMap[clienteId].totalGastado += precio;
        clientesMap[clienteId].ultimaVisita = turno.fecha;
    });

    const clientesArray = Object.values(clientesMap)
        .sort((a, b) => b.visitas - a.visitas)
        .slice(0, 10);

    let html = '';
    if (clientesArray.length === 0) {
        html = '<tr><td colspan="5" class="text-center">No hay datos para el período seleccionado</td></tr>';
    } else {
        clientesArray.forEach((cliente, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.visitas}</td>
                    <td>${formatearFechaCorta(cliente.ultimaVisita)}</td>
                    <td>$${cliente.totalGastado.toLocaleString()}</td>
                </tr>
            `;
        });
    }

    document.getElementById('tablaClientesFrecuentes').innerHTML = html;
}

// 5. Eficiencia del Personal (simulada)
function generarReporteEficiencia(turnos) {
    // Simulamos datos de peluqueros
    const peluqueros = [
        { id: 1, nombre: "María González", turnos: 0, ingresos: 0 },
        { id: 2, nombre: "Carlos Rodríguez", turnos: 0, ingresos: 0 },
        { id: 3, nombre: "Ana Martínez", turnos: 0, ingresos: 0 }
    ];

    // Distribuir turnos aleatoriamente entre peluqueros para el ejemplo
    turnos.forEach(turno => {
        const peluqueroIndex = Math.floor(Math.random() * peluqueros.length);
        const precio = preciosServicios[turno.servicio] || preciosServicios.otros;
        
        peluqueros[peluqueroIndex].turnos++;
        peluqueros[peluqueroIndex].ingresos += precio;
    });

    let html = '';
    peluqueros.forEach(peluquero => {
        const promedio = peluquero.turnos > 0 ? peluquero.ingresos / peluquero.turnos : 0;
        let eficiencia = 'Baja';
        let badgeClass = 'badge-warning';

        if (peluquero.turnos >= 10) {
            eficiencia = 'Alta';
            badgeClass = 'badge-success';
        } else if (peluquero.turnos >= 5) {
            eficiencia = 'Media';
            badgeClass = 'badge-info';
        }

        html += `
            <tr>
                <td>${peluquero.nombre}</td>
                <td>${peluquero.turnos}</td>
                <td>$${peluquero.ingresos.toLocaleString()}</td>
                <td>$${Math.round(promedio).toLocaleString()}</td>
                <td><span class="badge ${badgeClass}">${eficiencia}</span></td>
            </tr>
        `;
    });

    document.getElementById('tablaEficiencia').innerHTML = html;
}

// Función auxiliar para formatear fecha corta
function formatearFechaCorta(fecha) {
    if (!fecha) return '-';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES');
}

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
    
    // Actualizar horas disponibles en el formulario administrativo
    actualizarHorasDisponiblesAdmin();
    
    // Configurar fechas para reportes (hoy por defecto)
    document.getElementById('fechaInicio').value = hoy.toISOString().split('T')[0];
    document.getElementById('fechaFin').value = hoy.toISOString().split('T')[0];
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