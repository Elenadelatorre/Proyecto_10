import { showAlert } from '../components/alert/alert.js';
import { showAsistentesByEvento } from './asistentesModule.js';
import eliminarEvento from './eliminarEventos.js';

//! Función para mostrar los elementos en el DOM:

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

    for (const evento of eventos) {
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
        <button class="asistencia-btn ${
          usuarioAsistente ? 'cancelar-asistencia' : ''
        }" data-evento-id="${evento._id}">
          ${usuarioAsistente ? 'Cancelar asistencia 👎🏻' : 'Asistir 👍🏻'}
        </button>
        ${
          userLoggedIn
            ? `<button class="ver-asistentes-btn" data-evento-id="${evento._id}">Ver Asistentes</button>`
            : ''
        }
        <button class="eliminar-evento-btn" data-evento-id="${
          evento._id
        }" style="display: none;">Eliminar Evento</button>
      `;
      eventosContainer.appendChild(li);

      //Abrir un modal si el usuario no está registrado:
      const openAsistenciaModal = (eventoId) => {
        const asistenciaModal = document.getElementById('asistencia-modal');
        asistenciaModal.style.display = 'block';
        const asistenciaForm = document.getElementById('asistencia-form');

        asistenciaForm.onsubmit = async (e) => {
          e.preventDefault();
          // Verificar si el usuario está autenticado
          const user = JSON.parse(localStorage.getItem('user'));
          let userOrContact = {};
          if (user) {
            userOrContact = { user };
          } else {
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            userOrContact = { nombre, email };
          }

          await handleAddToAsistencias(eventoId, userOrContact);
          closeAsistenciaModal();
          asistenciaModal.style.display = 'none';
        };
        document.getElementById('cancelar-asistencia').onclick = () => {
          asistenciaModal.style.display = 'none';
        };
      };

      const closeAsistenciaModal = () => {
        const asistenciaModal = document.getElementById('asistencia-modal');
        asistenciaModal.style.display = 'none';
      };
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
    }
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
  }
};

//!Crear VARIABLES para fetch:
const fetchData = async (url, data, method) => {
  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la solicitud');
    }

    return response.json();
  } catch (error) {
    console.error('Error en la llamada fetch:', error);
    throw error;
  }
};
//! Función para manejar la asistencia a los eventos
export const handleAddToAsistencias = async (eventoId, user) => {
  try {
    await fetchData(
      `http://localhost:3000/api/v1/eventos/${eventoId}/asistencias`,
      { nombre: user.nombre, email: user.email },
      'POST'
    );

    // Actualizar botón de asistencia si es necesario
    const button = document.querySelector(
      `.asistencia-btn[data-evento-id="${eventoId}"]`
    );
    if (button) {
      button.textContent = 'Cancelar asistencia 👎🏻';
      button.classList.add('cancelar-asistencia');
    }
    showAlert('Asistencia marcada con éxito', 'success');
    getEventos();
  } catch (error) {
    console.error('Error en la llamada fetch:', error);
  }
};

//! Función para manejar la cancelación de la asistencia
export const handleRemoveFromAsistencias = async (eventoId, button) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    await fetchData(
      `http://localhost:3000/api/v1/eventos/${eventoId}/asistencias`,
      { asistenteId: user._id },
      'DELETE'
    );

    // Actualizar el botón de 'Asistir'
    button.textContent = 'Asistir 👍🏻';
    button.classList.remove('cancelar-asistencia');
    showAlert('Asistencia cancelada con éxito', 'error');
    getEventos();
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
    await fetchData(
      'http://localhost:3000/api/v1/eventos/nuevoEvento',
      { titulo, fecha, ubicacion, descripcion, img: imgURL },
      'POST'
    );

    // Ocultar el formulario de creación de eventos:
    document.getElementById('crear-evento-modal').style.display = 'none';

    await getEventos();
  } catch (error) {
    console.log(error);
    // Mostrar mensaje de error al usuario
  }
};
