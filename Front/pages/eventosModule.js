import { showAsistentesByEvento } from './asistentesModule.js';

//! Define una arrow function llamada `template` que devuelve un template string:
export const template = () => `
  <section id="eventos">
    <h2 class="eventos">Eventos</h2>
    <button id="crear-evento-btn">Crear nuevo evento ➕ </button>
    <ul id="eventos-container"></ul>
    <div id="asistentes-section" style="display: none;">
      <h2 class="asistentes">Asistentes</h2>
      <ul id="asistentes-container"></ul>
      <button id="volver">Volver a eventos</button>
    </div>
    <div id="crear-evento-modal" class="modal" style="display: none">
      <h2 class="eventos" class="modal-title">Crear Nuevo Evento</h2
      <form id="nuevo-evento-form" enctype="multipart/form-data" >
        <label for="titulo">Título:</label>
        <input type="text" id="titulo" name="titulo" ><br>
        <label for="fecha">Fecha:</label>
        <input type="date" id="fecha" name="fecha" ><br>
        <label for="ubicacion">Ubicación:</label>
        <input type="text" id="ubicacion" name="ubicacion"><br>
        <label for="descripcion">Descripción:</label><br>
        <textarea id="descripcion" name="descripcion"></textarea><br>
        <label for="img">Imagen:</label>
        <input type="file" id="img" name="img" accept="image/*"><br>
        <button id="crear-evento" >Crear Evento</button>
        <button type="button" id="cancelar-crear-evento">Cancelar</button>
      </form>
    </div>
  </section>
`;

//! Define una función asíncrona llamada 'getEventos' para obtener y mostrar eventos desde una API:
export const getEventos = async () => {
  try {
    // Realiza una solicitud a la API para obtener datos de eventos:
    const response = await fetch('http://localhost:3000/api/v1/eventos');

    // Verifica si la solicitud fue exitosa
    if (!response.ok) {
      throw new Error('Error al obtener los eventos');
    }

    const eventos = await response.json();
    const eventosContainer = document.querySelector('#eventos-container');
    eventosContainer.innerHTML = '';

    const asistencias = JSON.parse(localStorage.getItem('asistencias')) || {};

    // Itera sobre cada evento y crea elementos de lista para mostrar la información:
    eventos.forEach((evento) => {
      const li = document.createElement('li');
      li.className = 'evento-item';
      li.dataset.eventoId = evento._id;

      const asistiendo = asistencias[evento._id] ? true : false;

      li.innerHTML = `
      <img src="${evento.img}" alt="${evento.titulo}" class="evento-img" />
      <div class="evento-info">
        <h2>${evento.titulo}</h2>
        <h3>${new Date(evento.fecha).toLocaleDateString()}</h3>
        <h4>${evento.ubicacion}</h4>
        <h5>${evento.descripcion}</h5>
      </div>
      <button class="asistencia-btn ${
        asistiendo ? 'cancelar-asistencia' : ''
      }" data-evento-id="${evento._id}">
          ${asistiendo ? 'Cancelar asistencia 👎🏻' : 'Asistir 👍🏻'}
        </button>
      <button class="ver-asistentes-btn" data-evento-id="${
        evento._id
      }">Ver Asistentes</button>
    `;
      eventosContainer.appendChild(li);

      // Agrega un evento clic al botón de asistencia:
      const asistenciaBtn = li.querySelector('.asistencia-btn');
      asistenciaBtn.currentHandler = async (e) => {
        e.stopPropagation();
        const user = JSON.parse(localStorage.getItem('user'));
        if (asistiendo) {
          await handleRemoveFromAsistencias(evento._id, asistenciaBtn);
        } else {
          await handleAddToAsistencias(evento._id, asistenciaBtn, user._id);
        }
      };
      asistenciaBtn.addEventListener('click', asistenciaBtn.currentHandler);

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
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
  }
};

// Selecciona todos los botones "Ver Asistentes" y agrega el evento clic a cada uno
const verAsistentesBtns = document.querySelectorAll('.ver-asistentes-btn');
verAsistentesBtns.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const eventoId = btn.getAttribute('data-evento-id');
    await showAsistentesByEvento(eventoId);
  });
});

