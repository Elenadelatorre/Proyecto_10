import { FieldForm } from './FieldForm';

export const formRegister = () => {
  const registerSection = document.createElement('section');
  registerSection.id = 'login';

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
    for: 'nombre'
  });
  registerForm.appendChild(nombreField);

  const emailField = FieldForm({
    labelText: 'Correo electrónico',
    type: 'email',
    for: 'email'
  });
  registerForm.appendChild(emailField);

  const passwordField = FieldForm({
    labelText: 'Contraseña',
    type: 'password',
    for: 'password'
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

  registerSection.appendChild(registerForm);

  return registerSection;
};
