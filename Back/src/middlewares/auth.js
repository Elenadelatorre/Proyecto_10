const User = require('../api/models/users');
const jwt = require('jsonwebtoken');
const { verificarLlave } = require('../utils/jwt');

//isUser:
const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    console.log(token);

    const { id } = verificarLlave(token);

    const user = await User.findById(id);

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json('error');
  }
};

//isAdmin:
const isAdmin = async (req, res, next) => {
  if (req.user.rol === 'admin') {
    return next();
  } else {
    return res.status(400).json('No eres Administrador');
  }
};

//Verificar Admin:
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id);
    if (user.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'No estás autorizado' });
  }
};

module.exports = { isAuth, isAdmin, verifyAdmin };
