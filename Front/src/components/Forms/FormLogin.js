import { FieldForm } from './FieldForm';

export const formLogin = () => {
  const loginSection = document.createElement('section');
  loginSection.id = 'login';
  loginSection.className = 'login';

  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginTitle = document.createElement('h2');
    loginTitle.textContent = '¡Bienvenido de nuevo, ' + user.email + '!';
    loginSection.appendChild(loginTitle);
  } else {
    const loginTitle = document.createElement('h2');
    loginTitle.textContent = 'Inicio de sesión';
    loginSection.appendChild(loginTitle);

    const loginForm = document.createElement('form');
    loginForm.id = 'login-form';

    const emailField = FieldForm({
      labelText: 'Correo electrónico',
      type: 'email',
      for: 'email'
    });
    loginForm.appendChild(emailField);

    const passwordField = FieldForm({
      labelText: 'Contraseña',
      type: 'password',
      for: 'password'
    });
    loginForm.appendChild(passwordField);

    const registerLinkParagraph = document.createElement('p');
    registerLinkParagraph.className = 'link';
    registerLinkParagraph.textContent = '¿No tienes cuenta? ';

    const registerLink = document.createElement('a');
    registerLink.id = 'register-link';
    registerLink.href = '#';
    registerLink.textContent = 'Regístrate';
    registerLinkParagraph.appendChild(registerLink);
    loginForm.appendChild(registerLinkParagraph);

    const loginButton = document.createElement('button');
    loginButton.type = 'submit';
    loginButton.id = 'loginbtn';
    loginButton.textContent = 'Entrar';
    loginForm.appendChild(loginButton);

    loginSection.appendChild(loginForm);
  }

  return loginSection;
};
