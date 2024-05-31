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
    const { nombre, email } = req.body;

    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    console.log(`Buscando usuario con nombre: ${nombre} y email: ${email}`);
    let user = await User.findOne({ nombre, email });
    if (!user) {
      user = new User({ nombre, email });
      await user.save();
    }

 
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
