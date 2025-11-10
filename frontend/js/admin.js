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

// ================= CONFIGURACIÓN API =================
const API_BASE_URL = 'http://localhost:5000';

// ================= FUNCIONES API =================

// Clientes
async function apiObtenerClientes() {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        if (!response.ok) throw new Error('Error al obtener clientes');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al cargar clientes');
        return [];
    }
}

async function apiCrearCliente(clienteData) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clienteData)
        });
        if (!response.ok) throw new Error('Error al crear cliente');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function apiActualizarCliente(id, clienteData) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clienteData)
        });
        if (!response.ok) throw new Error('Error al actualizar cliente');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function apiEliminarCliente(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar cliente');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Turnos
async function apiCrearTurno(turnoData) {
    try {
        const response = await fetch(`${API_BASE_URL}/turnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(turnoData)
        });
        if (!response.ok) throw new Error('Error al crear turno');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function apiObtenerTurnosDia(fecha) {
    try {
        const response = await fetch(`${API_BASE_URL}/turnos/dia/${fecha}`);
        if (!response.ok) throw new Error('Error al obtener turnos');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function apiObtenerTurnosSemana(fechaInicio) {
    try {
        const response = await fetch(`${API_BASE_URL}/turnos/semana?fecha_inicio=${fechaInicio}`);
        if (!response.ok) throw new Error('Error al obtener turnos de la semana');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function apiEliminarTurno(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/turnos/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar turno');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Mascotas
async function apiAgregarMascota(clienteId, mascotaData) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${clienteId}/mascotas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mascotaData)
        });
        if (!response.ok) throw new Error('Error al agregar mascota');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

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

// Datos de ejemplo para clientes y turnos (se usarán solo si la API no está disponible)
let clientes = [];
let turnosAdmin = [];

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
async function obtenerHorasOcupadas(fecha) {
    try {
        const turnos = await apiObtenerTurnosDia(fecha);
        return turnos.map(turno => turno.hora.substring(0, 5)); // Formato HH:MM
    } catch (error) {
        console.error('Error al obtener horas ocupadas:', error);
        return [];
    }
}

// Función para actualizar las horas disponibles en el select
async function actualizarHorasDisponiblesAdmin() {
    const fechaSeleccionada = document.getElementById('turnoFecha').value;
    const selectHora = document.getElementById('turnoHora');
    
    // Limpiar el select
    selectHora.innerHTML = '<option value="">Seleccione una hora</option>';
    
    if (!fechaSeleccionada) return;
    
    try {
        // Obtener horas ocupadas para la fecha seleccionada
        const horasOcupadas = await obtenerHorasOcupadas(fechaSeleccionada);
        
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
    } catch (error) {
        console.error('Error al actualizar horas disponibles:', error);
    }
}

// Formulario de cliente
document.getElementById('formCliente').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const clienteId = document.getElementById('clienteId').value;
    const clienteData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value
    };
    
    try {
        if (clienteId) {
            // Editar cliente existente
            await apiActualizarCliente(clienteId, clienteData);
            mostrarMensaje('Cliente actualizado exitosamente');
        } else {
            // Crear nuevo cliente
            const nuevoCliente = await apiCrearCliente(clienteData);
            
            // Si se proporcionó una mascota, agregarla
            const mascotaNombre = document.getElementById('mascotaNombre').value;
            const mascotaTipo = document.getElementById('mascotaTipo').value;
            
            if (mascotaNombre && mascotaTipo) {
                await apiAgregarMascota(nuevoCliente.cliente.id, {
                    nombre: mascotaNombre,
                    tipo: mascotaTipo
                });
            }
            
            mostrarMensaje('Cliente guardado exitosamente');
        }
        
        this.reset();
        document.getElementById('clienteId').value = '';
        document.getElementById('cancelarEdicion').style.display = 'none';
        await cargarTablaClientes();
        await actualizarSelectClientes();
        
    } catch (error) {
        mostrarMensaje('Error: ' + error.message);
    }
});

// Cancelar edición
document.getElementById('cancelarEdicion').addEventListener('click', function() {
    document.getElementById('formCliente').reset();
    document.getElementById('clienteId').value = '';
    this.style.display = 'none';
});

// Formulario de turno (administración)
document.getElementById('formTurnoAdmin').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const clienteId = parseInt(document.getElementById('turnoClienteId').value);
    const mascotaId = parseInt(document.getElementById('turnoMascotaId').value);
    const servicio = document.getElementById('turnoServicio').value;
    const fecha = document.getElementById('turnoFecha').value;
    const hora = document.getElementById('turnoHora').value;
    
    if (!clienteId || !mascotaId || !servicio || !fecha || !hora) {
        mostrarMensaje('Por favor, complete todos los campos obligatorios');
        return;
    }
    
    try {
        // Verificar si la hora ya está ocupada
        const horasOcupadas = await obtenerHorasOcupadas(fecha);
        if (horasOcupadas.includes(hora)) {
            mostrarMensaje('Lo sentimos, esa hora ya está ocupada. Por favor, elija otra.');
            return;
        }
        
        const turnoData = {
            cliente_id: clienteId,
            fecha: fecha,
            hora: hora,
            mascota_id: mascotaId
        };
        
        await apiCrearTurno(turnoData);
        this.reset();
        mostrarMensaje('Turno agendado exitosamente');
        await cargarTurnosDia();
        await cargarTurnosSemana();
    } catch (error) {
        mostrarMensaje('Error: ' + error.message);
    }
});

// Funciones auxiliares
async function cargarTablaClientes() {
    const tablaClientes = document.getElementById('tablaClientes');
    
    try {
        clientes = await apiObtenerClientes();
        
        if (clientes.length === 0) {
            tablaClientes.innerHTML = '<tr><td colspan="8" class="text-center">No hay clientes registrados</td></tr>';
            return;
        }
        
        tablaClientes.innerHTML = '';
        clientes.forEach(cliente => {
            const fila = document.createElement('tr');
            const primeraMascota = cliente.mascotas && cliente.mascotas.length > 0 ? cliente.mascotas[0] : null;
            
            fila.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.correo}</td>
                <td>${primeraMascota ? primeraMascota.nombre : '-'}</td>
                <td>${primeraMascota ? primeraMascota.tipo : '-'}</td>
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
    } catch (error) {
        tablaClientes.innerHTML = '<tr><td colspan="8" class="text-center error">Error al cargar clientes</td></tr>';
    }
}

async function editarCliente(id) {
    try {
        const cliente = clientes.find(c => c.id === id);
        if (!cliente) {
            // Si no está en cache, buscar en la API
            const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
            if (!response.ok) throw new Error('Cliente no encontrado');
            cliente = await response.json();
        }
        
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
    } catch (error) {
        mostrarMensaje('Error: ' + error.message);
    }
}

async function eliminarCliente(id) {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
        try {
            await apiEliminarCliente(id);
            mostrarMensaje('Cliente eliminado exitosamente');
            await cargarTablaClientes();
            await actualizarSelectClientes();
        } catch (error) {
            mostrarMensaje('Error: ' + error.message);
        }
    }
}

async function cargarMascotasCliente() {
    const clienteId = parseInt(document.getElementById('turnoClienteId').value);
    const cliente = clientes.find(c => c.id === clienteId);
    const selectMascota = document.getElementById('turnoMascotaId');
    
    selectMascota.innerHTML = '<option value="">Seleccione una mascota...</option>';
    
    if (cliente && cliente.mascotas && cliente.mascotas.length > 0) {
        cliente.mascotas.forEach(mascota => {
            const option = document.createElement('option');
            option.value = mascota.id;
            option.textContent = `${mascota.nombre} (${mascota.tipo})`;
            selectMascota.appendChild(option);
        });
    }
}

async function cargarTurnosDia() {
    const fecha = document.getElementById('consultaFecha').value || new Date().toISOString().split('T')[0];
    const listaTurnos = document.getElementById('listaTurnosAdmin');
    
    try {
        const turnos = await apiObtenerTurnosDia(fecha);
        
        if (turnos.length === 0) {
            listaTurnos.innerHTML = '<div class="turno-item">No hay turnos para esta fecha</div>';
            return;
        }
        
        listaTurnos.innerHTML = '';
        turnos.forEach(turno => {
            const turnoElement = document.createElement('div');
            turnoElement.className = 'turno-item';
            turnoElement.innerHTML = `
                <div class="turno-info">
                    <div class="turno-header">
                        <strong>${turno.cliente_nombre}</strong>
                        <span class="turno-hora">${turno.hora}</span>
                    </div>
                    <p><i class="fas fa-paw"></i> ${turno.cliente_mascota}</p>
                    <p class="turno-contacto">
                        <i class="fas fa-phone"></i> ${turno.numero} 
                        | <i class="fas fa-envelope"></i> ${turno.correo}
                    </p>
                </div>
                <div class="turno-actions">
                    <button class="action-btn btn-edit" onclick="editarTurnoDesdeLista(${turno.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="action-btn btn-delete" onclick="eliminarTurno(${turno.id})">
                        <i class="fas fa-trash"></i> Cancelar
                    </button>
                </div>
            `;
            
            listaTurnos.appendChild(turnoElement);
        });
    } catch (error) {
        listaTurnos.innerHTML = '<div class="turno-item error">Error al cargar turnos</div>';
    }
}

async function cargarTurnosSemana() {
    const fechaSeleccionada = document.getElementById('consultaSemana').value || new Date().toISOString().split('T')[0];
    const listaTurnos = document.getElementById('listaTurnosSemana');
    
    try {
        const turnos = await apiObtenerTurnosSemana(fechaSeleccionada);
        
        if (turnos.length === 0) {
            listaTurnos.innerHTML = '<div class="turno-item">No hay turnos para esta semana</div>';
            return;
        }
        
        // Agrupar turnos por fecha
        const turnosPorFecha = {};
        turnos.forEach(turno => {
            if (!turnosPorFecha[turno.dia]) {
                turnosPorFecha[turno.dia] = [];
            }
            turnosPorFecha[turno.dia].push(turno);
        });
        
        listaTurnos.innerHTML = '';
        
        // Mostrar turnos agrupados por fecha
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
            
            // Ordenar turnos por hora
            turnosDelDia.sort((a, b) => a.hora.localeCompare(b.hora));
            
            turnosDelDia.forEach(turno => {
                const turnoElement = document.createElement('div');
                turnoElement.className = 'turno-item';
                turnoElement.innerHTML = `
                    <div class="turno-info">
                        <div class="turno-header">
                            <strong>${turno.cliente_nombre}</strong>
                            <span class="turno-hora">${turno.hora}</span>
                        </div>
                        <p><i class="fas fa-paw"></i> ${turno.cliente_mascota}</p>
                        <p class="turno-contacto">
                            <i class="fas fa-phone"></i> ${turno.numero} 
                            | <i class="fas fa-envelope"></i> ${turno.correo}
                        </p>
                    </div>
                    <div class="turno-actions">
                        <button class="action-btn btn-edit" onclick="editarTurnoDesdeLista(${turno.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="action-btn btn-delete" onclick="eliminarTurno(${turno.id})">
                            <i class="fas fa-trash"></i> Cancelar
                        </button>
                    </div>
                `;
                
                listaTurnos.appendChild(turnoElement);
            });
        });
    } catch (error) {
        listaTurnos.innerHTML = '<div class="turno-item error">Error al cargar turnos de la semana</div>';
    }
}

async function eliminarTurno(id) {
    if (confirm('¿Está seguro de que desea cancelar este turno?')) {
        try {
            await apiEliminarTurno(id);
            mostrarMensaje('Turno cancelado exitosamente');
            await cargarTurnosDia();
            await cargarTurnosSemana();
        } catch (error) {
            mostrarMensaje('Error: ' + error.message);
        }
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
    // Crear un elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff7a5a;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.textContent = mensaje;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

async function actualizarSelectClientes() {
    const selectCliente = document.getElementById('turnoClienteId');
    selectCliente.innerHTML = '<option value="">Seleccione un cliente...</option>';
    
    try {
        const clientesData = await apiObtenerClientes();
        clientesData.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = `${cliente.nombre} ${cliente.apellido}`;
            selectCliente.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar clientes en select:', error);
    }
}

// Búsqueda de clientes
document.getElementById('buscarCliente').addEventListener('input', async function() {
    const busqueda = this.value.toLowerCase();
    
    if (busqueda === '') {
        await cargarTablaClientes();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/buscar?nombre=${encodeURIComponent(busqueda)}`);
        if (!response.ok) throw new Error('Error en búsqueda');
        
        const clientesFiltrados = await response.json();
        const tablaClientes = document.getElementById('tablaClientes');
        
        tablaClientes.innerHTML = '';
        
        if (clientesFiltrados.length === 0) {
            tablaClientes.innerHTML = '<tr><td colspan="8" class="text-center">No se encontraron clientes</td></tr>';
            return;
        }
        
        clientesFiltrados.forEach(cliente => {
            const fila = document.createElement('tr');
            const primeraMascota = cliente.mascotas && cliente.mascotas.length > 0 ? cliente.mascotas[0] : null;
            
            fila.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.correo}</td>
                <td>${primeraMascota ? primeraMascota.nombre : '-'}</td>
                <td>${primeraMascota ? primeraMascota.tipo : '-'}</td>
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
    } catch (error) {
        console.error('Error en búsqueda:', error);
    }
});

// ================= SISTEMA DE EDICIÓN DE TURNOS =================

// Funciones para editar turnos
async function editarTurnoDesdeLista(turnoId) {
    try {
        // Obtener información del turno
        const turnosDia = await apiObtenerTurnosDia(new Date().toISOString().split('T')[0]);
        const turno = turnosDia.find(t => t.id === turnoId);
        
        if (!turno) {
            mostrarMensaje('Turno no encontrado');
            return;
        }
        
        // Llenar el formulario de edición con los datos del turno
        document.getElementById('turnoEditId').value = turno.id;
        
        // Buscar el cliente para obtener más información
        const clienteResponse = await fetch(`${API_BASE_URL}/clientes`);
        const clientes = await clienteResponse.json();
        const cliente = clientes.find(c => 
            `${c.nombre} ${c.apellido}` === turno.cliente_nombre
        );
        
        if (cliente) {
            document.getElementById('turnoEditNombre').value = cliente.nombre;
            document.getElementById('turnoEditApellido').value = cliente.apellido;
            document.getElementById('turnoEditTelefono').value = cliente.telefono;
            document.getElementById('turnoEditCorreo').value = cliente.correo;
            
            // Buscar la mascota
            const mascota = cliente.mascotas.find(m => m.nombre === turno.cliente_mascota);
            if (mascota) {
                document.getElementById('turnoEditMascotaNombre').value = mascota.nombre;
                document.getElementById('turnoEditMascotaTipo').value = mascota.tipo;
            }
        }
        
        document.getElementById('turnoEditFecha').value = turno.dia;
        document.getElementById('turnoEditHora').value = turno.hora;
        
        // Actualizar horas disponibles para la fecha seleccionada
        await actualizarHorasDisponiblesEdicion(turno.dia, turno.hora);
        
        // Mostrar el modal
        document.getElementById('modalEditarTurno').style.display = 'block';
    } catch (error) {
        mostrarMensaje('Error al cargar datos del turno: ' + error.message);
    }
}

async function actualizarHorasDisponiblesEdicion(fecha, horaActual) {
    const selectHora = document.getElementById('turnoEditHora');
    
    // Limpiar el select
    selectHora.innerHTML = '<option value="">Seleccione una hora</option>';
    
    if (!fecha) return;
    
    try {
        // Obtener horas ocupadas para la fecha seleccionada
        const horasOcupadas = await obtenerHorasOcupadas(fecha);
        
        // Agregar opciones de horas disponibles
        horariosDisponibles.forEach(hora => {
            const option = document.createElement('option');
            option.value = hora;
            option.textContent = `${hora} ${hora < '12:00' ? 'AM' : 'PM'}`;
            
            // Marcar como seleccionada la hora actual
            if (hora === horaActual.substring(0, 5)) {
                option.selected = true;
            }
            
            // Deshabilitar opción si la hora está ocupada y no es la hora actual
            if (horasOcupadas.includes(hora) && hora !== horaActual.substring(0, 5)) {
                option.disabled = true;
                option.textContent += ' (No disponible)';
            }
            
            selectHora.appendChild(option);
        });
    } catch (error) {
        console.error('Error al actualizar horas disponibles:', error);
    }
}

// Formulario de edición de turno
document.getElementById('formEditarTurno').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const turnoId = document.getElementById('turnoEditId').value;
    const fecha = document.getElementById('turnoEditFecha').value;
    const hora = document.getElementById('turnoEditHora').value;
    
    if (!fecha || !hora) {
        mostrarMensaje('Por favor, complete todos los campos obligatorios');
        return;
    }
    
    try {
        // Primero eliminar el turno existente
        await apiEliminarTurno(turnoId);
        
        // Verificar si la nueva hora está disponible
        const horasOcupadas = await obtenerHorasOcupadas(fecha);
        if (horasOcupadas.includes(hora)) {
            mostrarMensaje('Lo sentimos, esa hora ya está ocupada. Por favor, elija otra.');
            return;
        }
        
        // Obtener datos del cliente para recrear el turno
        const nombre = document.getElementById('turnoEditNombre').value;
        const apellido = document.getElementById('turnoEditApellido').value;
        
        // Buscar el cliente
        const clientes = await apiObtenerClientes();
        const cliente = clientes.find(c => 
            c.nombre === nombre && c.apellido === apellido
        );
        
        if (!cliente) {
            mostrarMensaje('Cliente no encontrado');
            return;
        }
        
        // Buscar la mascota
        const mascotaNombre = document.getElementById('turnoEditMascotaNombre').value;
        const mascota = cliente.mascotas.find(m => m.nombre === mascotaNombre);
        
        if (!mascota) {
            mostrarMensaje('Mascota no encontrada');
            return;
        }
        
        // Crear nuevo turno con los datos actualizados
        const turnoData = {
            cliente_id: cliente.id,
            fecha: fecha,
            hora: hora + ':00',
            mascota_id: mascota.id
        };
        
        await apiCrearTurno(turnoData);
        
        // Cerrar modal de edición
        document.getElementById('modalEditarTurno').style.display = 'none';
        
        // Mostrar modal de confirmación
        document.getElementById('modalConfirmacion').style.display = 'block';
        
        // Actualizar las listas de turnos
        await cargarTurnosDia();
        await cargarTurnosSemana();
        
    } catch (error) {
        mostrarMensaje('Error: ' + error.message);
    }
});

