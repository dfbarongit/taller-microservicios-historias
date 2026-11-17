const API_URL = "http://127.0.0.1:8000";

// Referencias al DOM
const tituloFormulario = document.getElementById("tituloFormulario");
const subtituloSinReg = document.getElementById("subtituloSinReg");
const mensajeError = document.getElementById("mensajeError");
const formSprint = document.getElementById("formSprint");
const inputId = document.getElementById("sprintId");
const inputNombre = document.getElementById("nombre");
const inputFechaInicio = document.getElementById("fecha_inicio");
const inputFechaFin = document.getElementById("fecha_fin");
const btnGuardar = document.getElementById("btnGuardar");

// Leer parámetros de la URL
const params = new URLSearchParams(window.location.search);
const idSprint = params.get("id");
const sinReg = params.get("sinReg");

document.addEventListener("DOMContentLoaded", inicializarFormulario);

async function inicializarFormulario() {
    if (sinReg) {
        subtituloSinReg.style.display = "block";
    }

    // Si viene un ID en la URL, pasamos a modo Edición
    if (idSprint) {
        tituloFormulario.textContent = "Editar un sprint existente";
        btnGuardar.textContent = "Guardar cambios";
        inputId.value = idSprint;

        await cargarDatosSprint(idSprint);
    }
}

async function cargarDatosSprint(id) {
    try {
        const res = await fetch(`${API_URL}/sprints/${id}`);
        if (!res.ok) {
            throw new Error(`No se pudo cargar el sprint (HTTP ${res.status})`);
        }

        const sprint = await res.json();

        // Llenar los campos del formulario
        inputNombre.value = sprint.nombre ?? "";
        // Si MySQL devuelve fecha con hora (YYYY-MM-DD HH:MM:SS), tomamos solo YYYY-MM-DD
        inputFechaInicio.value = (sprint.fecha_inicio ?? "").split(" ")[0];
        inputFechaFin.value = (sprint.fecha_fin ?? "").split(" ")[0];

    } catch (error) {
        mostrarError(`Error al obtener los datos: ${error.message}`);
    }
}

formSprint.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar recarga tradicional del formulario
    mensajeError.style.display = "none";

    const payload = {
        nombre: inputNombre.value.trim(),
        fecha_inicio: inputFechaInicio.value,
        fecha_fin: inputFechaFin.value
    };

    // Definir método y URL según si es creación o actualización
    const esEdicion = Boolean(idSprint);
    const url = esEdicion ? `${API_URL}/sprints/${idSprint}` : `${API_URL}/sprints`;
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
            throw new Error(data.error || `Error al guardar (HTTP ${res.status})`);
        }

        // Redirigir a inicio.html seleccionando el sprint recién creado o editado
        const idDestino = esEdicion ? idSprint : (data.id ?? "");
        window.location.href = idDestino ? `inicio.html?id=${idDestino}` : "inicio.html";

    } catch (error) {
        mostrarError(error.message);
        btnGuardar.disabled = false;
        btnGuardar.textContent = esEdicion ? "Guardar cambios" : "Crear nuevo sprint";
    }
});

function mostrarError(texto) {
    mensajeError.textContent = texto;
    mensajeError.style.display = "block";
}