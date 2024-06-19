import './Header.css';

const crearEnlaces = (href, id, textContent) => {
  const link = document.createElement('a');
  link.href = href;
  link.id = id;
  link.textContent = textContent;
  return link;
};

export const Header = () => {
  const header = document.createElement('header');

  const homeLink = crearEnlaces('#', 'home', 'Apúntate');
  const eventosLink = crearEnlaces('#', 'eventoslink', 'Eventos');
  const misEventosLink = crearEnlaces('#', 'misEventoslink', 'Mis eventos ⭐');
  const loginLink = crearEnlaces('#', 'loginlink', 'Iniciar sesión');
  const logoutLink = crearEnlaces('#', 'logoutlink', 'Cerrar sesión');

  header.appendChild(homeLink);
  header.appendChild(eventosLink);
  header.appendChild(misEventosLink);
  header.appendChild(loginLink);
  header.appendChild(logoutLink);

  document.body.insertBefore(header, document.body.firstChild);
};
