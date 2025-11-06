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

// Horarios disponibles
const horariosDisponibles = [
    "09:00", "10:00", "11:00", "12:00", 
    "14:00", "15:00", "16:00", "17:00"
];

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
function actualizarHorasDisponibles() {
    const fechaSeleccionada = document.getElementById('fecha').value;
    const selectHora = document.getElementById('hora');
    
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

// Sistema de turnos
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
    
    // Verificar si la hora ya está ocupada
    const horasOcupadas = obtenerHorasOcupadas(fecha);
    if (horasOcupadas.includes(hora)) {
        alert('Lo sentimos, esa hora ya no está disponible. Por favor, seleccione otra hora.');
        return;
    }
    
    // Crear objeto de turno
    const turno = {
        id: Date.now(), // ID único basado en timestamp
        nombre: nombre,
        email: email,
        telefono: telefono,
        mascota: mascota,
        servicio: servicio,
        fecha: fecha,
        hora: hora,
        mensaje: document.getElementById('mensaje').value,
        tipo: 'publico', // Para identificar que viene del formulario público
        fechaCreacion: new Date().toISOString()
    };
    
    // Guardar turno en localStorage
    guardarTurno(turno);
    
    // Mostrar modal de confirmación
    document.getElementById('confirmationModal').style.display = 'block';
    
    // Limpiar formulario
    document.getElementById('turnoForm').reset();
    
    // Actualizar horas disponibles
    actualizarHorasDisponibles();
});

// Función para guardar turno en localStorage
function guardarTurno(turno) {
    // Obtener turnos existentes
    let turnos = JSON.parse(localStorage.getItem('turnosPublicos')) || [];
    
    // Agregar nuevo turno
    turnos.push(turno);
    
    // Guardar en localStorage
    localStorage.setItem('turnosPublicos', JSON.stringify(turnos));
    
    console.log('Turno guardado:', turno);
}

// Cerrar modal
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('confirmationModal').style.display = 'none';
});

document.getElementById('modalClose').addEventListener('click', function() {
    document.getElementById('confirmationModal').style.display = 'none';
});

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', function(e) {
    const modal = document.getElementById('confirmationModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Configurar fecha mínima como hoy
const today = new Date();
const formattedDate = today.toISOString().split('T')[0];
document.getElementById('fecha').min = formattedDate;

// Actualizar horas disponibles cuando cambia la fecha
document.getElementById('fecha').addEventListener('change', function() {
    actualizarHorasDisponibles();
});

// Inicializar horas disponibles al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarHorasDisponibles();
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