require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/db');
const eventosRouter = require('./src/api/routes/eventos');
const asistentesRouter = require('./src/api/routes/asistentes');
const usersRouter = require('./src/api/routes/users');
const cors = require('cors');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

connectDB();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use('/api/v1/eventos', eventosRouter);
app.use('/api/v1/asistentes', asistentesRouter);
app.use('/api/v1/users', usersRouter);

app.use('*', (req, res, next) => {
  return res.status(404).json('Route not found');
});
app.listen(3000, () => {
  console.log('Servidor levantado en:http://localhost:3000 😍');
});
