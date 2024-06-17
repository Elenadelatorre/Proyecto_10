import './style.css';

// Importar los módulos necesarios:
import Login from './src/pages/Login';
import Logout from './src/pages/Logout';
import Eventos from './src/pages/Eventos';
import EventosConfirmados from './src/pages/EventosConfirmados';
import { Header } from './src/components/Header/Header';
import { Footer } from './src/components/Footer/Footer';

// Crear los eventos de clic a los enlaces de la página y asegurarnos que cargue la página completa:
document.addEventListener('DOMContentLoaded', function () {
  Header();
  Footer();
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
