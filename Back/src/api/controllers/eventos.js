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

//GET evento específico por id:
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

//POST evento
const postNuevoEvento = async (req, res, next) => {
  try {
    const { titulo, fecha, ubicacion, descripcion } = req.body;
    let img = {};

    if (req.file) {
      img = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }
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

// GET asistentes por evento
const getAsistentesByEvento = async (req, res, next) => {
  try {
    const { eventoId } = req.params;
    console.log(eventoId);
    const asistentes = await Asistente.find({ eventoConfirmado: eventoId });
    return res.status(200).json(asistentes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener los asistentes', error });
  }
};

// POST para inscribirse en un evento
const postAsistente = async (req, res, next) => {
  try {
    // Verifica si el usuario ya está inscrito en este evento
    const { eventoId } = req.params;
    const { nombre, email, userId } = req.body;

    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    // Actualiza el campo eventoConfirmado del usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verifica si el usuario ya está registrado para este evento
    if (user.eventoConfirmado.includes(eventoId)) {
      return res
        .status(400)
        .json({ message: 'Ya estás registrado como asistente' });
    }

    // Agrega el ID del evento confirmado al array del usuario
    user.eventoConfirmado.push(eventoId);
    await user.save();

    // Verifica si el asistente ya está registrado para este evento
    const nuevoAsistente = new Asistente({
      nombre,
      email,
      eventoConfirmado: eventoId
    });
    await nuevoAsistente.save();

    evento.asistentes.push(nuevoAsistente._id);
    await evento.save();

    return res.status(200).json({ message: 'Asistencia confirmada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar asistencia', error });
  }
};
module.exports = {
  getEventos,
  getEventoById,
  postNuevoEvento,
  getAsistentesByEvento,
  postAsistente,
  getEventosConfirmadosByUser
};
