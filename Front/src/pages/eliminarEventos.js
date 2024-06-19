//! Crear una función para eliminar un evento:
const eliminarEvento = async (eventoId) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  if (!currentUser || currentUser.rol !== 'admin') {
    console.log('Error', error);
    return;
  }
  const fetchData = async (url, data, method) => {
    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la solicitud');
      }

      return response.json();
    } catch (error) {
      console.error('Error en la llamada fetch:', error);
      throw error;
    }
  };
  try {
    await fetchData(`http://localhost:3000/api/v1/eventos/${eventoId}`, 'DELETE');

    if (!response.ok) {
      throw new Error('Error al eliminar el evento');
    }

    await getEventos();
  } catch (error) {
    console.error('Error al eliminar el evento:', error);
  }
};

export default eliminarEvento;
