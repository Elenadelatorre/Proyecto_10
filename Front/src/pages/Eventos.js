import { eventosContainer } from '../components/eventosContainer/eventosContainer.js';
import { getEventos, handleCrearEvento } from './eventosModule.js';

//! Crear una función para actualizar el contenido de la sección de eventos en el DOM:
const Eventos = () => {
  getEventos();

  //Crear variables:
  const userLoggedIn = localStorage.getItem('user');
  const logoutLink = document.getElementById('logoutlink');
  const misEventos = document.getElementById('misEventoslink');
  const loginlink = document.getElementById('loginlink');

  //Si el usuario NO ha iniciado sesión y el link de logout existe:
  if (!userLoggedIn && logoutLink) {
    logoutLink.style.display = 'none';
    misEventos.style.display = 'none';
    loginlink.style.display = 'block';
    //
  } else {
    //Sino:
    logoutLink.style.display = 'block';
    misEventos.style.display = 'block';
    loginlink.style.display = 'none';
  }

  const mainContent = document.querySelector('main');
  mainContent.innerHTML = ''; // Limpiar el contenido actual
  mainContent.appendChild(eventosContainer());

  //Mostrar o no el botón de "Crear nuevo evento" dependiendo si ha iniciado sesión o no:
  const crearEventoBtn = document.getElementById('crear-evento-btn');
  if (crearEventoBtn) {
    crearEventoBtn.style.display = userLoggedIn ? 'block' : 'none';
  }

  // Agregar el evento clic al botón de 'Crear nuevo evento' para mostrar el formulario:
  document.getElementById('crear-evento-btn').addEventListener('click', () => {
    document.getElementById('crear-evento-modal').style.display = 'block';
    document.getElementById('asistentes-section').style.display = 'none';
  });

  // Agregar un evento clic al botón que crea el evento dentro del formulario:
  const crearNuevoEventoForm = document.getElementById('crear-evento');
  if (crearNuevoEventoForm) {
    crearNuevoEventoForm.addEventListener('click', async (event) => {
      event.preventDefault(); // Evita que el formulario se envíe normalmente
      await handleCrearEvento();
    });
  }

  // Agregar un evento clic al botón 'cancelar' para cerrar el formulario:
  const cancelarCrearEventoBtn = document.getElementById(
    'cancelar-crear-evento'
  );
  if (cancelarCrearEventoBtn) {
    cancelarCrearEventoBtn.addEventListener('click', () => {
      document.getElementById('crear-evento-modal').style.display = 'none';
      document.getElementById('asistentes-section').style.display = 'none';
      document.getElementById('eventos-container').style.display = 'block';
    });
  }

  // Agregar un evento clic al botón de "volver a eventos" para mostrar la sección de eventos:

  const volverBtn = document.getElementById('volver');
  if (volverBtn) {
    volverBtn.addEventListener('click', () => {
      getEventos();
      document.getElementById('eventos-container').style.display = 'block';
      document.getElementById('asistentes-section').style.display = 'none';
    });
  }
};
export default Eventos;
