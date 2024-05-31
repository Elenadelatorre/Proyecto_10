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
    return res.status(400).json('Error');
  }
};
// GET asistentes por evento:
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
    console.log(`Buscando evento con ID: ${eventoId}`);

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
  updateAsistente,
  deleteAsistente
};
