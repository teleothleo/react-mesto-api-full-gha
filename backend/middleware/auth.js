const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../utils/ErrorUnauthorized');

module.exports = (req, res, next) => {
  console.log('auth.js called', req.headers);
  try {
    const { authorization } = req.headers;
    if (!authorization.startsWith('Bearer')) {
      next(new ErrorUnauthorized('Got wrong credentials'));
      return;
    }
    const token = authorization.split('Bearer ')[1];
    const payload = jwt.verify(token, 'dev-key');
    console.log('auth.js', token);
    req.user = payload;
    next();
  } catch (err) {
    next(new ErrorUnauthorized('Authorization failure'));
  }
};
