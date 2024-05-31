const jwt = require('jsonwebtoken');

const generarLlave = (id) => {
  if (!process.env.SECRET_KEY) {
    console.error('SECRET_KEY no está definida en las variables de entorno');
  }
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1y' });
};

const verificarLlave = (token) => {
  console.log(token);
  if (!process.env.SECRET_KEY) {
    console.error('SECRET_KEY no está definida en las variables de entorno');
  }
  return jwt.verify(token, process.env.SECRET_KEY);
};

module.exports = { generarLlave, verificarLlave };
