import { getAsistentesByEvento } from './asistentesModule.js';

//! Define una arrow function llamada `template` que devuelve un template string:
export const template = () => `
  <section id="eventos">
  <h3 id="welcome-message">${
    localStorage.getItem('user') ? 'Bienvenido' : 'Por favor, inicie sesión'
  }</h3>
    <h2 class="eventos">Eventos</h2>
    <button id="crear-evento-btn">Crear Evento ➕ </button>
    <ul id="eventos-container"></ul>
    <div id="asistentes-section" style="display: none;">
      <h2 class="asistentes">Asistentes</h2>
      <ul id="asistentes-container"></ul>
      <button id="volver">Volver a eventos</button>
    </div>
    <div id="crear-evento-modal" class="modal" style="display: none">
      <h2 class="eventos">Crear Nuevo Evento</h2
      <form id="nuevo-evento-form" class ="modal-content">
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
    // Realiza una solicitud a la API para obtener datos de libros
    const response = await fetch('http://localhost:3000/api/v1/eventos');

    // Verifica si la solicitud fue exitosa
    if (!response.ok) {
      throw new Error('Error al obtener los eventos');
    }

    const eventos = await response.json(); // Convierte los datos a formato JSON
    const eventosContainer = document.querySelector('#eventos-container');
    eventosContainer.innerHTML = '';

    // Itera sobre cada evento y crea elementos de lista para mostrar la información:
    eventos.forEach((evento) => {
      const li = document.createElement('li');
      li.className = 'evento-item';

      let imgSrc = '';
      if (evento.img && evento.img.contentType) {
        imgSrc = `data:${evento.img.contentType};base64,${btoa(
          String.fromCharCode(...new Uint8Array(evento.img.data))
        )}`;
      }

      li.innerHTML = `
      <img src="${imgSrc}" alt="${evento.titulo}" class="evento-img" />
      <div class="evento-info">
        <h2>${evento.titulo}</h2>
        <h3>${new Date(evento.fecha).toLocaleDateString()}</h3>
        <h4>${evento.ubicacion}</h4>
        <h5>${evento.descripcion}</h5>
      </div>
      <button class="asistencia-btn" data-evento-id="${
        evento._id
      }">Asisto 👍🏻</button>
      <button class="ver-asistentes-btn" data-evento-id="${
        evento._id
      }">Ver Asistentes</button>
    `;
      eventosContainer.appendChild(li);

      // Agrega un evento clic al botón de asistencia:
      li.querySelector('.asistencia-btn').addEventListener(
        'click',
        async () => {
          await handleAddToAsistencias(evento._id);
        }
      );

      // Agrega un evento clic al botón de ver asistentes:
      li.querySelector('.ver-asistentes-btn').addEventListener(
        'click',
        async () => {
          await getAsistentesByEvento(evento._id);
        }
      );
    });

    // Agrega el evento clic al botón de ver asistentes para mostrar la sección de asistentes:
    document.querySelectorAll('.ver-asistentes-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        toggleVerAsistentes();
        document.querySelector('.eventos').style.display = 'none';
        const eventoId = btn.getAttribute('data-evento-id');
        await getAllAsistentes(eventoId);
      });
    });
    // Agrega el evento clic al botón de crear evento para mostrar el formulario:
    // document
    //   .getElementById('crear-evento-btn')
    //   console.log("Botón clicado");
    //   .addEventListener('click', (event) => {
    //     event.preventDefault();
    //     handleCrearEvento();
    //   });
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
  }
};
// Selecciona todos los botones "Ver Asistentes" y agrega el evento clic a cada uno
const verAsistentesBtns = document.querySelectorAll('.ver-asistentes-btn');
verAsistentesBtns.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const eventoId = btn.getAttribute('data-evento-id');
    await getAsistentesByEvento(eventoId);
  });
});

//! Define una función para manejar la asistencia a los eventos:
export const handleAddToAsistencias = async (eventoId) => {
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
          eventoConfirmado: eventoId,
          nombre: user.nombre,
          email: user.email
        })
      }
    );
    if (!postResponse.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al marcar asistencia');
    }

    const responseData = await response.json();
    alert(responseData.message || 'Asistencia confirmada');
  } catch (error) {
    console.log(error);
    alert('Hubo un error al marcar la asistencia');
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
    const imgInput = document.getElementById('img');

    let img = null;
    if (imgInput.files.length > 0) {
      // Obtener el primer archivo seleccionado
      const file = imgInput.files[0];
      img = file;
    }

    console.log(titulo, fecha, ubicacion, descripcion, img);

    // Llamar a la función para crear el evento
    console.log('Enviando solicitud fetch...');

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
          img
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
