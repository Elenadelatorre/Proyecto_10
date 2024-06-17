import Login from './Login';
import Eventos from './Eventos';
import { showAlert } from '../components/alert/alert';
import { formRegister } from '../components/Forms/FormRegister';

// Crear una función para actualizar la visibilidad del enlace de 'Cerrar sesión':
export const updateLogoutLinkVisibility = (isVisible) => {
  const logoutLink = document.querySelector('#logoutlink');
  if (logoutLink) {
    logoutLink.style.display = isVisible ? 'block' : 'none';
  }
};

//! Crear una función asíncrona llamada 'registerSubmit' para procesar el envío del formulario de registro:
const registerSubmit = async (event) => {
  event.preventDefault();

  const nombre = document.querySelector('#nombre').value;
  const email = document.querySelector('#email').value;
  const contraseña = document.querySelector('#password').value;
  const rol = document.getElementById('rol').value;

  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Verificar si el usuario está registrado como administrador:
  if (currentUser && currentUser.rol !== 'admin' && rol === 'admin') {
    alert('No tienes permiso para registrar un usuario como administrador.');
    return;
  }

  // Verificar si alguno de los campos está vacío o si la contraseña no tiene al menos 8 caracteres:
  if (!nombre || !email || !contraseña || contraseña.length < 8) {
    showAlert('Por favor, rellena todos los campos correctamente.', 'error');
    return;
  }

  try {
    // Realizar una solicitud a la API para registrar un nuevo usuario:
    const response = await fetch(
      'http://localhost:3000/api/v1/users/register',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          nombre,
          email,
          contraseña: contraseña,
          rol
        })
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el registro');
    }
    // Iniciar sesión automáticamente después del registro exitoso:
    const loginResponse = await fetch(
      'http://localhost:3000/api/v1/users/login',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          email,
          contraseña: contraseña
        })
      }
    );

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      throw new Error(errorData.message || 'Error en el inicio de sesión');
    }

    const userData = await loginResponse.json();
    localStorage.setItem('user', JSON.stringify(userData));
  } catch (error) {
    console.log('Error durante el registro:', error);
  }
  Eventos();
};

//! Crear una función llamada 'Register' que actualiza el contenido de la sección de registro en el DOM:
const Register = () => {
  const mainContent = document.querySelector('main');
  mainContent.innerHTML = ''; // Limpiar el contenido actual
  mainContent.appendChild(formRegister());
  //Actualizar la visibilidad del enlace de cierre de sesión:
  updateLogoutLinkVisibility(false);

  // Verificar si el usuario está registrado como administrador:
  const currentUser = JSON.parse(localStorage.getItem('user'));
  if (currentUser && currentUser.rol === 'admin') {
    document.getElementById('rol-container').style.display = 'block';
  }

  // Agrega un eventListener al formulario para procesar el evento de envío:
  document
    .querySelector('#register-form')
    .addEventListener('submit', registerSubmit);

  // Agrega un evento de clic al formulario para procesar el evento de envío:
  document.querySelector('#login-link').addEventListener('click', () => {
    Login();
  });
};

export default Register;
