import jwt from 'jsonwebtoken';
import { InvariantError } from '../exceptions/error.js';

const TokenManager = {
  generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: '15m'
  }),
  generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: '7d'
  }),
  verifyAcessToken:(token)=>{
    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      return payload;
    } catch (error) {
      console.log(error);
      return new InvariantError('Access token tidak valid');
    }
  },

  verifyRefreshToken: (token) => {
    try {
      const payload = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      return payload;
    } catch (error) {
      console.log(error);

      return new InvariantError('Refresh token tidak valid');
    }
  }
};

export default TokenManager;