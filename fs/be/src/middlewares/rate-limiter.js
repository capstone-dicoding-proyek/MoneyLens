import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import response from '../utils/response.js';

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

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { status: 'fail', message: 'Too many login attempts, try again in 15 minutes' }
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { status: 'fail', message: 'Too many register attempts, try again in 1 hour' }
});

export const googleLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: 'fail', message: 'Too many requests, try again in 15 minutes' }
});

export const transactionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { status: 'fail', message: 'Too many requests, slow down!' }
});


export const uploadOcrLimiter = createRateLimiter({
  prefix: 'upload-ocr',
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Tunggu 1 jam sebelum upload lagi',
});