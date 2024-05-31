const { isAuth, isAdmin } = require('../../middlewares/auth');
const {
  getEventos,
  getEventoById,
  postAsistente,
  getEventosConfirmadosByUser,
  postNuevoEvento,
  putEvento,
  deleteEvento
} = require('../controllers/eventos');
const upload = require('../../middlewares/file');
const { deleteAsistente } = require('../controllers/asistentes');

const eventosRouter = require('express').Router();

eventosRouter.get(
  '/:userId/eventosConfirmados',
  [isAuth],
  getEventosConfirmadosByUser
);
eventosRouter.get('/:id', getEventoById);
eventosRouter.get('/', getEventos);
eventosRouter.post('/:eventoId/asistencias', postAsistente);
eventosRouter.post('/nuevoEvento', upload.single('img'), postNuevoEvento);
eventosRouter.put('/:id', upload.single('img'), putEvento);
eventosRouter.delete('/:eventoId/asistencias', [isAdmin], deleteAsistente);
eventosRouter.delete('/:eventoId', [isAdmin], deleteEvento);

module.exports = eventosRouter;
