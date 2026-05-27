
import Joi from 'joi';
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

export const usersValidator = Joi.object({
  email: Joi.string()
    .email({
      tlds: { allow: false },
    })
    .max(254)
    .required()
    .messages({
      'string.email': 'Email tidak valid',
      'string.empty': 'Email wajib diisi',
      'any.required': 'Email wajib diisi',
    }),

  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      'string.pattern.base':
        'Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, angka, dan simbol (!@#$%^&*)',
      'string.empty': 'Password wajib diisi',
      'any.required': 'Password wajib diisi',
    }),

  fullname: Joi.string()
    .min(4)
    .max(50)
    .pattern(/^[a-zA-Z\s.'-]+$/)
    .required()
    .messages({
      'string.min': 'Nama minimal 4 karakter',
      'string.max': 'Nama maksimal 50 karakter',
      'string.pattern.base':
        'Nama hanya boleh berisi huruf, spasi, titik, petik, dan tanda minus',
      'string.empty': 'Nama wajib diisi',
      'any.required': 'Nama wajib diisi',
    }),
});

export const usersValidatorPut = Joi.object({
  fullname: Joi.string()
    .min(4)
    .max(50)
    .pattern(/^[a-zA-Z\s.'-]+$/)
    .required()
    .messages({
      'string.min': 'Nama minimal 4 karakter',
      'string.max': 'Nama maksimal 50 karakter',
      'string.pattern.base':
        'Nama hanya boleh berisi huruf, spasi, titik, petik, dan tanda minus',
      'string.empty': 'Nama wajib diisi',
      'any.required': 'Nama wajib diisi',
    }),
});
export const resetPasswordPayloadValidator = Joi.object({
  token: Joi.string().required(),
  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      'string.pattern.base':
        'Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, angka, dan simbol (!@#$%^&*)',
      'string.empty': 'Password wajib diisi',
      'any.required': 'Password wajib diisi',
    }),
});
