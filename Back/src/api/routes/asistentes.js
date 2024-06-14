const {
  getAllAsistentes,
  getAsistenteById,
  getAsistentesByEvento,
  getAsistentesByEventoId,
  getAsistentes
} = require('../controllers/asistentes');

const asistentesRouter = require('express').Router();

asistentesRouter.get('/:id', getAsistenteById);
asistentesRouter.get('/:eventoId/asistencias/:email', getAsistentesByEvento);
asistentesRouter.get('/:eventoId/asistentes', getAsistentes);
asistentesRouter.get('/', getAllAsistentes);


module.exports = asistentesRouter;
