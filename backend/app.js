const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bunyan = require('bunyan');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');
const { validateLogin, validateSignUp } = require('./middleware/validation-headers');
const ErrorNotFound = require('./utils/ErrorNotFound');
const { ERROR_CODE_INTERNAL_SERVER_ERROR } = require('./utils/constants');

const { PORT = 3000, URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
app.use(cors());

// Provoking git tests..
// Handling logs
const logDir = path.join(__dirname, 'logs');
const requestLoggerFile = path.join(logDir, 'request.log');
const errorLoggerFile = path.join(logDir, 'error.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
if (!fs.existsSync(requestLoggerFile)) {
  fs.writeFileSync(requestLoggerFile, '');
}
if (!fs.existsSync(errorLoggerFile)) {
  fs.writeFileSync(errorLoggerFile, '');
}

const apiLogger = bunyan.createLogger({
  name: 'Requests logger',
  streams: [{ path: './logs/request.log' }],
});
const errorLogger = bunyan.createLogger({
  name: 'Error logger',
  streams: [{ path: './logs/error.log' }],
});
app.use((req, res, next) => {
  apiLogger.info({
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  });
  next();
});
// End

mongoose.set('strictQuery', false);
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(URL);

app.get('/crash-test', () => {
  errorLogger.error({ error: '/crash-test initialized' });
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateSignUp, createUser);
app.patch('/404', (req, res, next) => {
  errorLogger.error({ error: '/404 route invoked' });
  next(new ErrorNotFound('Lost your way?'));
});

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ERROR_CODE_INTERNAL_SERVER_ERROR, message } = err;
  const errMessage = statusCode === ERROR_CODE_INTERNAL_SERVER_ERROR ? 'Server-side error' : message;
  res.status(statusCode).send({
    message: errMessage,
  });
  errorLogger.error({ error: errMessage });
  next();
});

app.use((err, req, res, next) => {
  errorLogger.error({ error: err });
  next(new ErrorNotFound('Lost your way?'));
});

app.listen(PORT, () => {
  console.log(`Server link: ${URL} & Port: ${PORT}`);
});
