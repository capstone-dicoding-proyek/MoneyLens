import { ClientError } from '../exceptions/client-error.js';
import response from '../utils/response.js';

// eslint-disable-next-line no-unused-vars
const ErrorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return response(res, err.statusCode, err.message, null);
  }
  if (err.isJoi) {
    return response(res, 400, err.details[0].message, null);
  }
  const status = err.statusCode || err.status || 500;

  console.error('Unhandled error:', err);

  if (process.env.NODE_ENV === 'production') {
    const message = status >= 500
      ? 'Terjadi kesalahan pada server, silakan coba beberapa saat lagi'
      : (err.message || 'Permintaan gagal diproses');
    return response(res, status, message, null);
  }

  const message = err.message || 'Internal Server Error';
  return response(res, status, message, null);
};

export default ErrorHandler;