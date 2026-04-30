import jwt from 'jsonwebtoken';

const TokenManager = {
  generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: '15m'
  }),
  generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: '7d'
  }),
  verifyAcessToken: (token) => {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    return payload;
  },

  verifyRefreshToken: (token) => {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    return payload;
  },
};

export default TokenManager;