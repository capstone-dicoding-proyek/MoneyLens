import { usersRepository } from '../container.js';
import { ForbiddenError } from '../exceptions/error.js';


const VerifyVerifiedEmail = async (req, res, next) => {
  const { id } = req.user;
  const result = await usersRepository.findUser(id);
  if (!result) return next(new ForbiddenError('User tidak ditemukan'));

  if (!result.verified_email) return next(new ForbiddenError('Verifikasi email dulu'));
  next();
};

export default VerifyVerifiedEmail;