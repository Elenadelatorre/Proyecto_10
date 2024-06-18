import './alert.css';
document.addEventListener('DOMContentLoaded', () => {
  // Crear el contenedor de la alerta
  const alertContainer = document.createElement('div');
  alertContainer.id = 'alert-container';
  alertContainer.className = 'alert-container';
  alertContainer.style.display = 'none';

  // Crear el mensaje de la alerta
  const alertMessage = document.createElement('span');
  alertMessage.id = 'alert-message';
  alertMessage.className = 'alert-message';

  // Crear el botón de cerrar
  const closeAlertBtn = document.createElement('button');
  closeAlertBtn.id = 'close-alert-btn';
  closeAlertBtn.className = 'close-alert-btn';
  closeAlertBtn.innerHTML = '&times;';

  // Añadir el mensaje y el botón al contenedor
  alertContainer.appendChild(alertMessage);
  alertContainer.appendChild(closeAlertBtn);

  // Añadir el contenedor de la alerta al cuerpo del documento
  document.body.appendChild(alertContainer);

  // Evento para cerrar la alerta
  closeAlertBtn.addEventListener('click', () => {
    alertContainer.style.display = 'none';
  });
});

// Función para mostrar la alerta
export const showAlert = (message, type = 'default', duration = 4000) => {
  const alertContainer = document.getElementById('alert-container');
  const alertMessage = document.getElementById('alert-message');

  alertMessage.textContent = message;
  switch (type) {
    case 'success':
      alertContainer.classList.remove('error');
      alertContainer.classList.add('success'); 
      break;
    case 'error':
      alertContainer.classList.remove('success');
      alertContainer.classList.add('error'); 
      break;
  }
  alertContainer.style.display = 'flex';

  // Cerrar la alerta después de un tiempo
  setTimeout(() => {
    alertContainer.style.display = 'none';
  }, duration);
};
