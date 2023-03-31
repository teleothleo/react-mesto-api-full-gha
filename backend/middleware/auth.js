require('dotenv').config();
const jwt = require('jsonwebtoken');
const { errorLogger } = require('../app');
const ErrorUnauthorized = require('../utils/ErrorUnauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization.startsWith('Bearer')) {
      console.log('auth.js Bearer check: ', req.headers.authorization);
      next(new ErrorUnauthorized('Got wrong credentials'));
      return;
    }
    // console.log('auth.js: ', req.headers);
    const token = authorization.split('Bearer ')[1];
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    // console.log('auth.js', token);
    req.user = payload;
    this.requestLogger.info({
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    });
    next();
  } catch (err) {
    errorLogger.error({
      error: '/404 route invoked',
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    });
    next(new ErrorUnauthorized('Authorization failure'));
  }
};
