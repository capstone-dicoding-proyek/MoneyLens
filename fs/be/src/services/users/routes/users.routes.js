import express from 'express';
import {  resetPasswordPayloadValidator, usersValidator, usersValidatorPut } from '../validator/users.validator.js';
import validate from '../../../middlewares/validate.js';
import { getUserLogged, loginWithGoogle, registerUser, resetPassword, updateFullName } from '../controller/users.controller.js';
import authenticateToken from '../../../middlewares/authenticate-token.js';
import { googleLoginLimiter, registerLimiter } from '../../../middlewares/rate-limiter.js';

const router = express.Router();

router.post('/users', registerLimiter, validate(usersValidator), registerUser);

router.post('/users/reset-password', validate(resetPasswordPayloadValidator), resetPassword);
router.post('/users/google-login', googleLoginLimiter,  loginWithGoogle);
router.get('/users', authenticateToken, getUserLogged);
router.put('/users', authenticateToken, validate(usersValidatorPut), updateFullName);

export default router;
