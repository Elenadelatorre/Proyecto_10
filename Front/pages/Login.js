//! Importa la función `Eventos` desde el módulo "./Eventos" para poder mostrarla:
// una vez hayamos iniciado sesión
import Eventos from './Eventos';
import Register, { updateLogoutLinkVisibility } from './Register';

//! Define una función arrow llamada `template` que devuelve un template string:
const template = () => {
  if (localStorage.getItem('user')) {
    // Obtiene el usuario del localStorage
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
//! Define una función asíncrona llamada `loginSubmit` para procesar el envío del formulario de inicio de sesión:
const loginSubmit = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email').value; // Obtiene los valores del email
  const contraseña = document.querySelector('#password').value; // Obtiene los valores de la contraseña de usuario.

  try {
    // Realiza una solicitud a la API para iniciar sesión
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
    console.log('Respuesta recibida:', response);

    // Verifica si la respuesta es exitosa
    if (!response.ok) {
      const errorUser = await response.json();
      throw new Error(errorUser.message || 'Fallo en el inicio de sesión');
    }

    // Convierte la respuesta a formato JSON
    const responseData = await response.json();
    const user = responseData.user;

    // Almacena la información del usuario en el localStorage
    localStorage.setItem('user', JSON.stringify(user));

    // Muestra una alerta de bienvenida con el nombre de usuario
    alert(`¡Excelente! Has iniciado sesión con éxito ${user.nombre}.`);

    // Llama a la función `Books` para actualizar la sección de libros en la página
    Eventos();
  } catch (error) {
    console.log('Error durante el login:', error);
    alert(`Inicio de sesión fallido: ${error.message}`);
  }
};

//! Define una función llamada `Login` que actualiza el contenido de la sección de inicio de sesión en el DOM
const Login = () => {
  updateLogoutLinkVisibility(false);
  document.getElementById('loginlink').style.display = 'none';
  // Selecciona el elemento 'main' en el DOM y asigna el HTML generado por la función `template`
  document.querySelector('main').innerHTML = template();

  if (!localStorage.getItem('user')) {
    document.getElementById('misEventoslink').style.display = 'none';
    // Agrega un event listener al botón de inicio de sesión para procesar el evento de clic
    document
      .querySelector('#login-form')
      .addEventListener('submit', loginSubmit); // Llama a la función `loginSubmit` para procesar el envío del formulario
  }
  document.querySelector('#register-link').addEventListener('click', () => {
    // Llama a la función `Login` para redirigir al usuario a la sección de inicio de sesión
    Register();
  });
};

//! Exporta la función `Login` como el valor predeterminado del módulo
export default Login;
