import { template, getEventos, handleCrearEvento } from './eventosModule.js';

//! Crear una función para actualizar el contenido de la sección de eventos en el DOM:
const Eventos = () => {
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

  // Definir  el HTML generado por la función 'template':
  document.querySelector('main').innerHTML = template();

  //Mostrar o no el botón de "Crear nuevo evento" dependiendo si ha iniciado sesión o no:
  const crearEventoBtn = document.getElementById('crear-evento-btn');
  if (crearEventoBtn) {
    crearEventoBtn.style.display = userLoggedIn ? 'block' : 'none';
  }

  // Llama a la función 'getEventos' para cargar dinámicamente los eventos en la página:
  getEventos();

  // Agregar el evento clic al botón de 'Crear nuevo evento' para mostrar el formulario:
  document.getElementById('crear-evento-btn').addEventListener('click', () => {
    document.getElementById('crear-evento-modal').style.display = 'block';
    document.getElementById('asistentes-section').style.display = 'none';
  });

  // Agregar un evento clic al botón que crea el evento dentro del formulario:
  document
    .querySelector('#crear-evento')
    .addEventListener('click', async (event) => {
      event.preventDefault(); // Evita que el formulario se envíe normalmente
      await handleCrearEvento();
    });

  // Agregar un evento clic al botón 'cancelar' para cerrar el formulario:
  document
    .getElementById('cancelar-crear-evento')
    .addEventListener('click', () => {
      document.getElementById('crear-evento-modal').style.display = 'none';
      document.getElementById('asistentes-section').style.display = 'none';
      document.getElementById('eventos-container').style.display = 'block';
    });

  // Agregar un evento clic al botón de "volver a eventos" para mostrar la sección de eventos:
  document.getElementById('volver').addEventListener('click', () => {
    document.getElementById('eventos-container').style.display = 'block';
    document.getElementById('asistentes-section').style.display = 'none';
    document.querySelector('.eventos').style.display = 'block';
  });
};

export default Eventos;
