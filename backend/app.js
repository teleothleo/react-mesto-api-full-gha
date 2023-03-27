const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');
const { ERROR_CODE_INTERNAL_SERVER_ERROR } = require('./utils/constants');
const { validateLogin, validateSignUp } = require('./middleware/validation-headers');
const ErrorNotFound = require('./utils/ErrorNotFound');

const { PORT = 3000, URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
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

app.use((req, res, next) => {
  next(new ErrorNotFound('Lost your way?'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ERROR_CODE_INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message: statusCode === ERROR_CODE_INTERNAL_SERVER_ERROR ? 'Server-side error' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Server link: ${URL} & Port: ${PORT}`);
});
