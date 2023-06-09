const { ERROR_CODE_NOT_FOUND } = require('./constants');

module.exports = class ErrorNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_NOT_FOUND;
  }
};
