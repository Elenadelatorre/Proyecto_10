import { showAsistentesByEvento } from './asistentesModule.js';
//import { getEventoEspecifico } from './eventosModule.js';

//! Crear una función llamada 'EventosConfirmados' para mostrar solo los eventos a los que el usuario va a asistir:
export const EventosConfirmados = async () => {
  document.getElementById('crear-evento-btn').style.display = 'none';

  // Utilizar las asistencias que el usuario tiene guardadas en el localStorage o un objeto vacío si no tiene asistencias guardadas todavía:
  const asistencias = JSON.parse(localStorage.getItem('asistencias')) || {};

  document.querySelector('.eventos').textContent = 'Mis Eventos';
  const eventosContainer = document.querySelector('#eventos-container');
  eventosContainer.innerHTML = '';

  const response = await fetch('http://localhost:3000/api/v1/eventos');
  const eventos = await response.json();

  // Filtrar los eventos que el usuario va a asistir:
  const eventosAsistiendo = eventos.filter((evento) => asistencias[evento._id]);

  // Si el usuario no va a asistir a ningún evento, mostrar un mensaje:
  if (eventosAsistiendo.length === 0) {
    eventosContainer.innerHTML =
      '<p class="no-eventos-message">Aún no vas a asistir a ningún evento, apúntate.</p>';
    return;
  }

  // Itera sobre cada evento y crea elementos de lista para mostrar los eventos confirmados:
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
      </div>
      <button class="ver-asistentes-btn" data-evento-id="${
        evento._id
      }">Ver Asistentes</button>
    `;
    eventosContainer.appendChild(li);

    // Agregar un evento clic al botón de 'Ver asistentes':
    const verAsistentesBtn = li.querySelector('.ver-asistentes-btn');
    verAsistentesBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await showAsistentesByEvento(evento._id);
    });

    // Agregar un evento clic al elemento 'evento-item' para mostrar detalles del evento específico:
    li.addEventListener('click', async () => {
      await getEventoEspecifico(evento._id);
      document.getElementById('crear-evento-btn').style.display = 'none';
    });
  });
};

export default EventosConfirmados;
