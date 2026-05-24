
import Joi from 'joi';
export const usersValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  fullname: Joi.string().min(4).required().max(24),
});

export const usersValidatorPut = Joi.object({
  fullname: Joi.string().min(4).required().max(24),
});

export const resetPasswordPayloadValidator = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

// export const loginWithGoogleValidator = Joi.object({
//   token: Joi.string().required(),
// });
