//isUser:
const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    
    if (!token) {
      return res
        .status(401)
        .json({ message: 'No autorizado. Debe iniciar sesión.' });
    }
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

module.exports = { isAuth };