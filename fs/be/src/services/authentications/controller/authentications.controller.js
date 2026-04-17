import { AuthenticationError, InvariantError, NotFoundError } from '../../../exceptions/error.js';
import TokenManager from '../../../security/token-manager.js';
import MailSender from '../../../utils/mail-sender.js';
import response from '../../../utils/response.js';
import UsersRepository from '../../users/repository/users.repository.js';
import { AuthenticationsRepository } from '../repository/authentications.repository.js';

const authenticationsRepository = new AuthenticationsRepository();
const usersRepository = new UsersRepository();
const mailSender = new MailSender();

export const verifyEmail = async (req, res, next) => {
  const { token } = req.validated;

  if (!token) next(new InvariantError('Token wajib diisi'));

  const userID = await authenticationsRepository.verifyEmailTokenCredential(token);

  const user = await usersRepository.findUser(userID);

  if (!user)  next(new NotFoundError('User tidak ditemukan'));

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

  await mailSender.sendEmail(user.email, token);

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
  await authenticationsRepository.addRefreshToken({ userID:result.id, token:refreshToken });
  return response(res, 201, 'Authentication berhasil ditambahkan', {
    accessToken,
    refreshToken,
  });
};

export const addRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.validated;
  const result = await authenticationsRepository.verifyRefreshToken(refreshToken);
  if (!result) {
    return next(new InvariantError('Refresh token tidak valid'));
  }

  const { id }  = TokenManager.verifyRefreshToken(result.token);
  const accessToken = TokenManager.generateAccessToken({ id });
  return response(res, 200, 'Access Token berhasil diperbarui', { accessToken });
};

export const logout = async (req, res, next) => {
  const { refreshToken } = req.validated;

  const result = await authenticationsRepository.verifyRefreshToken(refreshToken);

  if (!result) {
    return next(new InvariantError('Refresh token tidak valid'));
  }

  await authenticationsRepository.deleteRefreshToken(refreshToken);

  return response(res, 200, 'Refresh token berhasil dihapus');
};

