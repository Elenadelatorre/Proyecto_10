const { isAuth } = require('../controllers/users');
const {
  getEventos,
  getEventoById,
  getAsistentesByEvento,
  postAsistente,
  getEventosConfirmadosByUser,
  postNuevoEvento,
  putEvento
} = require('../controllers/eventos');
const upload = require('../../middlewares/file');

const eventosRouter = require('express').Router();

eventosRouter.get('/:eventoId/asistentes', getAsistentesByEvento);
eventosRouter.get('/:userId/eventosConfirmados', getEventosConfirmadosByUser);
eventosRouter.get('/:id', getEventoById);
eventosRouter.get('/', getEventos);
eventosRouter.post('/:eventoId/asistencias', postAsistente);
eventosRouter.post('/nuevoEvento', upload.single('img'), postNuevoEvento);
eventosRouter.put('/:id', upload.single('img'), putEvento);

module.exports = eventosRouter;
