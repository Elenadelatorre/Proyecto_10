import './Header.css';


export const Header = () => {
  const header = document.createElement('header');

  const homeLink = document.createElement('a');
  homeLink.href = '#';
  homeLink.id = 'home';
  const homeTitle = document.createElement('h1');
  homeTitle.textContent = 'Apúntate';
  homeLink.appendChild(homeTitle);

  const eventosLink = document.createElement('a');
  eventosLink.href = '#';
  eventosLink.id = 'eventoslink';
  eventosLink.textContent = 'Eventos';

  const misEventosLink = document.createElement('a');
  misEventosLink.href = '#';
  misEventosLink.id = 'misEventoslink';
  misEventosLink.textContent = 'Mis eventos ⭐';

  const loginLink = document.createElement('a');
  loginLink.href = '#';
  loginLink.id = 'loginlink';
  loginLink.textContent = 'Iniciar sesión';

  const logoutLink = document.createElement('a');
  logoutLink.href = '#';
  logoutLink.id = 'logoutlink';
  logoutLink.textContent = 'Cerrar sesión';

  header.appendChild(homeLink);
  header.appendChild(eventosLink);
  header.appendChild(misEventosLink);
  header.appendChild(loginLink);
  header.appendChild(logoutLink);

  document.body.insertBefore(header, document.body.firstChild);
};
