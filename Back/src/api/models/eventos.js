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
      required: [true, 'La descripción es obligatoria']
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
    },
    img: { data: Buffer, contentType: String },
    asistentes: [
      { type: mongoose.Types.ObjectId, ref: 'asistentes', required: false }
    ]
  },
  {
    timestamps: true,
    collection: 'eventos'
  }
);
const Evento = mongoose.model('eventos', eventoSchema, 'eventos');

module.exports = Evento;
