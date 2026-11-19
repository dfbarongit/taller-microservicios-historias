// =========================================================================
// CONFIGURACIÓN DE ENDPOINTS
// =========================================================================
const BASE_URL_HISTORIAS = 'http://127.0.0.1:8000';
const BASE_URL_SPRINTS = 'http://127.0.0.1:8001'; // Ajusta el puerto/ruta de tu microservicio de Sprints si es distinto

const ENDPOINTS = {
    // Microservicio de Sprints (GET)
    obtenerSprints: `${BASE_URL_SPRINTS}/sprints`,

    // Microservicio de Historias / Informes (GET)
    estadosGlobal: `${BASE_URL_HISTORIAS}/informes/estados`,
    estadosPorSprint: (idSprint) => `${BASE_URL_HISTORIAS}/informes/estados/${idSprint}`,
    responsablesGlobal: `${BASE_URL_HISTORIAS}/informes/responsables`,
    responsablesPorSprint: (idSprint) => `${BASE_URL_HISTORIAS}/informes/responsables/${idSprint}`
};
// =========================================================================

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const idSprintActual = params.get('id') ? Number(params.get('id')) : -1;

    if (params.get('error')) {
        mostrarError('Error al guardar los datos del usuario.');
    }

    await Promise.all([
        cargarNavegacionSprints(idSprintActual),
        cargarDatosInformes(idSprintActual)
    ]);
});

/**
 * Consulta el microservicio de Sprints para construir el menú lateral
 * y actualizar el encabezado del sprint seleccionado.
 */
async function cargarNavegacionSprints(idSprintActual) {
    const ulNav = document.getElementById('lista-sprints-nav');
    const tituloSprint = document.getElementById('titulo-sprint');
    const linkGlobal = ulNav.querySelector('a[data-sprint-id="-1"]');

    if (idSprintActual === -1) {
        linkGlobal.classList.add('active');
        tituloSprint.textContent = 'Informes de Todos los sprints';
    }

    try {
        const response = await fetch(ENDPOINTS.obtenerSprints);
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status} al obtener sprints`);
        }

        const sprints = await response.json();

        sprints.forEach((spr, index) => {
            const numeroSprint = index + 1;
            const esActivo = Number(spr.id) === idSprintActual;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `informes.html?id=${spr.id}`;
            a.textContent = `Informe del Sprint ${numeroSprint}: ${spr.nombre}`;

            if (esActivo) {
                a.classList.add('active');
                tituloSprint.textContent = `Informes de ${numeroSprint}: ${spr.nombre}`;
            }

            li.appendChild(a);
            ulNav.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        mostrarError('No se pudo conectar con el microservicio de Sprints.');
    }
}

/**
 * Consulta los endpoints de informes en http://127.0.0.1:8000/informes/...
 */
async function cargarDatosInformes(idSprintActual) {
    const urlEstados = idSprintActual === -1
        ? ENDPOINTS.estadosGlobal
        : ENDPOINTS.estadosPorSprint(idSprintActual);

    const urlResponsables = idSprintActual === -1
        ? ENDPOINTS.responsablesGlobal
        : ENDPOINTS.responsablesPorSprint(idSprintActual);

    try {
        const [resEstados, resResponsables] = await Promise.all([
            fetch(urlEstados),
            fetch(urlResponsables)
        ]);

        // Si el backend devuelve 404 cuando un sprint aún no tiene historias registradas
        if (resEstados.status === 404 || resResponsables.status === 404) {
            renderizarTablaEstados([]);
            renderizarTablaResponsables([]);
            return;
        }

        if (!resEstados.ok || !resResponsables.ok) {
            throw new Error('Error al consultar los endpoints de informes');
        }

        const historiasPorEstado = await resEstados.json();
        const historiasPorResponsable = await resResponsables.json();

        renderizarTablaEstados(historiasPorEstado);
        renderizarTablaResponsables(historiasPorResponsable);
    } catch (error) {
        console.error(error);
        mostrarError('No se pudieron cargar los datos desde el servidor de informes.');
        document.getElementById('tbody-estados').innerHTML = '<tr><td colspan="2">Sin datos disponibles</td></tr>';
        document.getElementById('tbody-responsables').innerHTML = '<tr><td colspan="6">Sin datos disponibles</td></tr>';
    }
}

function renderizarTablaEstados(datos) {
    const tbody = document.getElementById('tbody-estados');
    tbody.innerHTML = '';

    if (!datos || datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2">No hay historias registradas para este filtro.</td></tr>';
        return;
    }

    datos.forEach(item => {
        const tr = document.createElement('tr');
        const estadoCapitalizado = item.estado.charAt(0).toUpperCase() + item.estado.slice(1);

        tr.innerHTML = `
            <td>${escaparHTML(estadoCapitalizado)}</td>
            <td>${escaparHTML(String(item.total))}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderizarTablaResponsables(datos) {
    const tbody = document.getElementById('tbody-responsables');
    tbody.innerHTML = '';

    if (!datos || datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No hay responsables asignados para este filtro.</td></tr>';
        return;
    }

    datos.forEach(item => {
        const tr = document.createElement('tr');
        const claseImpedimento = Number(item.impedimentos) > 0 ? 'class="impedimento"' : '';

        tr.innerHTML = `
            <td>${escaparHTML(item.responsable)}</td>
            <td>${escaparHTML(String(item.total))}</td>
            <td>${escaparHTML(String(item.nuevas))}</td>
            <td>${escaparHTML(String(item.activas))}</td>
            <td>${escaparHTML(String(item.finalizadas))}</td>
            <td><span ${claseImpedimento}>${escaparHTML(String(item.impedimentos))}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function mostrarError(mensaje) {
    const pError = document.getElementById('mensaje-error');
    pError.textContent = mensaje;
    pError.style.display = 'block';
}

function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}