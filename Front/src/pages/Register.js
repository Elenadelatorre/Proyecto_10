import Eventos from './Eventos';
import { showAlert } from '../components/alert/alert';
import { formRegister } from '../components/Forms/FormRegister';
import { POST } from '../components/fetchData/fetchData';

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
    // Registrar nuevo usuario
    await POST('/users/register', {
      nombre,
      email,
      contraseña,
      rol
    });

    // Iniciar sesión automáticamente después del registro exitoso
    const userData = await POST('/users/login', { email, contraseña });

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
};

export default Register;
