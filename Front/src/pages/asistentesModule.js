import { GET } from "../components/fetchData/fetchData";

//! Definir una function llamada 'template' para los elementos del DOM:
export const template = () => `
<section id="asistentes">
    <ul id="asistentes-container"></ul>
</section>
`;

//! Crear una función llamada 'showAsistentesByEvento' para obtener y mostrar los asistentes de un evento específico:
export const showAsistentesByEvento = async (eventoId) => {
  try {
    // Realiza una solicitud a la API para obtener datos de asistentes
    const response = await GET(`/asistentes/${eventoId}/asistentes`);

    const asistentes = await response.json();

    const asistentesContainer = document.querySelector('#asistentes-container');
    asistentesContainer.innerHTML = '';

    // Si no hay asistentes para el evento, mostrar un mensaje:
    if (asistentes.length === 0) {
      const mensaje = document.createElement('p');
      mensaje.textContent = 'Todavía no hay asistentes para este evento.';
      asistentesContainer.appendChild(mensaje);
    } else {
      asistentes.sort((a, b) => a.nombre.localeCompare(b.nombre)); //Ordenar.
    }

    // Iterar sobre cada asistente y crear elementos de lista para mostrar la información:
    for (const asistente of asistentes) {
      const li = document.createElement('li');
      li.innerHTML = `
      <h3 class="asistente-nombre">Nombre:  ${asistente.nombre}</h3>
      <h4 class="asistente-email">Email:  ${asistente.email}</h4>`;
      asistentesContainer.appendChild(li);
    }

    // Ocultar y mostrar secciones y elementos:
    document.getElementById('crear-evento-btn').style.display = 'none';
    document.querySelector('.eventos-title').style.display = 'none';
    document.getElementById('eventos-container').style.display = 'none';
    document.getElementById('asistentes-section').style.display = 'block';

    // Actualizar el botón de "Volver a eventos"
    document.getElementById('volver').addEventListener('click', async () => {
      document.getElementById('crear-evento-btn').style.display = 'block';
      document.querySelector('.eventos-title').style.display = 'block';
    });
  } catch (error) {
    console.log('Error en obtener los asistentes:', error);
  }
};

//! Agregar un evento clic al elemento 'evento-item':
const verAsistentesBtn = document.querySelectorAll('.asistente-nombre');
verAsistentesBtn.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const eventoId = btn.dataset.eventoId;
    await getAsistenteEspecifico(eventoId);

    document.getElementById('crear-evento-btn').style.display = 'none';
  });
});
