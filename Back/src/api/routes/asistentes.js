const {
  getAllAsistentes,
  getAsistenteById,
  getAsistentesByEvento
} = require('../controllers/asistentes');

const asistentesRouter = require('express').Router();

asistentesRouter.get('/:id', getAsistenteById);
asistentesRouter.get('/:eventoId/asistentes', getAsistentesByEvento);
asistentesRouter.get('/', getAllAsistentes);

module.exports = asistentesRouter;
