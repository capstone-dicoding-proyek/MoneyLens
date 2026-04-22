import express from 'express';
import { resetPasswordPayloadValidator, usersValidator } from '../validator/users.validator.js';
import validate from '../../../middlewares/validate.js';
import { registerUser, resetPassword } from '../controller/users.controller.js';

const router = express.Router();

router.post('/users', validate(usersValidator), registerUser);

router.post('/users/reset-password', validate(resetPasswordPayloadValidator), resetPassword);

export default router;
