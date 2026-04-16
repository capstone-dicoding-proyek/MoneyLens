import express from 'express';
import { usersValidator } from '../validator/users.validator.js';
import validate from '../../../middlewares/validate.js';
import { registerUser } from '../controller/users.controller.js';

const router = express.Router();

router.post('/users', validate(usersValidator), registerUser);
export default router;
