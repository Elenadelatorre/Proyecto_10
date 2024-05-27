const { isAuth } = require('../controllers/users');
const {
  getEventos,
  getEventoById,
  getAsistentesByEvento,
  postAsistente,
  getEventosConfirmadosByUser,
  postNuevoEvento
} = require('../controllers/eventos');

const eventosRouter = require('express').Router();

eventosRouter.get('/:eventoId/asistentes', getAsistentesByEvento);
eventosRouter.get('/:userId/eventosConfirmados', getEventosConfirmadosByUser);
eventosRouter.get('/:id', getEventoById);
eventosRouter.get('/', getEventos);
eventosRouter.post('/:eventoId/asistencias', postAsistente);
eventosRouter.post('/nuevoEvento', postNuevoEvento);

module.exports = eventosRouter;
