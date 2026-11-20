const ulNav = document.getElementById("lista-sprints-nav");
const tituloSprint = document.getElementById("titulo-sprint");
const linkGlobal = ulNav.querySelector('a[data-sprint-id="-1"]');
const mensajeError = document.getElementById("mensaje-error");

const tEstados = document.getElementById("tbody-estados");
const tResponsables = document.getElementById("tbody-responsables");

getSprintsNav();

let idSprintActual = new URLSearchParams(window.location.search).get("id");

if (!idSprintActual) {
  tituloSprint.textContent = `Informe de Sprints globales`;
  linkGlobal.classList.add("active");
  getHistoriasPorEstado();
  getHistoriasPorResponsable();
} else {
  getHistoriasPorEstadoPorSprint();
  getHistoriasPorResponsablePorSprint();
}

async function getSprintsNav() {
  const resSprints = await fetch("http://127.0.0.1:8000/sprints");
  const sprints = await resSprints.json();
  sprints.forEach((sprint, index) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `informes.html?id=${encodeURIComponent(sprint.id)}`;
    a.dataset.sprintId = sprint.id;
    a.textContent = `Sprint ${index + 1}: ${sprint.nombre}`;
    li.appendChild(a);
    if (String(sprint.id) === String(idSprintActual)) {
      tituloSprint.textContent = `Informe del Sprint: ${sprint.nombre}`;
      linkGlobal.classList.remove("active");
      const linkActual = ulNav.querySelector(
        `a[data-sprint-id="${sprint.id}"]`,
      );
      a.classList.add("active");
    }
    ulNav.appendChild(li);
  });
}

async function getHistoriasPorEstado() {
  try {
    const resHistorias = await fetch("http://127.0.0.1:8000/informes/estados");
    const historias = await resHistorias.json();
    //eliminar texto "cargando..."
    tEstados.innerHTML = "";
    historias.forEach((historia) => {
      const tr = document.createElement("tr");
      //primera letra en mayúscula
      tr.innerHTML = `
            <td>${historia.estado.charAt(0).toUpperCase() + historia.estado.slice(1)}</td>
            <td>${historia.total}</td>
        `;
      tEstados.appendChild(tr);
    });
  } catch (error) {
    console.error("Error al obtener historias por estado:", error);
    mensajeError.style.display = "block";
  }
}
async function getHistoriasPorResponsable() {
  try {
    const resHistorias = await fetch(
      "http://127.0.0.1:8000/informes/responsables",
    );
    const historias = await resHistorias.json();
    tResponsables.innerHTML = "";
    historias.forEach((historia) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${historia.responsable}</td>
            <td>${historia.total}</td>
            <td>${historia.nuevas}</td>
            <td>${historia.activas}</td>
            <td>${historia.finalizadas}</td>
            <td>${historia.impedimentos}</td>
        `;
      tResponsables.appendChild(tr);
    });
  } catch (error) {
    console.error("Error al obtener historias por responsable:", error);
    mensajeError.style.display = "block";
  }
}

async function getHistoriasPorEstadoPorSprint() {
  try {
    const resHistorias = await fetch(
      `http://127.0.0.1:8000/informes/estados/${idSprintActual}`,
    );
    const historias = await resHistorias.json();
    //eliminar texto "cargando..."
    tEstados.innerHTML = "";
    historias.forEach((historia) => {
      const tr = document.createElement("tr");
      //primera letra en mayúscula
      tr.innerHTML = `
            <td>${historia.estado.charAt(0).toUpperCase() + historia.estado.slice(1)}</td>
            <td>${historia.total}</td>
        `;
      tEstados.appendChild(tr);
    });
  } catch (error) {
    console.error("Error al obtener historias por estado:", error);
    mensajeError.style.display = "block";
  }
}
async function getHistoriasPorResponsablePorSprint() {
  try {
    const resHistorias = await fetch(
      `http://127.0.0.1:8000/informes/responsables/${idSprintActual}`,
    );
    const historias = await resHistorias.json();
    tResponsables.innerHTML = "";
    historias.forEach((historia) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${historia.responsable}</td>
            <td>${historia.total}</td>
            <td>${historia.nuevas}</td>
            <td>${historia.activas}</td>
            <td>${historia.finalizadas}</td>
            <td>${historia.impedimentos}</td>
        `;
      tResponsables.appendChild(tr);
    });
  } catch (error) {
    console.error("Error al obtener historias por responsable:", error);
    mensajeError.style.display = "block";
  }
}
