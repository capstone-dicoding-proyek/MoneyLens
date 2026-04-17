import express from 'express';
import { resendVerifyEmail, verifyEmail } from '../controller/authentications.controller.js';
import authenticateToken from '../../../middlewares/authenticate-token.js';
import { resendLimiter } from '../../../middlewares/rate-limiter.js';
import validate from '../../../middlewares/validate.js';
import { tokenValidator } from '../validator/authentications.validator.js';


const router = express.Router();

router.get('/verify-email', validate(tokenValidator, 'query'), verifyEmail);
router.post('/resend-verif', authenticateToken, resendLimiter, resendVerifyEmail);

export default router;
