const Evento = require('../models/eventos');
const Asistente = require('../models/asistentes');
const User = require('../models/users');
const multer = require('multer');

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
    console.error('Error al obtener los asistentes:', error);
    res.status(404).json({ message: 'Error al obtener los asistentes', error });
  }
};

// POST para inscribirse en un evento
const postAsistente = async (req, res, next) => {
  try {
    // Verifica si el usuario ya está inscrito en este evento
    const { eventoId } = req.params;
    const { nombre, email } = req.body;

    console.log(`Buscando evento con ID: ${eventoId}`);
    // Verifica si el evento existe:
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Verifica si el usuario existe
    console.log(`Buscando usuario con nombre: ${nombre} y email: ${email}`);
    let user = await User.findOne({ nombre, email });
    if (!user) {
      // Si el usuario no existe, crea uno nuevo (opcional, dependiendo de tu lógica)
      user = new User({ nombre, email });
      await user.save();
    }

    console.log('Verificando si el usuario ya está registrado en este evento');
    // Verifica si el usuario ya está registrado para este evento
    if (user.eventoConfirmado === eventoId) {
      console.log('El usuario ya está registrado para este evento');
      return res
        .status(400)
        .json({ message: 'Ya estás registrado como asistente' });
    }

    console.log('Actualizando evento confirmado del usuario');
    // Actualiza el campo eventoConfirmado del usuario:
    user.eventoConfirmado = eventoId;
    await user.save();

    console.log(
      'Verificando si el asistente ya está registrado para este evento'
    );
    // Verifica si el asistente ya está registrado para este evento
    const asistenteExistente = await Asistente.findOne({
      nombre,
      email,
      eventoConfirmado: eventoId
    });
    if (asistenteExistente) {
      return res
        .status(404)
        .json({ message: 'Asistente ya registrado para este evento' });
    }

    console.log('Creando nuevo asistente y asociándolo al evento');
    // Crea un nuevo asistente y lo asocia al evento
    const nuevoAsistente = new Asistente({
      nombre,
      email,
      eventoConfirmado: eventoId
    });
    await nuevoAsistente.save();

    evento.asistentes.push(nuevoAsistente._id);
    await evento.save();

    console.log('Asistencia confirmada con éxito');
    return res.status(200).json({ message: 'Asistencia confirmada' });
  } catch (error) {
    res.status(404).json({ message: 'Error al agregar asistencia', error });
  }
};
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

    const eventoUpdated = await Juego.findByIdandUpdate(id, newEvento, {
      new: true
    });
    return res.status(200).json(eventoUpdated);
  } catch (error) {
    return res.status(400).json('Error en la solicitud');
  }
};

module.exports = {
  getEventos,
  getEventoById,
  postNuevoEvento,
  getAsistentesByEvento,
  postAsistente,
  getEventosConfirmadosByUser,
  putEvento
};
