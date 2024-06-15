import { showAlert } from '../alert/alert';
import Login from './Login';

//! Crear una función llamada 'Logout' para cerrar sesión del usuario:
const Logout = () => {
  // Elimina la información del usuario del localStorage:
  localStorage.removeItem('user');

  showAlert('Sesión cerrada exitosamente', 'success');

  // Llamar a la función 'Login' para redirigir al usuario a la página de inicio de sesión después de cerrar sesión:
  Login();
};

export default Logout;
