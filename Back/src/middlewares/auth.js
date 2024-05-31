const User = require('../api/models/users');
const jwt = require('jsonwebtoken');
const { verificarLlave } = require('../utils/jwt');

//isUser:
const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ message: 'No estás autorizado. Debe iniciar sesión.' });
    }
    const parsedToken = token.replace('Bearer ', '');
    const { id } = verificarLlave(parsedToken);

    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    user.password = null;
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json('No estás autorizado');
  }
};

//isAdmin:
const isAdmin = async (req, res, next) => {
  await authenticateUser(req, res, async () => {
    if (req.user.rol === 'admin') {
      return next();
    } else {
      return res.status(400).json('No eres Administrador');
    }
  });
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
