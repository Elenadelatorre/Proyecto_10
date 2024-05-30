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
      autocomplete:"current-password",
      minlength: [8, 'Mínimo 8 caracteres']
    },
    eventoConfirmado: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'eventos',
        required: false
      }
    ],
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
userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('contraseña') || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.contraseña = await bcrypt.hash(this.contraseña, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});
const User = mongoose.model('users', userSchema, 'users');

module.exports = User;
