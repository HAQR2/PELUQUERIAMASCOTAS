      const API_URL = 'http://localhost:5000';

        // Inicializar fechas
        document.getElementById('consultaFecha').value = new Date().toISOString().split('T')[0];
        document.getElementById('turnoFecha').value = new Date().toISOString().split('T')[0];
        document.getElementById('consultaSemana').value = new Date().toISOString().split('T')[0];

        // Mostrar toast
        function mostrarToast(mensaje, tipo = 'success') {
            const toastEl = document.getElementById('toast');
            const toastBody = document.getElementById('toastMessage');
            toastBody.textContent = mensaje;
            
            const headerClass = tipo === 'success' ? 'bg-success text-white' : 'bg-danger text-white';
            toastEl.querySelector('.toast-header').className = `toast-header ${headerClass}`;
            
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }

        // CREAR CLIENTE
        document.getElementById('formCliente').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const datos = {
                nombre: document.getElementById('clienteNombre').value,
                apellido: document.getElementById('clienteApellido').value,
                telefono: document.getElementById('clienteTelefono').value,
                correo: document.getElementById('clienteCorreo').value
            };

            try {
                const response = await fetch(`${API_URL}/clientes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    mostrarToast('Cliente creado exitosamente!');
                    document.getElementById('formCliente').reset();
                    
                    // Mostrar formulario de mascota
                    document.getElementById('cardMascota').style.display = 'block';
                    document.getElementById('mascotaClienteId').value = result.cliente.id;
                    
                    // Actualizar lista de clientes
                    cargarClientesSelect();
                } else {
                    mostrarToast(result.error || 'Error al crear cliente', 'error');
                }
            } catch (error) {
                mostrarToast('Error de conexión', 'error');
            }
        });

        // AGREGAR MASCOTA
        document.getElementById('formMascota').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const clienteId = document.getElementById('mascotaClienteId').value;
            const datos = {
                nombre: document.getElementById('mascotaNombre').value,
                tipo: document.getElementById('mascotaTipo').value
            };

            try {
                const response = await fetch(`${API_URL}/clientes/${clienteId}/mascotas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    mostrarToast('Mascota agregada exitosamente!');
                    document.getElementById('formMascota').reset();
                    document.getElementById('cardMascota').style.display = 'none';
                } else {
                    mostrarToast(result.error || 'Error al agregar mascota', 'error');
                }
            } catch (error) {
                mostrarToast('Error de conexión', 'error');
            }
        });

        // BUSCAR CLIENTES
        async function buscarClientes() {
            const nombre = document.getElementById('buscarCliente').value;
            
            if (!nombre) {
                mostrarToast('Ingrese un nombre para buscar', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/clientes/buscar?nombre=${encodeURIComponent(nombre)}`);
                const clientes = await response.json();
                
                const lista = document.getElementById('listaClientes');
                
                if (clientes.length === 0) {
                    lista.innerHTML = '<div class="alert alert-info">No se encontraron clientes</div>';
                } else {
                    lista.innerHTML = clientes.map(cliente => `
                        <div class="card mb-2">
                            <div class="card-body">
                                <h5>${cliente.nombre} ${cliente.apellido}</h5>
                                <p class="mb-1"><i class="bi bi-telephone"></i> ${cliente.telefono}</p>
                                <p class="mb-1"><i class="bi bi-envelope"></i> ${cliente.correo}</p>
                                ${cliente.mascotas.length > 0 ? `
                                    <p class="mb-0"><strong>Mascotas:</strong> ${cliente.mascotas.map(m => m.nombre).join(', ')}</p>
                                ` : ''}
                                <button class="btn btn-sm btn-danger mt-2" onclick="eliminarCliente(${cliente.id})">
                                    <i class="bi bi-trash"></i> Eliminar
                                </button>

</button>
                            </div>
                        </div>
                    `).join('');
                }
            } catch (error) {
                mostrarToast('Error al buscar clientes', 'error');
            }
        }

        // ELIMINAR CLIENTE
        async function eliminarCliente(id) {
            if (!confirm('¿Está seguro de eliminar este cliente? Se eliminarán también sus mascotas y turnos.')) {
                return;
            }

            try {
                const response = await fetch(`${API_URL}/clientes/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    mostrarToast('Cliente eliminado exitosamente');
                    buscarClientes();
                } else {
                    mostrarToast('Error al eliminar cliente', 'error');
                }
            } catch (error) {
                mostrarToast('Error de conexión', 'error');
            }
        }

        // CARGAR CLIENTES EN SELECT
        async function cargarClientesSelect() {
            try {
                const response = await fetch(`${API_URL}/clientes`);
                const clientes = await response.json();
                
                const select = document.getElementById('turnoClienteId');
                select.innerHTML = '<option value="">Seleccione un cliente...</option>' +
                    clientes.map(c => `<option value="${c.id}">${c.nombre} ${c.apellido}</option>`).join('');
            } catch (error) {
                console.error('Error al cargar clientes:', error);
            }
        }

        // CARGAR MASCOTAS DEL CLIENTE
        async function cargarMascotasCliente() {
            const clienteId = document.getElementById('turnoClienteId').value;
            
            if (!clienteId) {
                document.getElementById('turnoMascotaId').innerHTML = '<option value="">Seleccione una mascota...</option>';
                return;
            }

            try {
                const response = await fetch(`${API_URL}/clientes/${clienteId}`);
                const cliente = await response.json();
                
                const select = document.getElementById('turnoMascotaId');
                select.innerHTML = '<option value="">Seleccione una mascota...</option>' +
                    cliente.mascotas.map(m => `<option value="${m.id}">${m.nombre} (${m.tipo})</option>`).join('');
            } catch (error) {
                console.error('Error al cargar mascotas');
            }
        }

        // AGENDAR TURNO
        document.getElementById('formTurno').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const datos = {
                cliente_id: parseInt(document.getElementById('turnoClienteId').value),
                mascota_id: parseInt(document.getElementById('turnoMascotaId').value) || null,
                fecha: document.getElementById('turnoFecha').value,
                hora: document.getElementById('turnoHora').value
            };

            try {
                const response = await fetch(`${API_URL}/turnos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    mostrarToast('Turno agendado exitosamente!');
                    document.getElementById('formTurno').reset();
                    cargarTurnosDia();
                } else {
                    mostrarToast(result.error || 'Error al agendar turno', 'error');
                }
            } catch (error) {
                mostrarToast('Error de conexión', 'error');
            }
        });

        // CARGAR TURNOS DEL DÍA
        async function cargarTurnosDia() {
            const fecha = document.getElementById('consultaFecha').value;
            const loading = document.getElementById('loadingTurnos');
            const lista = document.getElementById('listaTurnos');
            
            loading.style.display = 'block';
            lista.innerHTML = '';

            try {
                const response = await fetch(`${API_URL}/turnos/dia/${fecha}`);
                const turnos = await response.json();
                
                loading.style.display = 'none';
                
                if (turnos.length === 0) {
                    lista.innerHTML = '<div class="alert alert-info">No hay turnos para este día</div>';
                } else {
                    lista.innerHTML = turnos.map(turno => `
                        <div class="turno-item">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5><i class="bi bi-clock"></i> ${turno.hora}</h5>
                                    <p class="mb-1"><strong>${turno.cliente_nombre}</strong></p>
                                    <p class="mb-1"><i class="bi bi-heart"></i> ${turno.cliente_mascota}</p>
                                    <p class="mb-1"><i class="bi bi-telephone"></i> ${turno.numero}</p>
                                    <p class="mb-0"><i class="bi bi-envelope"></i> ${turno.correo}</p>
                                </div>
                                <button class="btn btn-sm btn-danger" onclick="cancelarTurno(${turno.id})">
                                    <i class="bi bi-x-circle"></i>
                                </button>
                            </div>
                        </div>
                    `).join('');
                }
            } catch (error) {
                loading.style.display = 'none';
                mostrarToast('Error al cargar turnos', 'error');
            }
        }

        // CARGAR TURNOS DE LA SEMANA
        async function cargarTurnosSemana() {
            const fecha = document.getElementById('consultaSemana').value;
            const loading = document.getElementById('loadingSemana');
            const lista = document.getElementById('listaTurnosSemana');
            
            loading.style.display = 'block';
            lista.innerHTML = '';

            try {
                const response = await fetch(`${API_URL}/turnos/semana?fecha_inicio=${fecha}`);
                const turnos = await response.json();
                
                loading.style.display = 'none';
                
                if (turnos.length === 0) {
                    lista.innerHTML = '<div class="alert alert-info">No hay turnos para esta semana</div>';
                } else {
                    // Agrupar por día
                    const turnosPorDia = {};
                    turnos.forEach(turno => {
                        if (!turnosPorDia[turno.dia]) {
                            turnosPorDia[turno.dia] = [];
                        }
                        turnosPorDia[turno.dia].push(turno);
                    });

                    lista.innerHTML = Object.keys(turnosPorDia).map(dia => `
                        <div class="card mb-3">
                            <div class="card-header">
                                <strong>${new Date(dia + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                            </div>
                            <div class="card-body">
                                ${turnosPorDia[dia].map(turno => `
                                    <div class="turno-item">
                                        <strong>${turno.hora}</strong> - ${turno.cliente_nombre} - ${turno.cliente_mascota}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('');
                }
            } catch (error) {
                loading.style.display = 'none';
                mostrarToast('Error al cargar turnos', 'error');
            }
        }

        // CANCELAR TURNO
        async function cancelarTurno(id) {
            if (!confirm('¿Está seguro de cancelar este turno?')) {
                return;
            }

            try {
                const response = await fetch(`${API_URL}/turnos/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    mostrarToast('Turno cancelado exitosamente');
                    cargarTurnosDia();
                } else {
                    mostrarToast('Error al cancelar turno', 'error');
                }
            } catch (error) {
                mostrarToast('Error de conexión', 'error');
            }
        }

        // Cargar datos iniciales
        cargarClientesSelect();
        cargarTurnosDia();

        const form = document.getElementById("formCliente");
const tabla = document.getElementById("tablaClientes");
const buscar = document.getElementById("buscarCliente");
const cancelarBtn = document.getElementById("cancelarEdicion");

// ========== CARGAR CLIENTES ==========
async function cargarClientes(filtro = "") {
  let url = filtro ? `${API_CLIENTES}/buscar?nombre=${filtro}` : API_CLIENTES;
  const res = await fetch(url);
  const clientes = await res.json();

  tabla.innerHTML = "";
  if (!clientes.length) {
    tabla.innerHTML = `<tr><td colspan="8" class="text-center">No hay clientes</td></tr>`;
    return;
  }

  clientes.forEach(c => {
    let mascota = c.mascotas[0] ? c.mascotas[0].nombre : "-";
    let tipo = c.mascotas[0] ? c.mascotas[0].tipo : "-";

    tabla.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.nombre}</td>
        <td>${c.apellido}</td>
        <td>${c.telefono}</td>
        <td>${c.correo}</td>
        <td>${mascota}</td>
        <td>${tipo}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editarCliente(${c.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarCliente(${c.id})">Eliminar</button>
        </td>
      </tr>`;
  });
}

// ========== EDITAR CLIENTE ==========
async function editarCliente(id) {
  const res = await fetch(`${API_CLIENTES}/${id}`);
  const cliente = await res.json();

  document.getElementById("clienteId").value = cliente.id;
  document.getElementById("nombre").value = cliente.nombre;
  document.getElementById("apellido").value = cliente.apellido;
  document.getElementById("telefono").value = cliente.telefono;
  document.getElementById("correo").value = cliente.correo;

  if (cliente.mascotas.length) {
    document.getElementById("mascotaNombre").value = cliente.mascotas[0].nombre;
    document.getElementById("mascotaTipo").value = cliente.mascotas[0].tipo;
  } else {
    document.getElementById("mascotaNombre").value = "";
    document.getElementById("mascotaTipo").value = "";
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ========== GUARDAR CLIENTE ==========
form.addEventListener("submit", async e => {
  e.preventDefault();
  const id = document.getElementById("clienteId").value;

  const clienteData = {
    nombre: document.getElementById("nombre").value.trim(),
    apellido: document.getElementById("apellido").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    correo: document.getElementById("correo").value.trim()
  };

  const mascotaData = {
    nombre: document.getElementById("mascotaNombre").value.trim(),
    tipo: document.getElementById("mascotaTipo").value.trim()
  };

  try {
    if (id) {
      // Actualizar cliente
      const res = await fetch(`${API_CLIENTES}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteData)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      // Si hay mascota, actualizar o crear
      if (mascotaData.nombre && mascotaData.tipo) {
        await fetch(`${API_CLIENTES}/${id}/mascotas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mascotaData)
        });
      }

      alert("Cliente actualizado");
    } else {
      // Crear cliente nuevo
      const res = await fetch(API_CLIENTES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteData)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      const clienteId = result.cliente.id;
      if (mascotaData.nombre && mascotaData.tipo) {
        await fetch(`${API_CLIENTES}/${clienteId}/mascotas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mascotaData)
        });
      }

      alert("Cliente creado con éxito");
    }

    form.reset();
    document.getElementById("clienteId").value = "";
    cargarClientes();
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// ========== ELIMINAR CLIENTE ==========
async function eliminarCliente(id) {
  if (!confirm("¿Eliminar cliente y su mascota?")) return;
  const res = await fetch(`${API_CLIENTES}/${id}`, { method: "DELETE" });
  const result = await res.json();
  if (!res.ok) {
    alert(result.error);
    return;
  }
  alert(result.mensaje);
  cargarClientes();
}

// ========== CANCELAR EDICIÓN ==========
cancelarBtn.addEventListener("click", () => {
  form.reset();
  document.getElementById("clienteId").value = "";
});

// ========== BUSCAR ==========
buscar.addEventListener("input", e => cargarClientes(e.target.value.trim()));

// ========== INICIO ==========
document.addEventListener("DOMContentLoaded", cargarClientes);
