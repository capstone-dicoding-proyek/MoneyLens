import { InvariantError } from '../../../exceptions/error.js';
import response from '../../../utils/response.js';
import { UsersRepository } from '../repository/users.repository.js';

const usersRepository = new UsersRepository();

export const registerUser = async (req, res, next) => {
  const { email, fullname, password } = req.validated;
  const resultVerify = await usersRepository.verifyNewEmail(email);
  if (resultVerify) {
    return next(new InvariantError('Gagal menambahkan user. Email sudah digunakan.'));
  }
  const result = await usersRepository.createUser({ email, fullname, password, googleID :null });
  if (!result) {
    return next(new InvariantError('User gagal ditambahkan'));
  }

  return response(res, 201, 'User berhasil dibuat, silahkan verifikasi email', { userId:  result.id  });
};