const Evento = require('../models/eventos');
const Asistente = require('../models/asistentes');
const User = require('../models/users');

//GET eventos disponibles:
const getEventos = async (req, res, next) => {
  try {
    const eventos = await Evento.find();
    return res.status(200).json(eventos);
  } catch (error) {
    console.log(error);
    return res.status(400).json('Error en la solicitud: ' + error.message);
  }
};

//GET evento específico:
const getEventoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findById(id);
    return res.status(200).json(evento);
  } catch (error) {
    console.log(error);
    return res.status(400).json('Error en la solicitud: ' + error.message);
  }
};

// GET eventos confirmados por usuario:
const getEventosConfirmadosByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('eventoConfirmado');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user.eventoConfirmado);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al obtener eventos confirmados', error });
  }
};

//POST nuevo evento:
const postNuevoEvento = async (req, res, next) => {
  try {
    const { titulo, fecha, ubicacion, descripcion, img } = req.body;
    const nuevoEvento = new Evento({
      titulo,
      fecha,
      ubicacion,
      descripcion,
      img
    });

    await nuevoEvento.save();

    res
      .status(200)
      .json({ message: 'Evento creado correctamente', evento: nuevoEvento });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: 'Error al crear el evento', error });
  }
};

// POST para inscribirse en un evento:
const postAsistente = async (req, res, next) => {
  try {
    const { eventoId } = req.params;
    let { nombre, email } = req.body;

    console.log('Datos recibidos:', { eventoId, nombre, email });

    // Verificar si nombre y email están proporcionados
    if (!nombre || !email) {
      // Manejar el caso donde no se proporcionan nombre y email
      return res
        .status(400)
        .json({ message: 'Debe proporcionar nombre y email' });
    }

    // Verificar si hay un usuario autenticado

    let usuarioId = null;
    // Verificar si hay un usuario autenticado
    if (req.user && req.user.id) {
      usuarioId = req.user.id;
    }

    // Crear un nuevo asistente
    const nuevoAsistente = new Asistente({
      nombre,
      email,
      eventoConfirmado: eventoId
    });

    // Guardar el nuevo asistente en la base de datos
    await nuevoAsistente.save();

    console.log('Asistente creado con éxito:', nuevoAsistente);

    // Actualizar el evento con el nuevo asistente
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    evento.asistentes.push(nuevoAsistente._id);
    await evento.save();

    console.log('Asistencia confirmada con éxito');

    return res.status(200).json({ message: 'Asistencia confirmada' });
  } catch (error) {
    console.error('Error al agregar asistencia:', error);
    return res
      .status(500)
      .json({ message: 'Error al agregar asistencia', error });
  }
};

//Modificar evento:
const putEvento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newEvento = new Evento(req.body);
    newEvento._id = id;

    if (neq.file) {
      newEvento.img = req.file.path;

      const oldEvento = await Evento.findById(id);
      deleteFile(oldEvento.img);
    }

    const eventoUpdated = await Juego.findByIdAndUpdate(id, newEvento, {
      new: true
    });
    return res.status(200).json(eventoUpdated);
  } catch (error) {
    return res.status(400).json('Error en la solicitud');
  }
};

// DELETE un evento por id:
const deleteEvento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const eventoDeleted = await Evento.findByIdAndDelete(id);
    deleteFile(eventoDeleted.img);
    res.status(200).json({ message: 'Evento eliminado', eventoDeleted });
  } catch (error) {
    console.log(error);
    return res.status(400).json('Error en la solicitud');
  }
};

module.exports = {
  getEventos,
  getEventoById,
  postNuevoEvento,
  postAsistente,
  getEventosConfirmadosByUser,
  putEvento,
  deleteEvento
};
