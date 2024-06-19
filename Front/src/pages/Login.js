import { formLogin } from '../components/Forms/FormLogin';
import { showAlert } from '../components/alert/alert';
import { POST } from '../components/fetchData/fetchData';
import Eventos from './Eventos';
import Register, { updateLogoutLinkVisibility } from './Register';

//! Crear una función llamada 'loginSubmit' para procesar el envío del formulario de inicio de sesión:
const loginSubmit = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email').value;
  const contraseña = document.querySelector('#password').value;

  try {
    // Realiza una solicitud a la API para iniciar sesión:
    const response = await POST('/users/login', {
      email,
      contraseña
    });

    // Verifica si la respuesta es exitosa
    if (!response.ok) {
      showAlert('Usuario o contraseña incorrectos', 'error');
      throw new Error(errorUser.message || 'Fallo en el inicio de sesión');
    }

    const responseData = await response.json();

    // Almacena el token en el localStorage
    const token = responseData.token;
    if (token) {
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage:', token); // Debug log
    } else {
      console.error('Token is undefined or null'); // Error log
    }

    // Almacena la información del usuario en el localStorage
    const user = responseData.user;
    localStorage.setItem('user', JSON.stringify(user));

    // Llamar a la función 'Eventos' para actualizar la sección de eventos en la página:
    Eventos();
  } catch (error) {
    console.log('Error durante el login:', error);
  }
};

//! Crear una función llamada 'Login' para actualizar los elementos de la sección de inicio de sesión en el DOM:
const Login = () => {
  const mainContent = document.querySelector('main');
  mainContent.innerHTML = ''; // Limpiar el contenido actual
  mainContent.appendChild(formLogin());
  // Ocultar el enlace de cierre de sesión:
  updateLogoutLinkVisibility(false);

  // Ocultar el enlace de inicio de sesión, ya que es lo que vas a hacer:
  document.getElementById('loginlink').style.display = 'none';

  // Si no hay un usuario:
  if (!localStorage.getItem('user')) {
    document.getElementById('misEventoslink').style.display = 'none';

    // Agregar un event listener al botón de inicio de sesión para procesar el evento de clic:
    document
      .querySelector('#login-form')
      .addEventListener('submit', loginSubmit);
  }
  document.querySelector('#register-link').addEventListener('click', (e) => {
    e.preventDefault();
    // Llama a la función `Login` para redirigir al usuario a la sección de inicio de sesión
    Register();
  });
};

export default Login;
