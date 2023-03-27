const { ERROR_CODE_BAD_REQUEST } = require('./constants');

module.exports = class ErrorBadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_BAD_REQUEST;
  }
};
