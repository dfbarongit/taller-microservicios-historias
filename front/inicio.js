const ulNav = document.getElementById("ulNav");
const tituloSprint = document.getElementById("tituloSprint");
const btnModificarSprint = document.getElementById("btnModificarSprint");
const btnEliminarSprint = document.getElementById("btnEliminarSprint");
const btnCrearHistoria = document.getElementById("btnCrearHistoria");
const dHistorias = document.getElementById("dHistorias");
const mensajeError = document.getElementById("mensajeError");

//obtener lista de sprints e inicializar
getSprintsNav();

let idSprintActual = new URLSearchParams(window.location.search).get("id");

btnModificarSprint.href = `sprint_form.html?id=${idSprintActual}`;
btnCrearHistoria.href = `historia_form.html?idSprint=${idSprintActual}`;



if (new URLSearchParams(window.location.search).get("error")) {
  mensajeError.style.display = "block";
}

async function getSprintsNav() {
  try{
    const resSprints = await fetch("http://127.0.0.1:8000/sprints");
    const sprints = await resSprints.json();
    tituloSprint.textContent = "Informe del Sprint: " + sprints[0].nombre;
    if (!idSprintActual) {
    idSprintActual = sprints[0].id;
  }
  ulNav.innerHTML = ""; // Limpiar la lista antes de agregar los elementos
  sprints.forEach((sprint, index) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `inicio.html?id=${encodeURIComponent(sprint.id)}`;
    a.dataset.sprintId = sprint.id;
    a.textContent = `Sprint ${index + 1}: ${sprint.nombre}`;
    li.appendChild(a);
    if (String(sprint.id) === String(idSprintActual)) {
      tituloSprint.textContent = `Informe del Sprint: ${sprint.nombre}`;
      const linkActual = ulNav.querySelector(
        `a[data-sprint-id="${sprint.id}"]`,
      );
      a.classList.add("active");
    }

    ulNav.appendChild(li);
  });
  }catch (error) {
    console.error("Error al obtener los sprints:", error);
    ulNav.innerHTML = `<li class="error-message">Error al cargar sprints: ${esc(error.message)}</li>`;
  }
  cargarHistoriasDelSprint(idSprintActual);
}

async function cargarHistoriasDelSprint(idSprint) {
  try {
    const resHistorias = await fetch(
      `http://127.0.0.1:8000/sprints/${idSprint}/historias`,
    );

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
      //resaltar el estado de impedimento si existe
      const estado = historia.estado ?? "";
      const estadoHTML = String(estado).toLowerCase().includes("impedimento")
        ? `<span class="impedimento">${estado}</span>`
        : estado;

      tarjetasHTML += `
                <article class="story-card">
                    <h3>${historia.titulo}</h3>
                    <p>${historia.descripcion}</p>
                    <div class="story-meta">
                        <span class="story-info"><strong>Responsable:</strong> ${historia.responsable}</span>
                        <span class="story-info"><strong>Estado:</strong> ${estadoHTML}</span>
                        <span class="story-info"><strong>Puntos:</strong> ${historia.puntos}</span>
                        <span class="story-info"><strong>Creación:</strong> ${historia.fecha_creacion}</span>
                        <span class="story-info"><strong>Finalización:</strong> ${historia.fecha_finalizacion}</span>
                    </div>
                    <a class="button" href="historia_form.html?idSprint=${encodeURIComponent(historia.sprint_id)}&id=${encodeURIComponent(historia.id)}">Modificar Historia</a>
                    <button class="button danger-link" onclick="eliminarHistoria(${historia.id})">Eliminar Historia</button>
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
    const res = await fetch(`http://127.0.0.1:8000/sprints/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("No se pudo eliminar el sprint");

    window.location.href = "inicio.html";
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}
async function eliminarHistoria(id) {
  if (!confirm("¿Estás seguro de eliminar esta historia?")) return;
  try {
    const res = await fetch(`http://127.0.0.1:8000/historias/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("No se pudo eliminar el sprint");

    window.location.href = "inicio.html";
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}
