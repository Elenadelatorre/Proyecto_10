import './style.css';

// Importar los módulos necesarios:
import Login from './pages/Login';
import Logout from './pages/Logout';
import Eventos from './pages/Eventos';
import EventosConfirmados from './pages/EventosConfirmados';

// Crear los eventos de clic a los enlaces de la página y asegurarnos que cargue la página completa:
document.addEventListener('DOMContentLoaded', function () {
  Eventos();

  document.getElementById('home').addEventListener('click', () => {
    Eventos();
  });

  // Link de inicio de sesión:
  document.querySelector('#loginlink').addEventListener('click', (event) => {
    event.preventDefault();
    Login();
  });

  // Link de cierre de sesión:
  document.querySelector('#logoutlink').addEventListener('click', (event) => {
    event.preventDefault();
    Logout();
  });

  // Link de eventos:
  document
    .querySelector('#eventoslink')
    .addEventListener('click', () => Eventos());

  // Link de eventos confirmados:
  document
    .querySelector('#misEventoslink')
    .addEventListener('click', (event) => {
      event.preventDefault();
      EventosConfirmados();
    });
});
