const Asistente = require('../models/asistentes');
const Evento = require('../models/eventos');

//GET asistentes registrados:
const getAllAsistentes = async (req, res, next) => {
  try {
    const asistentes = await Asistente.find().populate('eventoConfirmado');
    return res.status(200).json(asistentes);
  } catch (error) {
    console.log(error);
    return res.status(400).json('Error');
  }
};

//GET asistente específico por id:
const getAsistenteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const asistente = await Asistente.findById(id);
    if (!asistente) {
      return res.status(404).json({ message: 'Asistente no encontrado' });
    }
    return res.status(200).json(asistente);
  } catch (error) {
    console.log(error);
    return res.status(400).json('Error en la solicitud: ' + error.message);
  }
};
// GET asistentes por evento:
const getAsistentesByEvento = async (req, res, next) => {
  try {
    const { eventoId, email } = req.params;
    const asistente = await Asistente.findOne({
      email,
      eventoConfirmado: eventoId
    });
    if (!asistente) {
      return res.status(200).json({ asistente: false });
    }

    res.status(200).json({ asistente: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al verificar la asistencia del usuario' });
  }
};

// GET asistentes por evento:
const getAsistentes = async (req, res, next) => {
  try {
    const eventoId = req.params.eventoId;
    const evento = await Evento.findById(eventoId).populate('asistentes');

    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    const asistentes = evento.asistentes;
    res.status(200).json(asistentes);
  } catch (error) {
    console.error('Error al obtener los asistentes del evento:', error);
    res
      .status(500)
      .json({ message: 'Error al obtener los asistentes del evento' });
  }
};

//PUT asistentes:
const updateAsistente = async (req, res, next) => {
  try {
    const { id } = req.params;

    const oldAsistente = await Asistente.findById(id);
    if (!oldAsistente) {
      return res.status(404).json({ message: 'Asistente no encontrado' });
    }
    Object.assign(oldAsistente, req.body);
    await oldAsistente.save();

    return res.status(200).json(oldAsistente);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Error al actualizar asistente', error });
  }
};
// DELETE un juego por id:
const deleteAsistente = async (req, res, next) => {
  try {
    const { eventoId } = req.params; // Extraer el ID del evento desde los parámetros de la URL

    // Realizar la lógica para buscar y eliminar el asistente asociado al evento
    // Esto puede variar dependiendo de cómo esté estructurada tu base de datos y tu aplicación
    const asistenteDeleted = await Asistente.findOneAndDelete({
      eventoConfirmado: eventoId
    });

    if (!asistenteDeleted) {
      return res.status(404).json({ message: 'Asistente no encontrado' });
    }

    return res
      .status(200)
      .json({ message: 'Asistente eliminado correctamente' });
  } catch (error) {
    console.log(error);
    return res.status(400).json('Error en la solicitud');
  }
};
module.exports = {
  getAllAsistentes,
  getAsistenteById,
  getAsistentesByEvento,
  getAsistentes,
  updateAsistente,
  deleteAsistente
};
