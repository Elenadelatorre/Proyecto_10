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

eventosRouter.get('/:eventoId/asistentes',[isAuth], getAsistentesByEvento);
eventosRouter.get('/:userId/eventosConfirmados', getEventosConfirmadosByUser);
eventosRouter.get('/:id', getEventoById);
eventosRouter.get('/', getEventos);
eventosRouter.post('/:eventoId/asistencias', [isAuth],[isAuth], postAsistente);
eventosRouter.post('/nuevoEvento', upload.single('img'),[isAuth], postNuevoEvento);
eventosRouter.put('/:id', upload.single('img'), putEvento);
eventosRouter.delete('/:eventoId/asistencias', [isAuth],deleteAsistente);

module.exports = eventosRouter;
