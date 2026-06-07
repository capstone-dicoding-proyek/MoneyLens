import { authenticationsRepository, mailSender, usersRepository } from '../../../container.js';
import { AuthenticationError, InvariantError, NotFoundError } from '../../../exceptions/error.js';
import TokenManager from '../../../security/token-manager.js';
import response from '../../../utils/response.js';




export const verifyEmail = async (req, res, next) => {
  const { token } = req.validated;

  if (!token) next(new InvariantError('Token wajib diisi'));

  const userID = await authenticationsRepository.verifyEmailTokenCredential(token);

  const user = await usersRepository.findUser(userID);

  if (!user) next(new NotFoundError('User tidak ditemukan'));

  if (user.verified_email) return response(res, 200, 'Email sudah diverifikasi');

  await usersRepository.updateVerifiedEmail(userID);

  await authenticationsRepository.deleteVerifyTokenEmail(token);

  return response(res, 200, 'Verifikasi email berhasil');
};

export const resendVerifyEmail = async (req, res, next) => {
  const { id } = req.user;

  const user = await usersRepository.findUser(id);

  if (!user) return next(new NotFoundError('User not found'));

  if (user.verified_email) return next(new InvariantError('Sudah diverifikasi'));

  const token = await authenticationsRepository.createVerifyTokenEmail(id);

  await mailSender.sendEmail({ subject: 'Verifikasi email', targetEmail: user.email, token, url: '/auth/verify-email' });

  return response(res, 200, 'Verifikasi email dikirim');
};


export const login = async (req, res, next) => {
  const { email, password } = req.validated;

  const result = await authenticationsRepository.verifyUserCredential({ email, password });
  if (!result) {
    return next(new AuthenticationError('Kredensial yang Anda berikan salah'));
  }

  const accessToken = TokenManager.generateAccessToken({ id: result.id });
  const refreshToken = TokenManager.generateRefreshToken({ id: result.id });
  await authenticationsRepository.addRefreshToken({ userID: result.id, token: refreshToken });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return response(res, 200, 'Login berhasil', {
    accessToken,
  });
};

export const addRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.validated;
  const result = await authenticationsRepository.verifyRefreshToken(refreshToken);
  if (!result) {
    return next(new InvariantError('Refresh token tidak valid'));
  }

  const { id } = TokenManager.verifyRefreshToken(result.token);
  const accessToken = TokenManager.generateAccessToken({ id });
  return response(res, 200, 'Access Token berhasil diperbarui', { accessToken });
};

// eslint-disable-next-line no-unused-vars
export const logout = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  await authenticationsRepository.deleteRefreshToken(refreshToken);
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  return response(res, 200, 'Refresh token berhasil dihapus');
};



// eslint-disable-next-line no-unused-vars
export const sendResetPassword = async (req, res, next) => {
  const { email } = req.validated;

  const user = await usersRepository.findByEmail(email);
  if (user) {
    const isGoogleOnly = user.google_id && !user.password;

    if (isGoogleOnly) {
      await mailSender.sendEmail({
        subject: 'Info Akun',
        targetEmail: email,
        type: 'google_only_account',
        url: '/login',
      });
    } else {
      const token = await authenticationsRepository.createResetTokenPassword(user.id);
      await mailSender.sendEmail({
        subject: 'Reset password',
        type: 'reset_password',
        targetEmail: email,
        token,
        url: '/auth/verif-reset-token',
      });
    }
  }
  return response(res, 200, 'Jika email terdaftar, link reset akan dikirim');
};


