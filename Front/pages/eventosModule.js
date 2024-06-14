import { showAsistentesByEvento } from './asistentesModule.js';
import eliminarEvento from './eliminarEventos.js';

const userLoggedIn = localStorage.getItem('user');
//! Función para mostrar los elementos en el DOM:
export const template = () => `
  <section id="eventos">
    <h2 class="eventos-title">Próximos eventos</h2>
    <button id="crear-evento-btn">Crear nuevo evento ➕</button>
    <ul id="eventos-container"></ul>
    <div id="asistentes-section" style="display: none;">
      <h2 class="asistentes">Asistentes</h2>
      <ul id="asistentes-container"></ul>
      <button id="volver">Volver a eventos</button>
    </div>
    <div id="crear-evento-modal" class="modal" style="display: none">
      <h2 class="eventos" class="modal-title">Crear Nuevo Evento</h2>
      <form id="nuevo-evento-form" enctype="multipart/form-data">
        <label for="titulo">Título:</label>
        <input type="text" id="titulo" name="titulo"><br>
        <label for="fecha">Fecha:</label>
        <input type="date" id="fecha" name="fecha"><br>
        <label for="ubicacion">Ubicación:</label>
        <input type="text" id="ubicacion" name="ubicacion"><br>
        <label for="descripcion">Descripción:</label><br>
        <textarea id="descripcion" name="descripcion"></textarea><br>
        <label for="img">Imagen:</label>
        <input type="file" id="img" name="img" accept="image/*"><br>
        <button id="crear-evento">Crear Evento</button>
        <button type="button" id="cancelar-crear-evento">Cancelar</button>
      </form>
    </div>
    <div id="asistencia-modal" class="modal" style="display: none;">
      <h2>Asistencia al Evento</h2>
      <form id="asistencia-form">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required><br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required><br>
        <button type="submit">Confirmar Asistencia</button>
        <button type="button" id="cancelar-asistencia">Cancelar</button>
      </form>
    </div>
  </section>
`;

//! Función para obtener y mostrar eventos desde la BBDD:
export const getEventos = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/eventos');

    if (!response.ok) {
      throw new Error('Error al obtener los eventos');
    }

    const eventos = await response.json();
    eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const eventosContainer = document.querySelector('#eventos-container');
    eventosContainer.innerHTML = '';

    const userLoggedIn = JSON.parse(localStorage.getItem('user'));

    eventos.forEach(async (evento) => {
      // Consultar el estado de asistencia desde la API cada vez que se itera sobre un evento
      let usuarioAsistente = false;
      if (userLoggedIn) {
        const responseAsistencia = await fetch(
          `http://localhost:3000/api/v1/asistentes/${evento._id}/asistencias/${userLoggedIn.email}`
        );

        if (responseAsistencia.ok) {
          const data = await responseAsistencia.json();
          usuarioAsistente = data.asistente;
        }
      }

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
        <button class="asistencia-btn ${usuarioAsistente ? 'cancelar-asistencia' : ''}" data-evento-id="${evento._id}">
          ${usuarioAsistente ? 'Cancelar asistencia 👎🏻' : 'Asistir 👍🏻'}
        </button>
        ${userLoggedIn ? `<button class="ver-asistentes-btn" data-evento-id="${evento._id}">Ver Asistentes</button>` : ''}
        <button class="eliminar-evento-btn" data-evento-id="${evento._id}" style="display: none;">Eliminar Evento</button>
      `;
      eventosContainer.appendChild(li);

      // Agregar evento clic al botón de 'Asistir' o 'Cancelar asistencia'
      const asistenciaBtn = li.querySelector('.asistencia-btn');
      asistenciaBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          if (usuarioAsistente) {
            await handleRemoveFromAsistencias(evento._id, asistenciaBtn);
          } else {
            await handleAddToAsistencias(evento._id, user);
          }
        } else {
          openAsistenciaModal(evento._id);
        }
      });

      // Agregar evento clic al botón de 'Ver asistentes'
      const verAsistentesBtn = li.querySelector('.ver-asistentes-btn');
      if (verAsistentesBtn) {
        verAsistentesBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          await showAsistentesByEvento(evento._id);
        });
      }

      // Agregar evento clic al botón de 'Eliminar evento'
      const eliminarEventoBtn = li.querySelector('.eliminar-evento-btn');
      eliminarEventoBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const eventoId = eliminarEventoBtn.getAttribute('data-evento-id');
        await eliminarEvento(eventoId);
      });

      // Agregar evento clic al elemento 'evento-item' para mostrar detalles del evento
      li.addEventListener('click', async () => {
        await getEventoEspecifico(evento._id);
        document.getElementById('crear-evento-btn').style.display = 'none';
      });
    });
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
  }
};

//! Función para manejar la asistencia a los eventos
export const handleAddToAsistencias = async (eventoId, user) => {
  try {
    const postResponse = await fetch(
      `http://localhost:3000/api/v1/eventos/${eventoId}/asistencias`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: user.nombre,
          email: user.email
        })
      }
    );

    if (!postResponse.ok) {
      const errorData = await postResponse.json();
      throw new Error(errorData.message || 'Error al marcar asistencia');
    }

    // Actualizar botón de asistencia si es necesario
    const button = document.querySelector(
      `.asistencia-btn[data-evento-id="${eventoId}"]`
    );
    if (button) {
      button.textContent = 'Cancelar asistencia 👎🏻';
      button.classList.add('cancelar-asistencia');
    }
  } catch (error) {
    console.error('Error en la llamada fetch:', error);
  }
};

