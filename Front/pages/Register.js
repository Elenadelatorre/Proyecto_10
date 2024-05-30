//! Importa la función `Login` desde el módulo "./Login":
// para mostrarla una vez registremos un nuevo usuario
import Login from './Login';

//! Define una arrow function llamada `template` que devuelve una template string:
const template = () => `
  <section id="register">
    <h2>Registro</h2>
    <form id="register-form" class="form">
      <label for="nombre">Nombre de usuario</label>
      <input type="text" placeholder="Nombre" id="nombre" name="nombre" required/>

      <label for="email">Correo electrónico</label>
      <input type="email" placeholder="Correo electrónico" id="email" name="email" required/>

      <label for="password">Contraseña</label>
      <input type="password" id="password" placeholder="Contraseña" name="password" required/>
      <span id="password-help" style="color: #666; font-size: 0.8rem;">La contraseña debe tener al menos 8 caracteres.</span><br>
      <p  class="link">¿Tienes una cuenta? <a id="login-link" href="#">Entrar</a></p>

      <button type="submit" id="registerbtn">Registrarse</button>
    </form>
  </section>
`;

// Función para actualizar la visibilidad del enlace de cerrar sesión
export const updateLogoutLinkVisibility = (isVisible) => {
  const logoutLink = document.querySelector('#logoutlink');
  if (logoutLink) {
    logoutLink.style.display = isVisible ? 'block' : 'none';
  }
};

//! Define una función asíncrona llamada `registerSubmit` para procesar el envío del formulario de registro
const registerSubmit = async (event) => {
  event.preventDefault(); // Evita la recarga de la página por defecto

  const nombre = document.querySelector('#nombre').value; //Obtiene el valor del nombre.
  const email = document.querySelector('#email').value;
  const contraseña = document.querySelector('#password').value; //Obtiene el valor de la contraseña.

  // Verifica si alguno de los campos está vacío o si la contraseña no tiene al menos 8 caracteres
  if (!nombre || !email || !contraseña || contraseña.length < 8) {
    alert(
      'Por favor asegúrate de que la contraseña tenga al menos 8 caracteres.'
    );
    return; // Detiene la ejecución de la función
  }

  try {
    // Realiza una solicitud a la API para registrar un nuevo usuario
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
          contraseña: contraseña
        })
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el registro');
    }
    // Muestra una alerta indicando que el registro fue exitoso y anima al usuario a iniciar sesión
    alert(
      `Genial ${nombre}, te has registrado con éxito. Por favor, inicia sesión con tus credenciales.`
    );

    // Llama a la función `Login` para redirigir al usuario a la sección de inicio de sesión
    Login();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};

//! Define una función llamada `Register` que actualiza el contenido de la sección de registro en el DOM:
const Register = () => {
  updateLogoutLinkVisibility(false);
  // Selecciona el elemento 'main' en el DOM y asigna el HTML generado por la función `template`
  document.querySelector('main').innerHTML = template();

  // Agrega un event listener al formulario para procesar el evento de envío
  document
    .querySelector('#register-form')
    .addEventListener('submit', registerSubmit); // Llama a la función `registerSubmit` para procesar el envío del formulario

  document.querySelector('#login-link').addEventListener('click', () => {
    // Llama a la función `Login` para redirigir al usuario a la sección de inicio de sesión
    Login();
  });
};

//! Exporta la función `Register` como el valor predeterminado del módulo
export default Register;
