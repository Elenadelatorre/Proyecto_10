import { showAsistentesByEvento } from './asistentesModule.js';
import { getEventoEspecifico } from './eventosModule.js';

//! Crear una función llamada 'EventosConfirmados' para mostrar solo los eventos a los que el usuario va a asistir:
export const EventosConfirmados = async () => {
  document.getElementById('crear-evento-btn').style.display = 'none';

  try {
    // Realizar solicitud para obtener los eventos desde la API
    const responseEventos = await fetch('http://localhost:3000/api/v1/eventos');
    if (!responseEventos.ok) {
      throw new Error('Error al obtener los eventos');
    }

    const eventos = await responseEventos.json();
    document.querySelector('.eventos-title').textContent = 'Mis Eventos';
    const eventosContainer = document.querySelector('#eventos-container');
    eventosContainer.innerHTML = '';

    // Iterar sobre los eventos para mostrar solo aquellos a los que el usuario va a asistir
    for (const evento of eventos) {
      let usuarioAsistente = false;

      // Realizar solicitud para verificar la asistencia del usuario a este evento
      if (userLoggedIn) {
        const responseAsistencia = await fetch(
          `http://localhost:3000/api/v1/asistentes/${evento._id}/asistencias/${userLoggedIn.email}`
        );

        if (responseAsistencia.ok) {
          const data = await responseAsistencia.json();
          usuarioAsistente = data.asistente;
        }
      }

      if (usuarioAsistente) {
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

        // Agregar evento clic al botón de 'Ver asistentes':
        const verAsistentesBtn = li.querySelector('.ver-asistentes-btn');
        verAsistentesBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          await showAsistentesByEvento(evento._id);
        });

        // Agregar evento clic al elemento 'evento-item' para mostrar detalles del evento específico:
        li.addEventListener('click', async () => {
          await getEventoEspecifico(evento._id);
          document.getElementById('crear-evento-btn').style.display = 'none';
        });
      }
    }

    // Si el usuario no va a asistir a ningún evento, mostrar un mensaje:
    if (eventosContainer.children.length === 0) {
      eventosContainer.innerHTML =
        '<p class="no-eventos-message">Aún no vas a asistir a ningún evento, apúntate.</p>';
    }
  } catch (error) {
    console.error('Error al obtener y mostrar eventos confirmados:', error);
  }
};

export default EventosConfirmados;
