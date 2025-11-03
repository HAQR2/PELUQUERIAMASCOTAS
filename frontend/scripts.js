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

// Simulación de envío de datos al backend Python
function enviarDatosAlBackend(datosTurno) {
    // En una implementación real, usaríamos fetch o axios para enviar los datos
    // al backend Python
    
    // Ejemplo con fetch:
    /*
    fetch('/api/turnos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosTurno)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Mostrar modal de confirmación
        document.getElementById('confirmationModal').style.display = 'block';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al enviar el formulario. Por favor, intente nuevamente.');
    });
    */
    
    // Por ahora, solo mostramos los datos en consola
    console.log('Datos del turno:', datosTurno);
}

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