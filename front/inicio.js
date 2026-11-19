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
    mensajeError.hidden = false;
}

// Escapa texto antes de meterlo en innerHTML (equivalente a htmlspecialchars)
function esc(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
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

        // 2. Buscar el sprint actual y construir el menú lateral
        let sprintActual = null;
        listaSprints.innerHTML = "";

        sprints.forEach((spr, index) => {
            const esActual = String(spr.id) === String(idSprintActual);
            if (esActual) {
                sprintActual = spr;
            }

            const li = document.createElement("li");
            li.innerHTML = `<a class="${esActual ? "active" : ""}" href="inicio.html?id=${encodeURIComponent(spr.id)}">Sprint ${index + 1}: ${esc(spr.nombre)}</a>`;
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
        dHistorias.innerHTML = `<p class="empty-state error-message">Error de conexión con el servidor: ${esc(error.message)}</p>`;
    }
}

async function cargarHistoriasDelSprint(idSprint) {
    try {
        // Consulta directa al endpoint filtrado por sprint_id en el backend
        const resHistorias = await fetch(`${API_URL}/sprints/${idSprint}/historias`);

        if (!resHistorias.ok) {
            const errorData = await resHistorias.json().catch(() => ({}));
            throw new Error(errorData.error || `Error HTTP: ${resHistorias.status}`);
        }

        const historiasDelSprint = await resHistorias.json();

        if (!Array.isArray(historiasDelSprint) || historiasDelSprint.length === 0) {
            dHistorias.innerHTML = `<p class="empty-state">No hay historias registradas en este sprint.</p>`;
            return;
        }

        let tarjetasHTML = "";

        historiasDelSprint.forEach((historia) => {
            const estado = historia.estado ?? "";
            const estadoHTML = String(estado).toLowerCase().includes("impedimento")
                ? `<span class="impedimento">${esc(estado)}</span>`
                : esc(estado);

            tarjetasHTML += `
                <article class="story-card">
                    <h3>${esc(historia.titulo)}</h3>
                    <p>${esc(historia.descripcion)}</p>
                    <div class="story-meta">
                        <span class="story-info"><strong>ID:</strong> ${esc(historia.id)}</span>
                        <span class="story-info"><strong>Responsable:</strong> ${esc(historia.responsable)}</span>
                        <span class="story-info"><strong>Estado:</strong> ${estadoHTML}</span>
                        <span class="story-info"><strong>Puntos:</strong> ${esc(historia.puntos)}</span>
                        <span class="story-info"><strong>Creación:</strong> ${esc(historia.fecha_creacion)}</span>
                        <span class="story-info"><strong>Finalización:</strong> ${esc(historia.fecha_finalizacion)}</span>
                    </div>
                    <a class="button" href="historia_form.html?idSprint=${encodeURIComponent(historia.sprint_id)}&id=${encodeURIComponent(historia.id)}">Modificar</a>
                </article>
            `;
        });

        dHistorias.innerHTML = tarjetasHTML;

    } catch (error) {
        console.error("Error al obtener las historias:", error);
        dHistorias.innerHTML = `<p class="empty-state error-message">Error al cargar historias: ${esc(error.message)}</p>`;
    }
}

async function eliminarSprint(id) {
    if (!confirm("¿Estás seguro de eliminar este sprint?")) return;

    try {
        // Ajusta la ruta si tu endpoint de eliminación usa DELETE /sprints/{id}
        const res = await fetch(`${API_URL}/sprints/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error("No se pudo eliminar el sprint");

        // Recargar la página sin el parámetro ?id= para que cargue el primer sprint disponible
        window.location.href = "inicio.html";
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}