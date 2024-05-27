const {
  getAllAsistentes,
  getAsistenteById
} = require('../controllers/asistentes');
const { isAuth } = require('../controllers/users');

const asistentesRouter = require('express').Router();

asistentesRouter.get('/:id', getAsistenteById);
asistentesRouter.get('/', getAllAsistentes);

module.exports = asistentesRouter;
