require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/db');
const eventosRouter = require('./src/api/routes/eventos');
const asistentesRouter = require('./src/api/routes/asistentes');
const usersRouter = require('./src/api/routes/users');

const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use('/api/v1/eventos', eventosRouter);
app.use('/api/v1/asistentes', asistentesRouter);
app.use('/api/v1/users', usersRouter);

app.use('*', (req, res, next) => {
  return res.status(404).json('Route not found');
});
app.listen(3000, () => {
  console.log('Servidor levantado en:http://localhost:3000 😍');
});
