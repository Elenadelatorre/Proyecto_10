import { FieldForm } from './FieldForm';

export const formRegister = () => {
  const registerSection = document.createElement('section');
  registerSection.id = 'register';

  const registerTitle = document.createElement('h2');
  registerTitle.textContent = 'Registro';
  registerSection.appendChild(registerTitle);

  const registerForm = document.createElement('form');
  registerForm.id = 'register-form';
  registerForm.className = 'form';

  // Crear un campo de formulario usando la función FieldForm
  const nombreField = FieldForm({
    labelText: 'Nombre de usuario',
    type: 'text',
    for: 'nombre',
    id: 'nombre'
  });
  registerForm.appendChild(nombreField);

  const emailField = FieldForm({
    labelText: 'Correo electrónico',
    type: 'email',
    for: 'email',
    id: 'email'
  });
  registerForm.appendChild(emailField);

  const passwordField = FieldForm({
    labelText: 'Contraseña',
    type: 'password',
    for: 'password',
    id: 'password'
  });
  registerForm.appendChild(passwordField);

  const passwordHelp = document.createElement('p');
  passwordHelp.textContent = 'La contraseña debe tener al menos 8 caracteres';
  passwordHelp.id = 'password-help';
  passwordHelp.style.color = '#666';
  passwordHelp.style.fontSize = '0.8rem';
  registerForm.appendChild(passwordHelp);

  const registerButton = document.createElement('button');
  registerButton.type = 'submit';
  registerButton.id = 'registerbtn';
  registerButton.textContent = 'Entrar';
  registerForm.appendChild(registerButton);

  const rolContainer = document.createElement('div');
  rolContainer.id = 'rol-container';
  rolContainer.style.display = 'none';
  registerForm.appendChild(rolContainer);

  const rolLabel = document.createElement('label');
  rolLabel.for = 'rol';
  rolLabel.textContent = 'Rol:';
  rolContainer.appendChild(rolLabel);

  const rolSelect = document.createElement('select');
  rolSelect.id = 'rol';
  rolSelect.name = 'rol';
  rolContainer.appendChild(rolSelect);

  const rolOptionUser = document.createElement('option');
  rolOptionUser.value = 'user';
  rolOptionUser.textContent = 'Usuario';
  rolSelect.appendChild(rolOptionUser);

  const rolOptionAdmin = document.createElement('option');
  rolOptionAdmin.value = 'admin';
  rolOptionAdmin.textContent = 'Administrador';
  rolSelect.appendChild(rolOptionAdmin);

  registerSection.appendChild(registerForm);

  return registerSection;
};