//! Función para manejar la cancelación de la asistencia
export const handleRemoveFromAsistencias = async (eventoId, button) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    const deleteResponse = await fetch(
      `http://localhost:3000/api/v1/eventos/${eventoId}/asistencias`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ asistenteId: user._id })
      }
    );

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      throw new Error(errorData.message || 'Error al cancelar asistencia');
    }

    // Actualizar el botón de 'Asistir'
    button.textContent = 'Asistir 👍🏻';
    button.classList.remove('cancelar-asistencia');
  } catch (error) {
    console.error('Error al cancelar la asistencia:', error);
  }
};
//! Crear una función para mostrar los detalles de un evento específico:
export const getEventoEspecifico = async (eventoId) => {
  try {
    // Realiza una solicitud a la API para obtener los detalles del evento:
    const response = await fetch(
      `http://localhost:3000/api/v1/eventos/${eventoId}`
    );

    if (!response.ok) {
      throw new Error('Error al obtener los detalles del evento');
    }

    const evento = await response.json();

    // Mostrar los detalles del evento en el DOM:
    const eventosContainer = document.querySelector('#eventos-container');
    eventosContainer.innerHTML = `
      <div id="evento-detalles">
        <img src="${evento.img}" alt="${evento.titulo}" class="evento-img" />
        <div class="evento-info">
          <h2>${evento.titulo}</h2>
          <h3>${new Date(evento.fecha).toLocaleDateString()}</h3>
          <h4>${evento.ubicacion}</h4>
          <h5>${evento.descripcion}</h5>
        </div>
        <button id="volver">Volver a eventos</button>
      </div>
    `;

    // Agregar un evento clic al botón de 'volver a eventos':
    document.getElementById('volver').addEventListener('click', async () => {
      await getEventos();
      document.getElementById('crear-evento-btn').style.display = 'block';
    });
  } catch (error) {
    console.error('Error al obtener los detalles del evento:', error);
  }
};

//! Crear una función para manejar la creación de eventos nuevos:
export const handleCrearEvento = async () => {
  try {
    // Obtener los valores de los campos del formulario:
    const titulo = document.getElementById('titulo').value;
    const fecha = document.getElementById('fecha').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const descripcion = document.getElementById('descripcion').value;
    const imgInput = document.getElementById('img').files[0];

    console.log(titulo, fecha, ubicacion, descripcion, img);

    // Crear FormData para subir la imagen
    const formData = new FormData();
    formData.append('file', imgInput);
    formData.append('upload_preset', 'cloudinary_default');

    // Subir imagen a Cloudinary
    const cloudinaryResponse = await fetch(
      'https://api.cloudinary.com/v1_1/dfqu7m4te/image/upload',
      {
        method: 'POST',
        body: formData
      }
    );

    const cloudinaryData = await cloudinaryResponse.json();

    // Obtener la URL de la imagen subida a Cloudinary:
    const imgURL = cloudinaryData.secure_url;

    // Realizar la solicitud a la API para crear un nuevo evento:
    const postResponse = await fetch(
      'http://localhost:3000/api/v1/eventos/nuevoEvento',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo,
          fecha,
          ubicacion,
          descripcion,
          img: imgURL
        })
      }
    );
    console.log(postResponse);
    if (!postResponse.ok) {
      const errorData = await postResponse.json();
      throw new Error(errorData.message || 'Error al crear el evento');
    }

    const responseData = await postResponse.json();
    console.log(responseData);

    // Ocultar el formulario de creación de eventos:
    document.getElementById('crear-evento-modal').style.display = 'none';

    await getEventos();
  } catch (error) {
    console.log(error);
    // Mostrar mensaje de error al usuario
  }
};
