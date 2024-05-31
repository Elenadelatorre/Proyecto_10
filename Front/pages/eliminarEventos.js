//! Crear una función para eliminar un evento:
const eliminarEvento = async (eventoId) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  if (!currentUser || currentUser.rol !== 'admin') {
    alert('No tienes permiso para eliminar eventos.');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/eventos/${eventoId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error al eliminar el evento');
    }

    const responseData = await response.json();
    alert(responseData.message || 'Evento eliminado correctamente');
    await getEventos();
  } catch (error) {
    console.error('Error al eliminar el evento:', error);
    alert('Hubo un error al eliminar el evento');
  }
};

export default eliminarEvento;
