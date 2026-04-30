import { OAuth2Client } from 'google-auth-library';
import { ForbiddenError, InvariantError, NotFoundError } from '../../../exceptions/error.js';
import TokenManager from '../../../security/token-manager.js';
import MailSender from '../../../utils/mail-sender.js';
import response from '../../../utils/response.js';
import AuthenticationsRepository from '../../authentications/repository/authentications.repository.js';
import { UsersRepository } from '../repository/users.repository.js';

const usersRepository = new UsersRepository();
const mailSender = new MailSender();
const authenticationsRepository = new AuthenticationsRepository();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const registerUser = async (req, res, next) => {
  const { email, fullname, password } = req.validated;
  const resultVerify = await usersRepository.verifyNewEmail(email);
  if (resultVerify) {
    return next(new InvariantError('Gagal menambahkan user. Email sudah digunakan.'));
  }
  const result = await usersRepository.createUser({ email, fullname, password, googleID: null });
  if (!result) {
    return next(new InvariantError('User gagal ditambahkan'));
  }
  const token = await authenticationsRepository.createVerifyTokenEmail(result.id);
  await mailSender.sendEmail({ subject: 'Verifikasi email', targetEmail: result.email, token, url: '/auth/verify-email' });

  const accessToken = TokenManager.generateAccessToken({ id: result.id });
  const refreshToken = TokenManager.generateRefreshToken({ id: result.id });
  await authenticationsRepository.addRefreshToken({ userID: result.id, token: refreshToken });

  return response(res, 201, 'User berhasil dibuat, silahkan verifikasi email', {
    userId: result.id,
    accessToken,
    refreshToken,
  });
};

export const resetPassword = async (req, res, next) => {
  const { token, password } = req.validated;

  const userID = await authenticationsRepository.verifyResetTokenCredentialPassword(token);

  const user = await usersRepository.findUser(userID);
  if (!user) {
    return next(new NotFoundError('User tidak ditemukan'));
  }

  if (user.google_id && !user.password) {
    return next(new ForbiddenError('Silakan login dengan Google'));
  }

  await usersRepository.resetPassword({ password, userID });

  await authenticationsRepository.deleteResetTokenPassword(token);

  await authenticationsRepository.deleteAllRefreshToken(userID);

  return response(res, 200, 'Reset password berhasil');
};

export const loginWithGoogle = async (req, res, next) => {
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload?.email || !payload?.sub) {
    return next(new InvariantError('Token Google tidak valid'));
  }

  let user = await usersRepository.findByEmail(payload.email);

  if (!user) {
    user = await usersRepository.createUser({
      email: payload.email,
      fullname: payload.name,
      password: null,
      googleID: payload.sub
    });
    if (!user) {
      return next(new InvariantError('User gagal ditambahkan'));
    }

  } else {
    if (!user.google_id) {
      await usersRepository.linkGoogleAccount({ googleID: payload.sub, userID: user.id });
    }
  }
  if (!user.verified_email) {
    await usersRepository.updateVerifiedEmail(user.id);
  }
  const accessToken = TokenManager.generateAccessToken({ id: user.id });
  const refreshToken = TokenManager.generateRefreshToken({ id: user.id });
  await authenticationsRepository.addRefreshToken({ userID: user.id, token: refreshToken });
  return response(res, 200, 'Login dengan Google berhasil', {
    accessToken,
    refreshToken,
  });
};


// eslint-disable-next-line no-unused-vars
export const getUserLogged = async (req, res, next) => {
  const { id } = req.user;
  const result = await usersRepository.findUser(id);
  // eslint-disable-next-line no-unused-vars
  const { password, ...data } = result;
  return response(res, 200, 'User logged success', { data });
};