const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const bunyan = require('bunyan');
const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');
const { ERROR_CODE_INTERNAL_SERVER_ERROR } = require('./utils/constants');
const { validateLogin, validateSignUp } = require('./middleware/validation-headers');
const ErrorNotFound = require('./utils/ErrorNotFound');

const { PORT = 3000, URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

const apiLogger = bunyan.createLogger({
  name: 'API requests logger',
  streams: [{ path: './logs/api_requests.log' }],
});
const errorLogger = bunyan.createLogger({
  name: 'Error logger',
  streams: [{ path: './logs/errors.log' }],
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

mongoose.set('strictQuery', false);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

mongoose.connect(URL);

app.post('/signin', validateLogin, login);
app.post('/signup', validateSignUp, createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((err, req, res, next) => {
  console.error(err);
  errorLogger.error({ error: err });
  next(new ErrorNotFound('Lost your way?'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ERROR_CODE_INTERNAL_SERVER_ERROR, message } = err;
  errorLogger.error({ error: err.message });
  res.status(statusCode).send({
    message: statusCode === ERROR_CODE_INTERNAL_SERVER_ERROR ? 'Server-side error' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Server link: ${URL} & Port: ${PORT}`);
});
