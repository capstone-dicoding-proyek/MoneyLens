import { AuthenticationError } from '../exceptions/error.js';
import TokenManager from '../security/token-manager.js';

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('no bearer');
      return next(new AuthenticationError('Token tidak ditemukan'));
    }

    const token = authHeader.split(' ')[1];

    const user = TokenManager.verifyAcessToken(token);

    req.user = user;
    return next();
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return next(new AuthenticationError('Token tidak valid'));
  }
}

export default authenticateToken;