import { ForbiddenError } from '../exceptions/error.js';
import UsersRepository from '../services/users/repository/users.repository.js';

const usersRepository = new UsersRepository();
const VerifyVerifiedEmail = async (req, res, next) => {
  const { id } = req.user;
  const result = await usersRepository.findUser(id);
  if (!result.verified_email) return next(new ForbiddenError('Verifikasi email dulu'));
  next();
};

export default VerifyVerifiedEmail;