//! ASISTENCIA:
//! Define una función para manejar la asistencia a los eventos:
export const handleAddToAsistencias = async (eventoId, button, asistenteId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert('Debe iniciar sesión para marcar asistencia a un evento.');
      return;
    }

    // Si el usuario no está inscrito, entonces realiza la solicitud POST para marcar su asistencia
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
      console.error('Error en la respuesta de la API:', errorData);
      throw new Error(errorData.message || 'Error al marcar asistencia');
    }

    const responseData = await postResponse.json();
    alert(responseData.message || 'Asistencia confirmada');

    // Actualizar el almacenamiento local
    const asistencias = JSON.parse(localStorage.getItem('asistencias')) || {};
    asistencias[eventoId] = true;
    localStorage.setItem('asistencias', JSON.stringify(asistencias));

    // Actualizar el botón
    button.textContent = 'Cancelar asistencia 👎🏻';
    button.classList.add('cancelar-asistencia');

    // Elimina el manejador de eventos anterior y añade uno nuevo
    button.removeEventListener('click', button.currentHandler);
    button.currentHandler = async (e) => {
      e.stopPropagation();
      await handleRemoveFromAsistencias(eventoId, button);
    };
    button.addEventListener('click', button.currentHandler);
  } catch (error) {
    console.error('Error en la llamada fetch:', error);
    alert('Hubo un error al marcar la asistencia');
  }
};

//! Define una función para manejar la cancelación de la asistencia:
export const handleRemoveFromAsistencias = async (eventoId, button) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert('Debe iniciar sesión para cancelar su asistencia a un evento.');
      return;
    }

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
      console.error('Error en la respuesta de la API:', errorData);
      throw new Error(errorData.message || 'Error al cancelar asistencia');
    }

    // No hay contenido en la respuesta (estatus 204 No Content)
    const responseData = { message: 'Asistencia cancelada correctamente' };

    // Actualizar el almacenamiento local
    const asistencias = JSON.parse(localStorage.getItem('asistencias')) || {};
    delete asistencias[eventoId];
    localStorage.setItem('asistencias', JSON.stringify(asistencias));

    alert(responseData.message); // Mostrar mensaje de éxito

    // Actualizar el botón
    button.textContent = 'Asistir 👍🏻';
    button.classList.remove('cancelar-asistencia');

    // Elimina el manejador de eventos anterior y añade uno nuevo
    button.removeEventListener('click', button.currentHandler);
    button.currentHandler = async (e) => {
      e.stopPropagation();
      await handleAddToAsistencias(eventoId, button, user._id);
    };
    button.addEventListener('click', button.currentHandler);
  } catch (error) {
    console.error('Error al cancelar la asistencia:', error);
    alert('Hubo un error al cancelar la asistencia');
  }
};

//! Define una función para mostrar los detalles de un evento específico:
export const getEventoEspecifico = async (eventoId) => {
  try {
    // Realiza una solicitud a la API para obtener los detalles del evento
    const response = await fetch(
      `http://localhost:3000/api/v1/eventos/${eventoId}`
    );
    if (!response.ok) {
      throw new Error('Error al obtener los detalles del evento');
    }

    const evento = await response.json();

    // Muestra los detalles del evento en el DOM
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

    // Agrega un evento clic al botón de volver
    document.getElementById('volver').addEventListener('click', async () => {
      await getEventos();
      document.getElementById('crear-evento-btn').style.display = 'block';
    });
  } catch (error) {
    console.error('Error al obtener los detalles del evento:', error);
  }
};

//! Crear una función para manejar la creación de eventos:
export const handleCrearEvento = async () => {
  try {
    // Obtener los valores de los campos del formulario
    const titulo = document.getElementById('titulo').value;
    const fecha = document.getElementById('fecha').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const descripcion = document.getElementById('descripcion').value;
    const imgInput = document.getElementById('img').files[0];

    console.log(titulo, fecha, ubicacion, descripcion, img);

    // Llamar a la función para crear el evento
    console.log('Enviando solicitud fetch...');

    // Crear FormData para subir la imagen
    const formData = new FormData();
    formData.append('file', imgInput);
    formData.append('upload_preset', 'cloudinary_default'); // Reemplaza con tu upload preset de Cloudinary

    // Subir imagen a Cloudinary
    const cloudinaryResponse = await fetch(
      'https://api.cloudinary.com/v1_1/dfqu7m4te/image/upload', // Reemplaza con tu URL de Cloudinary
      {
        method: 'POST',
        body: formData
      }
    );

    const cloudinaryData = await cloudinaryResponse.json();
    const imgURL = cloudinaryData.secure_url; // Obtener URL de la imagen subida
    // Enviar los datos del evento al servidor
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
      throw new Error(errorData.message || 'Error al marcar asistencia');
    }

    const responseData = await postResponse.json();
    console.log(responseData);
    alert(responseData.message || 'Evento creado correctamente');
    document.getElementById('crear-evento-modal').style.display = 'none';
    await getEventos();
  } catch (error) {
    console.log(error);
    // Mostrar mensaje de error al usuario
    alert('Error al crear el evento: ' + error.message);
  }
};
