import { template, getEventos, handleCrearEvento } from './eventosModule.js';


//! Define una función que actualiza el contenido de la sección de libros en el DOM:
const Eventos = () => {
  // Selecciona el elemento 'main' en el DOM y asigna el HTML generado por la función `template`
  document.querySelector('main').innerHTML = template();
  // Llama a la función `getBooks` para cargar dinámicamente los libros en la página
  getEventos();

  // Agrega el evento clic al botón de crear evento para mostrar el formulario:
  document.getElementById('crear-evento-btn').addEventListener('click', () => {
    document.getElementById('crear-evento-modal').style.display = 'block';
    document.getElementById('asistentes-section').style.display = 'none';
  });

  // Agregar un event listener al botón que crea el evento
  document
    .querySelector('#crear-evento')
    .addEventListener('click', async (event) => {
      event.preventDefault(); // Evita que el formulario se envíe normalmente
      await handleCrearEvento();
    });

  // Agregar un evento click a cancelar para cerrar el modal
  document
    .getElementById('cancelar-crear-evento')
    .addEventListener('click', () => {
      document.getElementById('crear-evento-modal').style.display = 'none';
      document.getElementById('asistentes-section').style.display = 'none';
      document.getElementById('eventos-container').style.display = 'block';
    });

  // Agrega el evento clic al botón de volver para mostrar la sección de libros:
  document.getElementById('volver').addEventListener('click', () => {
    document.getElementById('eventos-container').style.display = 'block';
    document.getElementById('asistentes-section').style.display = 'none';
    document.querySelector('.eventos').style.display = 'block';
  });
};
//! Exporta la función `Books` como el valor predeterminado del módulo
export default Eventos;
