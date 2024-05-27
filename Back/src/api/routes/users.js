const { register, login, isAuth } = require('../controllers/users');

const usersRouter = require('express').Router();

usersRouter.post('/register', register);
usersRouter.post('/login', login);

module.exports = usersRouter;
