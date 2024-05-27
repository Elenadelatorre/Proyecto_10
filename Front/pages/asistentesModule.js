//! Define una arrow function llamada `template` que devuelve un template string:
export const template = () => `
<section id="asistentes">
  ${
    localStorage.getItem('user')
      ? `<h3>Bienvenido</h3>`
      : `<h3>Por favor, inicie sesión</h3>`
  }
  <ul id="asistentes-container"></ul>
</section>
`;

//! Define una función asíncrona llamada `getBooks` para obtener y mostrar libros desde una API:
export const getAsistentesByEvento = async (eventoId) => {
  try {
    // Realiza una solicitud a la API para obtener datos de asistentes
    const response = await fetch(
      `http://localhost:3000/api/v1/eventos/${eventoId}/asistentes`
    );

    // Verifica si la solicitud fue exitosa
    if (!response.ok) {
      throw new Error('Error al obtener los asistentes');
    }

    const asistentes = await response.json(); // Convierte los datos a formato JSON
    console.log(asistentes);
    const asistentesContainer = document.querySelector('#asistentes-container');
    asistentesContainer.innerHTML = '';

    asistentes.sort((a, b) => a.nombre.localeCompare(b.nombre)); //Ordena alfabéticamente.

    // Itera sobre cada asistente y crea elementos de lista para mostrar la información:
    for (const asistente of asistentes) {
      const li = document.createElement('li');
      li.innerHTML = `
      <h3>${asistente.nombre}</h3>
      <h4>${asistente.email}</h4>`;
      asistentesContainer.appendChild(li);
    }
    document.getElementById('eventos-container').style.display = 'none';
    document.getElementById('asistentes-section').style.display = 'block';
    document.getElementById('welcome-message').style.display = 'none';
  } catch (error) {
    console.log('Error en obtener los asistentes:', error);
  }
};

//! Define una función para obtener y mostrar asistentes
export const getAllAsistentes = async () => {
  try {
    // Realiza una solicitud a la API para obtener los asistentes
    const response = await fetch('http://localhost:3000/api/v1/asistentes');

    if (!response.ok) {
      throw new Error('Error al obtener los asistentes');
    }

    const asistentes = await response.json();
    const asistentesContainer = document.querySelector('#asistentes-container');
    asistentesContainer.innerHTML = '';

    // Ordenar los asistentes alfabéticamente por nombre
    asistentes.sort((a, b) => a.nombre.localeCompare(b.nombre));

    for (const asistente of asistentes) {
      const li = document.createElement('li');
      li.textContent = `${asistente.nombre} (${asistente.email})`;
      asistentesContainer.appendChild(li);
    }

    document.getElementById('eventos-container').style.display = 'none';
    document.getElementById('asistentes-section').style.display = 'block';
    document.getElementById('welcome-message').style.display = 'none';
  } catch (error) {
    console.error('Error al obtener los asistentes:', error);
  }
};
//! Define una función para manejar la visualización del botón "Ver Asistentes"
export const toggleVerAsistentes = () => {
  const verAsistentesBtn = document.getElementById('ver-asistentes');
  verAsistentesBtn.style.display = 'none'; // Oculta el botón "Ver Asistentes"
};

//! Define una función llamada `Asistentes` que actualiza el contenido de la sección de libros en el DOM:
export const Asistentes = (eventoId) => {
  // Selecciona el elemento 'main' en el DOM y asigna el HTML generado por la función `template`
  document.querySelector('main').innerHTML = template();

  // Llama a la función `getBooks` para cargar dinámicamente los libros en la página
  getAsistentesByEvento(eventoId);
};
