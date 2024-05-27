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

//PUT asistente:
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

module.exports = {
  getAllAsistentes,
  getAsistenteById,
  updateAsistente
};
