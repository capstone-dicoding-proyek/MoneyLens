import { InvariantError } from '../../../exceptions/error.js';
import TokenManager from '../../../security/token-manager.js';
import MailSender from '../../../utils/mail-sender.js';
import response from '../../../utils/response.js';
import AuthenticationsRepository from '../../authentications/repository/authentications.repository.js';
import { UsersRepository } from '../repository/users.repository.js';

const usersRepository = new UsersRepository();
const mailSender = new MailSender();
const authenticationsRepository = new AuthenticationsRepository();


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
  await mailSender.sendEmail(result.email, token);

  const accessToken = TokenManager.generateAccessToken({ id: result.id });
  const refreshToken = TokenManager.generateRefreshToken({ id: result.id });
  await authenticationsRepository.addRefreshToken({ userID:result.id, token:refreshToken });

  return response(res, 201, 'User berhasil dibuat, silahkan verifikasi email', {
    userId: result.id,
    accessToken,
    refreshToken,
  });
};