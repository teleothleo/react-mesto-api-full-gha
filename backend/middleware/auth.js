const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../utils/ErrorUnauthorized');

module.exports = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      next(new ErrorUnauthorized('Got wrong credentials'));
      return;
    }
    const payload = jwt.verify(token, 'dev-key');
    req.user = payload;
    next();
  } catch (err) {
    next(new ErrorUnauthorized('Authorization failure'));
  }
};
