
import Joi from 'joi';
export const tokenValidator = Joi.object({
  token: Joi.string().required(),
});

export const authenticationPayloadValidatorPost = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const authenticationPayloadValidatorPut = Joi.object({
  refreshToken: Joi.string().required(),
});

export const authenticationPayloadValidatorDelete = Joi.object({
  refreshToken: Joi.string().required(),
});

export const resendResetTokenPasswordPayloadValidatorPost = Joi.object({
  email: Joi.string().email().required(),
});