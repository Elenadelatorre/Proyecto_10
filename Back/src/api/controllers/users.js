const User = require('../models/users');
const { generarLlave, verificarLlave } = require('../../utils/jwt');
const bcrypt = require('bcrypt');

//REGISTER:
const register = async (req, res, next) => {
  try {
    const newUser = new User({
      nombre: req.body.nombre,
      email: req.body.email,
      contraseña: req.body.contraseña,
      eventoConfirmado: req.body.eventoConfirmado,
      rol: 'user'
    });

    const userDuplicated = await User.findOne({ email: req.body.email });
    if (userDuplicated) {
      return res.status(400).json('El usuario ya existe');
    }

    const userSaved = await newUser.save();
    return res.status(201).json(userSaved);
  } catch (error) {
    console.log(error);
    return res.status(400).json('Error al registrar al usuario', error);
  }
};

//LOGIN
const login = async (req, res, next) => {
  try {
    const { email, contraseña } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json('Usuario o contraseña incorrectos');
    }

    if (bcrypt.compareSync(contraseña, user.contraseña)) {
      const token = generarLlave(user._id);
      return res.status(200).json({ token, user });
    }

    return res.status(400).json('Usuario o contraseña incorrectos');
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'Error al iniciar sesión', error });
  }
};

//isUser:
const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const parsedToken = token.replace('Bearer ', '');
    const { id } = verificarLlave(parsedToken);
    const user = await User.findById(id);

    user.password = null;
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json('No estás autorizado');
  }
};

module.exports = { register, login, isAuth };
