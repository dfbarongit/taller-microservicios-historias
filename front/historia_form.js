
const API_URL = "http://127.0.0.1:8000";

// Referencias al DOM
const tituloFormulario = document.getElementById("tituloFormulario");
const mensajeError = document.getElementById("mensajeError");
const formHistoria = document.getElementById("formHistoria");
const inputId = document.getElementById("historiaId");
const inputSprintId = document.getElementById("sprintId");
const inputNombreSprint = document.getElementById("nombreSprint");
const inputTitulo = document.getElementById("titulo");
const inputDescripcion = document.getElementById("descripcion");
const inputResponsable = document.getElementById("responsable");
const selectEstado = document.getElementById("estado");
const selectPuntos = document.getElementById("puntos");
const inputFechaCreacion = document.getElementById("fecha_creacion");
const inputFechaFinalizacion = document.getElementById("fecha_finalizacion");
const btnCancelar = document.getElementById("btnCancelar");
const btnGuardar = document.getElementById("btnGuardar");

// Leer parámetros de la URL
const params = new URLSearchParams(window.location.search);
const idHistoria = params.get("id");
let idSprintActual = params.get("idSprint");

document.addEventListener("DOMContentLoaded", inicializarFormulario);

async function inicializarFormulario() {

    if (idSprintActual) {
        inputSprintId.value = idSprintActual;
        btnCancelar.href = `inicio.html?id=${idSprintActual}`;
    }

    // Si viene un ID de historia, modo edición
    if (idHistoria) {
        tituloFormulario.textContent = "Editar una historia existente";
        btnGuardar.textContent = "Guardar cambios";
        inputId.value = idHistoria;

        await cargarDatosHistoria(idHistoria);

    } else if (!idSprintActual) {
        mostrarError("Error, no se especificó un sprint válido");
        btnGuardar.disabled = true;
        return;
    }

    // Mostrar el nombre del sprint seleccionado
    if (idSprintActual) {
        await cargarNombreSprint(idSprintActual);
    }
}

// Consultar y mostrar el nombre del sprint
async function cargarNombreSprint(idSprint) {
    try {
        const res = await fetch(`${API_URL}/sprints/${idSprint}`);

        if (!res.ok) {
            throw new Error("No se pudo consultar el sprint");
        }

        const sprint = await res.json();

        inputNombreSprint.value = sprint.nombre;

    } catch (error) {
        console.error(error);
        inputNombreSprint.value = "No se pudo cargar el sprint";
    }
}

// Cargar datos de la historia
async function cargarDatosHistoria(id) {
    try {
        const res = await fetch(`${API_URL}/historias/${id}`);

        if (!res.ok) {
            throw new Error(`No se pudo cargar la historia (HTTP ${res.status})`);
        }

        const historia = await res.json();

        // Actualizar el sprint de la historia
        idSprintActual = historia.sprint_id ?? idSprintActual;
        inputSprintId.value = idSprintActual;
        btnCancelar.href = `inicio.html?id=${idSprintActual}`;

        inputTitulo.value = historia.titulo ?? "";
        inputDescripcion.value = historia.descripcion ?? "";
        inputResponsable.value = historia.responsable ?? "";
        selectEstado.value = historia.estado ?? "";
        selectPuntos.value = String(historia.puntos ?? "");

        inputFechaCreacion.value = historia.fecha_creacion ?? "";
        inputFechaFinalizacion.value = historia.fecha_finalizacion ?? "";

    } catch (error) {
        mostrarError(`Error al obtener los datos de la historia: ${error.message}`);
    }
}

// Guardar historia
formHistoria.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensajeError.style.display = "none";

    const payload = {
        sprint_id: Number(inputSprintId.value),
        titulo: inputTitulo.value.trim(),
        descripcion: inputDescripcion.value.trim(),
        responsable: inputResponsable.value.trim(),
        estado: selectEstado.value,
        puntos: Number(selectPuntos.value),
        fecha_creacion: inputFechaCreacion.value,
        fecha_finalizacion: inputFechaFinalizacion.value
    };

    const esEdicion = Boolean(idHistoria);

    const url = esEdicion
        ? `${API_URL}/historias/${idHistoria}`
        : `${API_URL}/historias`;

    const metodo = esEdicion ? "PUT" : "POST";

    try {
        btnGuardar.disabled = true;
        btnGuardar.textContent = "Guardando...";

        const res = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(
                data.error || `Error al guardar la historia (HTTP ${res.status})`
            );
        }

        // Volver al sprint correspondiente
        window.location.href = `inicio.html?id=${payload.sprint_id}`;

    } catch (error) {
        mostrarError(error.message);
        btnGuardar.disabled = false;
        btnGuardar.textContent = esEdicion
            ? "Guardar cambios"
            : "Crear nueva historia";
    }
});

function mostrarError(texto) {
    mensajeError.textContent = texto;
    mensajeError.style.display = "block";
}
