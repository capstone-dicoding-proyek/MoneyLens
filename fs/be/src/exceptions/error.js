import { ClientError } from './client-error.js';


class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}
class ForbiddenError extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}
class PlayloadError extends ClientError {
  constructor(message) {
    super(message, 413);
    this.name = 'PlayloadError';
  }
}

class ConflictError extends ClientError {
  constructor(message) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}
export { ForbiddenError, ConflictError, NotFoundError, InvariantError, AuthenticationError, PlayloadError };