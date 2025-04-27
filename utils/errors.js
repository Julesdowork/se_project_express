const INVALID_DATA_ERROR = 400;
const UNAUTHORIZED_ERROR = 401;
const FORBIDDEN_ERROR = 403;
const NOT_FOUND_ERROR = 404;
const CONFLICT_ERROR = 409;
const DEFAULT_ERROR = 500;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

module.exports = {
  INVALID_DATA_ERROR,
  UNAUTHORIZED_ERROR,
  FORBIDDEN_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  DEFAULT_ERROR,
  ValidationError,
  UnauthorizedError,
};
