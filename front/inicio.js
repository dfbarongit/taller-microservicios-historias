const API_URL = "http://127.0.0.1:8000";

// Referencias al DOM
const listaSprints = document.getElementById("listaSprints");
const tituloSprint = document.getElementById("tituloSprint");
const btnModificarSprint = document.getElementById("btnModificarSprint");
const btnEliminarSprint = document.getElementById("btnEliminarSprint");
const btnCrearHistoria = document.getElementById("btnCrearHistoria");
const dHistorias = document.getElementById("dHistorias");
const mensajeError = document.getElementById("mensajeError");

// Leer parámetros de la URL (equivalente a $_GET en PHP)
const params = new URLSearchParams(window.location.search);
let idSprintActual = params.get("id");

if (params.get("error")) {
  mensajeError.style.display = "block";
}

// Iniciar carga al abrir la página
document.addEventListener("DOMContentLoaded", inicializarVista);

async function inicializarVista() {
  try {
    // 1. Obtener todos los sprints
    const resSprints = await fetch(`${API_URL}/sprints`);
    if (!resSprints.ok) throw new Error(`Error HTTP: ${resSprints.status}`);

    const sprints = await resSprints.json();

    // Si no hay sprints registrados, redirigir como en tu PHP
    if (!Array.isArray(sprints) || sprints.length === 0) {
      window.location.href = "sprint_form.html?sinReg=1";
      return;
    }

    // Si no venía ?id= en la URL, tomar el primero de la lista
    if (!idSprintActual) {
      idSprintActual = sprints[0].id;
    }

    // 2. Buscar el sprint actual y construir el menú <nav>
    let sprintActual = null;
    listaSprints.innerHTML = "";

    sprints.forEach((spr, index) => {
      if (String(spr.id) === String(idSprintActual)) {
        sprintActual = spr;
      }

      const li = document.createElement("li");
      li.innerHTML = `<a href="inicio.html?id=${spr.id}">Sprint ${index + 1}: ${spr.nombre}</a>`;
      listaSprints.appendChild(li);
    });

    // Si el ID de la URL no existe en la base de datos, redirigir
    if (!sprintActual) {
      window.location.href = "sprint_form.html?sinReg=1";
      return;
    }

    // 3. Actualizar cabecera y botones del Sprint actual
    tituloSprint.textContent = sprintActual.nombre;
    btnModificarSprint.href = `sprint_form.html?id=${idSprintActual}`;
    btnCrearHistoria.href = `historia_form.html?idSprint=${idSprintActual}`;

    // Configurar botón eliminar (reemplaza a eliminar_sprint.php)
    btnEliminarSprint.onclick = () => eliminarSprint(idSprintActual);

    // 4. Cargar las historias de este sprint
    await cargarHistoriasDelSprint(idSprintActual);
  } catch (error) {
    console.error("Error al inicializar:", error);
    dHistorias.innerHTML = `<p>Error de conexión con el servidor: ${error.message}</p>`;
  }
}

async function cargarHistoriasDelSprint(idSprint) {
  try {
    // Consulta directa al endpoint filtrado por sprint_id en el backend
    const resHistorias = await fetch(
      `${API_URL}/sprints/${idSprint}/historias`,
    );

    if (!resHistorias.ok) {
      const errorData = await resHistorias.json().catch(() => ({}));
      throw new Error(errorData.error || `Error HTTP: ${resHistorias.status}`);
    }

    const historiasDelSprint = await resHistorias.json();

    if (!Array.isArray(historiasDelSprint) || historiasDelSprint.length === 0) {
      dHistorias.innerHTML =
        "<p>No hay historias registradas en este sprint.</p>";
      return;
    }

    let tablaHTML = `
            <table border="1" style="width: 100%; border-collapse: collapse; text-align: left; margin-top: 10px;">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Responsable</th>
                        <th>Estado</th>
                        <th>Puntos</th>
                        <th>Fecha Creación</th>
                        <th>Fecha Finalización</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

    historiasDelSprint.forEach((historia) => {
      tablaHTML += `
                <tr>
                    <td>${historia.id ?? ""}</td>
                    <td>${historia.titulo ?? ""}</td>
                    <td>${historia.descripcion ?? ""}</td>
                    <td>${historia.responsable ?? ""}</td>
                    <td>${historia.estado ?? ""}</td>
                    <td>${historia.puntos ?? ""}</td>
                    <td>${historia.fecha_creacion ?? ""}</td>
                    <td>${historia.fecha_finalizacion ?? ""}</td>
                    <td>
                        <a href="historia_form.html?idSprint=${historia.sprint_id}&id=${historia.id}">Modificar</a>
                        <button id="btnEliminarHistoria" onclick="eliminarHistoria(${historia.id})">Eliminar</button>
                    </td>
                </tr>
            `;
    });

    tablaHTML += `</tbody></table>`;
    dHistorias.innerHTML = tablaHTML;
  } catch (error) {
    console.error("Error al obtener las historias:", error);
    dHistorias.innerHTML = `<p>Error al cargar historias: ${error.message}</p>`;
  }
}

async function eliminarSprint(id) {
  if (!confirm("¿Estás seguro de eliminar este sprint?")) return;

  try {
    // Ajusta la ruta si tu endpoint de eliminación usa DELETE /sprints/{id}
    const res = await fetch(`${API_URL}/sprints/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("No se pudo eliminar el sprint");

    // Recargar la página sin el parámetro ?id= para que cargue el primer sprint disponible
    window.location.href = "inicio.html";
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}
async function eliminarHistoria(id) {
  if (!confirm("¿Estás seguro de eliminar esta historia?")) return;
  try {
    // Ajusta la ruta si tu endpoint de eliminación usa DELETE /sprints/{id}
    const res = await fetch(`${API_URL}/historias/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("No se pudo eliminar el sprint");

    // Recargar la página sin el parámetro ?id= para que cargue el primer sprint disponible
    window.location.href = "inicio.html";
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}
