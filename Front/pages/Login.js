import { showAlert } from '../alert/alert';
import Eventos from './Eventos';
import Register, { updateLogoutLinkVisibility } from './Register';

//! Crear una función llamada 'template' para crear los elementos del DOM:
const template = () => {
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user'));

    // Si hay un usuario, muestra un mensaje de bienvenida con su nombre
    return `<section id="login">
      <h2>¡Bienvenido de nuevo, ${user.nombre}!</h2>
    </section>`;
  } else {
    return `<section id="login" class="login"> <h2>Inicio de sesión</h2>
        <form id="login-form">
          <label for="email">Correo electrónico</label>
          <input type="email" placeholder="Correo electrónico" id="email" required/>

          <label for="password">Contraseña</label>
          <input type="password" id="password" placeholder="Contraseña" required/>
          <p class="link">¿No tienes cuenta? <a id="register-link" href="#">Regístrate</a></p>

          <button type="submit" id="loginbtn">Entrar</button>
        </form>
            </section>`;
  }
};
//! Crear una función llamada 'loginSubmit' para procesar el envío del formulario de inicio de sesión:
const loginSubmit = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email').value;
  const contraseña = document.querySelector('#password').value;

  try {
    // Realiza una solicitud a la API para iniciar sesión:
    const response = await fetch('http://localhost:3000/api/v1/users/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        email: email,
        contraseña: contraseña
      })
    });

    // Verifica si la respuesta es exitosa
    if (!response.ok) {
      const errorUser = await response.json();
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
  // Ocultar el enlace de cierre de sesión:
  updateLogoutLinkVisibility(false);

  // Ocultar el enlace de inicio de sesión, ya que es lo que vas a hacer:
  document.getElementById('loginlink').style.display = 'none';

  document.querySelector('main').innerHTML = template();

  // Si no hay un usuario:
  if (!localStorage.getItem('user')) {
    document.getElementById('misEventoslink').style.display = 'none';

    // Agregar un event listener al botón de inicio de sesión para procesar el evento de clic:
    document
      .querySelector('#login-form')
      .addEventListener('submit', loginSubmit);
  }
  document.querySelector('#register-link').addEventListener('click', () => {
    // Llama a la función `Login` para redirigir al usuario a la sección de inicio de sesión
    Register();
  });
};

export default Login;