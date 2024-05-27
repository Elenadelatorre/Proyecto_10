export const template = () => `
  <section id="eventosConfirmados">
  <h3 id="welcome-message">${
    localStorage.getItem('user') ? 'Bienvenido' : 'Por favor, inicie sesión'
  }</h3>
    <h2 class="eventosConfirmados">Mis eventos</h2>
    <ul id="eventos-confirmados-container"></ul>
  </section>`;

  //! Definir una función para obtener los eventos confirmados:
export const getEventosConfirmados = async () => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/v1/eventos/eventosConfirmados',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')},`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener eventos confirmados');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los eventos confirmados:', error);
    return []; 
  }
};

//! Crear una función para mostrar los eventos confirmados:
export const EventosConfirmados = async () => {
  document.querySelector('main').innerHTML = template();
  const eventosConfirmadosContainer = document.getElementById(
    'eventos-confirmados-container'
  );
try{
  const eventosConfirmados = await getEventosConfirmados();

   // Verificar si eventosConfirmados es una lista válida
   if (!Array.isArray(eventosConfirmados)) {
    console.error('No se pudo obtener la lista de eventos confirmados');
    eventosConfirmadosContainer.innerHTML = '<p>No se encontraron eventos confirmados.</p>';
    return;
  }
  // Limpiar el contenedor antes de mostrar los nuevos eventos
  eventosConfirmadosContainer.innerHTML = '';

  eventosConfirmados.forEach((asistencia) => {
    const evento = asistencia.eventoConfirmado;
    const eventoElement = document.createElement('div');
    eventoElement.classList.add('evento');

    const tituloElement = document.createElement('h3');
    tituloElement.textContent = evento.eventoConfirmadotitulo;

    const fechaElement = document.createElement('p');
    fechaElement.textContent = evento.fecha;

    // Agregar más detalles del evento según tu modelo de datos
    eventoElement.appendChild(tituloElement);
    eventoElement.appendChild(fechaElement);

    eventosConfirmadosContainer.appendChild(eventoElement);
  });
} catch (error) {
  console.error('Error al obtener y mostrar los eventos confirmados:', error);
  eventosConfirmadosContainer.innerHTML = '<p>Ocurrió un error al cargar los eventos confirmados.</p>';
}
};

export default EventosConfirmados;
