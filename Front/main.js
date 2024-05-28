// Importa el archivo de estilos CSS.
import './style.css';

// Importa el módulo 'Register' desde el archivo "./pages/Register".
import Register from './pages/Register';

// Importa el módulo 'Login' desde el archivo "./pages/Login".
import Login from './pages/Login';

import Logout from './pages/Logout';
// Importa el módulo 'Eventos' desde el archivo "./pages/Eventos".
import Eventos from './pages/Eventos';

//EVENTOS CONFIRMADOS:
import EventosConfirmados from './pages/EventosConfirmados';



document.addEventListener('DOMContentLoaded', function () {
  Eventos();
  

  // Añade un controlador de eventos para el clic en el elemento con id "loginlink", que llama a la función Login().
  document.querySelector('#loginlink').addEventListener('click', (event) => {
    event.preventDefault();
    Login();
  });

  // Añade un controlador de eventos para el clic en el elemento con id "registerlink", que llama a la función Register().
  document.querySelector('#registerlink').addEventListener('click', (event) => {
    event.preventDefault();
    Register();
    
  });

  document.querySelector('#logoutlink').addEventListener('click', (event) => {
    event.preventDefault();
    Logout();
  });

  // Añade un controlador de eventos para el clic en el elemento con id "bookslink", que llama a la función Books().
  document
    .querySelector('#eventoslink')
    .addEventListener('click', () => Eventos());

  document.querySelector('#misEventoslink').addEventListener('click', () => {
    EventosConfirmados();
  });
});
