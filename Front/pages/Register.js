import Login from './Login';

//! Crear una función llamada 'template' para actualizar los elementos del DOM para esta sección:
const template = () => `
  <section id="register">
    <h2>Registro</h2>
    <form id="register-form" class="form">
      <label for="nombre">Nombre de usuario</label>
      <input type="text" placeholder="Nombre completo" id="nombre" name="nombre" required/>

      <label for="email">Correo electrónico</label>
      <input type="email" placeholder="Correo electrónico" id="email" name="email" required/>

      <div id="rol-container" style="display: none;">
        <label for="rol">Rol:</label>
        <select id="rol" name="rol">
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <label for="password">Contraseña</label>
      <input type="password" id="password" placeholder="Contraseña" name="password" required/>
      <span id="password-help" style="color: #666; font-size: 0.8rem;">La contraseña debe tener al menos 8 caracteres.</span><br>
      <p  class="link">¿Tienes una cuenta? <a id="login-link" href="#">Entrar</a></p>

      <button type="submit" id="registerbtn">Registrarse</button>
    </form>
  </section>
`;

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
    alert(
      'Por favor asegúrate de que la contraseña tenga al menos 8 caracteres.'
    );
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

    alert(
      `Genial ${nombre}, te has registrado con éxito. Por favor, inicia sesión con tus credenciales.`
    );

    // Llama a la función 'Login' para redirigir al usuario a la sección de inicio de sesión cuando se haya registrado:
    Login();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};

//! Crear una función llamada 'Register' que actualiza el contenido de la sección de registro en el DOM:
const Register = () => {
  //Actualizar la visibilidad del enlace de cierre de sesión:
  updateLogoutLinkVisibility(false);

  document.querySelector('main').innerHTML = template();

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
