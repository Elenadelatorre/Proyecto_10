const mongoose = require('mongoose');

const asistenteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      trim: true
    },
    eventoConfirmado: {
      type: mongoose.Types.ObjectId,
      ref: 'eventos',
      required: false
    }
  },
  {
    timestamps: true,
    collection: 'asistentes'
  }
);

const Asistente = mongoose.model('asistentes', asistenteSchema, 'asistentes');

module.exports = Asistente;
