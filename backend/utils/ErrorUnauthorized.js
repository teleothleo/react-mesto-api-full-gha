const { ERROR_CODE_UNAUTHORIZED } = require('./constants');

module.exports = class ErrorUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_UNAUTHORIZED;
  }
};
