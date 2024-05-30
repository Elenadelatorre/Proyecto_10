const { isAuth } = require('../../middlewares/auth');
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
const { deleteAsistente } = require('../controllers/asistentes');

const eventosRouter = require('express').Router();

eventosRouter.get('/:eventoId/asistentes', getAsistentesByEvento);
eventosRouter.get('/:userId/eventosConfirmados', getEventosConfirmadosByUser);
eventosRouter.get('/:id', getEventoById);
eventosRouter.get('/', getEventos);
eventosRouter.post('/:eventoId/asistencias', postAsistente);
eventosRouter.post('/nuevoEvento', upload.single('img'), postNuevoEvento);
eventosRouter.put('/:id', upload.single('img'), putEvento);
eventosRouter.delete('/:eventoId/asistencias', deleteAsistente);

module.exports = eventosRouter;
