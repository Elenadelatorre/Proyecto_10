const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: {
      type: String,
      trim: true,
      required: true
    },
    contraseña: {
      type: String,
      trim: true,
      required: true,
      minlength: [8, 'Mínimo 8 caracteres']
    },
    eventoConfirmado: [{
      type: mongoose.Types.ObjectId,
      ref: 'eventos',
      required: false
    }],
    rol: {
      type: String,
      required: true,
      default: 'user',
      enum: ['admin', 'user']
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);
userSchema.pre('save', function () {
  this.contraseña = bcrypt.hashSync(this.contraseña, 10);
});
const User = mongoose.model('users', userSchema, 'users');

module.exports = User;
