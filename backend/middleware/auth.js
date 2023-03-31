const jwt = require('jsonwebtoken');
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
    next();
  } catch (err) {
    next(new ErrorUnauthorized('Authorization failure'));
  }
};
