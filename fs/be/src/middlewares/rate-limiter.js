import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import response from '../utils/response';

const createRateLimiter = ({
  prefix,
  windowMs = 3 * 60 * 1000,
  max = 1,
  message = 'Terlalu banyak request, coba lagi nanti',
}) => {
  return rateLimit({
    windowMs,
    max,

    keyGenerator: (req) => {
      return req.user?.id
        ? `${prefix}:${req.user.id}`
        : `${prefix}:${ipKeyGenerator(req.ip)}`;
    },

    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {
      return response(res, 429, message);
    },
  });
};

export const resendLimiter = createRateLimiter({
  prefix: 'resend-email',
  message: 'Tunggu 3 menit sebelum resend email',
});

export const resetPasswordLimiter = createRateLimiter({
  prefix: 'reset-password',
  message: 'Tunggu 3 menit sebelum request reset password',
});