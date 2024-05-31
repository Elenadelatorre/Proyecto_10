const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true
    },
    fecha: {
      type: Date,
      trim: true,
      required: [true, 'La fecha es obligatoria']
    },
    ubicacion: {
      type: String,
      required: [true, 'La ubicación es obligatoria']
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
    },
    img: { type: String, required: false },
    asistentes: [
      { type: mongoose.Types.ObjectId, ref: 'asistentes', required: false }
    ]
  },
  {
    timestamps: true,
    collection: 'eventos'
  }
);

eventoSchema.index({ fecha: 1 });
const Evento = mongoose.model('eventos', eventoSchema, 'eventos');

module.exports = Evento;
