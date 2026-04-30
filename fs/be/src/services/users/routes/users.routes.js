import express from 'express';
import { resetPasswordPayloadValidator, usersValidator } from '../validator/users.validator.js';
import validate from '../../../middlewares/validate.js';
import { getUserLogged, loginWithGoogle, registerUser, resetPassword } from '../controller/users.controller.js';
import authenticateToken from '../../../middlewares/authenticate-token.js';

const router = express.Router();

router.post('/users', validate(usersValidator), registerUser);

router.post('/users/reset-password', validate(resetPasswordPayloadValidator), resetPassword);
router.post('/users/google-login',  loginWithGoogle);
router.get('/users', authenticateToken, getUserLogged);

export default router;
