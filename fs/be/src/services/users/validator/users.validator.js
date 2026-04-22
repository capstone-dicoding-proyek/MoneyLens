
import Joi from 'joi';
export const usersValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  fullname: Joi.string().required(),
});

export const resetPasswordPayloadValidator = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});
