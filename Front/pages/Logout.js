// Importa la función Login desde el módulo "./Login" para redirigir al usuario a la página de inicio de sesión después de cerrar sesión
import Login from './Login';

//! Define una función llamada `Logout` para cerrar sesión del usuario
const Logout = () => {
  // Elimina la información del usuario del localStorage
  localStorage.removeItem('user');

  // Muestra una alerta indicando que el usuario ha cerrado sesión
  alert('Has cerrado sesión exitosamente. ¡Nos vemos pronto!');

  // Llama a la función Login para redirigir al usuario a la página de inicio de sesión
  Login();
};

//! Exporta la función `Logout` como el valor predeterminado del módulo
export default Logout;