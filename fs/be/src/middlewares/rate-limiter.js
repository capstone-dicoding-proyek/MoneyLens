import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import response from '../utils/response.js';

export const resendLimiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 1,

  keyGenerator: (req) => {
    return req.user?.id
      ? `resend-email:${req.user.id}`
      : ipKeyGenerator(req.ip);
  },
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    return response(res, 429, 'Tunggu 3 menit sebelum resend email');
  },
});