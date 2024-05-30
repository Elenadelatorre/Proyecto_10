import { showAsistentesByEvento } from './asistentesModule.js';
// Función para mostrar solo los eventos a los que el usuario va a asistir
export const EventosConfirmados = async () => {
  document.getElementById('crear-evento-btn').style.display = 'none';

  const asistencias = JSON.parse(localStorage.getItem('asistencias')) || {};

  document.querySelector('.eventos').textContent = 'Mis Eventos';
  const eventosContainer = document.querySelector('#eventos-container');
  eventosContainer.innerHTML = '';

  const response = await fetch('http://localhost:3000/api/v1/eventos');
  const eventos = await response.json();

  const eventosAsistiendo = eventos.filter((evento) => asistencias[evento._id]);

  if (eventosAsistiendo.length === 0) {
    eventosContainer.innerHTML =
      '<p class="no-eventos-message">Aún no vas a asistir a ningún evento, apúntate.</p>';
    return;
  }

  eventosAsistiendo.forEach((evento) => {
    const li = document.createElement('li');
    li.className = 'evento-item';
    li.dataset.eventoId = evento._id;

    li.innerHTML = `
      <img src="${evento.img}" alt="${evento.titulo}" class="evento-img" />
      <div class="evento-info">
        <h2>${evento.titulo}</h2>
        <h3>${new Date(evento.fecha).toLocaleDateString()}</h3>
        <h4>${evento.ubicacion}</h4>
        <h5>${evento.descripcion}</h5>
      </div>
      <button class="ver-asistentes-btn" data-evento-id="${
        evento._id
      }">Ver Asistentes</button>
    `;
    eventosContainer.appendChild(li);

    // Agrega un evento clic al botón de ver asistentes:
    const verAsistentesBtn = li.querySelector('.ver-asistentes-btn');
    verAsistentesBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await showAsistentesByEvento(evento._id);
    });

    // Agrega un evento clic al elemento `evento-item`
    li.addEventListener('click', async () => {
      await getEventoEspecifico(evento._id);
      document.getElementById('crear-evento-btn').style.display = 'none';
    });
  });
};

export default EventosConfirmados;