// Actualizar horas disponibles cuando cambia la fecha en el formulario de edición
document.getElementById('turnoEditFecha').addEventListener('change', async function() {
    const horaActual = document.getElementById('turnoEditHora').value;
    await actualizarHorasDisponiblesEdicion(this.value, horaActual);
});

// Funciones para cerrar modales
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        document.getElementById('modalEditarTurno').style.display = 'none';
        document.getElementById('modalConfirmacion').style.display = 'none';
    });
});

document.getElementById('cancelarEdicionTurno').addEventListener('click', function() {
    document.getElementById('modalEditarTurno').style.display = 'none';
});

document.getElementById('modalConfirmClose').addEventListener('click', function() {
    document.getElementById('modalConfirmacion').style.display = 'none';
});

// Cerrar modales al hacer clic fuera de ellos
window.addEventListener('click', function(e) {
    const modalEditar = document.getElementById('modalEditarTurno');
    const modalConfirm = document.getElementById('modalConfirmacion');
    
    if (e.target === modalEditar) {
        modalEditar.style.display = 'none';
    }
    if (e.target === modalConfirm) {
        modalConfirm.style.display = 'none';
    }
});

// ================= SISTEMA DE REPORTES =================

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
    // Para implementar reportes completos, necesitarías endpoints adicionales en tu API Flask
    mostrarMensaje('Funcionalidad de reportes en desarrollo. Se necesitan endpoints adicionales en la API.');
}

// ================= INICIALIZACIÓN =================

document.addEventListener('DOMContentLoaded', async function() {
    await cargarTablaClientes();
    await actualizarSelectClientes();
    await cargarTurnosDia();
    await cargarTurnosSemana();
    
    // Configurar fecha mínima para los inputs de fecha
    const fechaInputs = document.querySelectorAll('input[type="date"]');
    fechaInputs.forEach(input => {
        input.min = new Date().toISOString().split('T')[0];
        if (!input.value) {
            input.value = new Date().toISOString().split('T')[0];
        }
    });
    
    // Configurar fecha de la semana (hoy por defecto)
    const hoy = new Date();
    document.getElementById('consultaSemana').value = hoy.toISOString().split('T')[0];
    
    // Actualizar horas disponibles en el formulario administrativo
    document.getElementById('turnoFecha').addEventListener('change', function() {
        actualizarHorasDisponiblesAdmin();
    });
    
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