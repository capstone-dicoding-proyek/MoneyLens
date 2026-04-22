import express from 'express';
import { addRefreshToken, login, logout, resendVerifyEmail, sendResetPassword, verifyEmail } from '../controller/authentications.controller.js';
import authenticateToken from '../../../middlewares/authenticate-token.js';
import { resendLimiter } from '../../../middlewares/rate-limiter.js';
import validate from '../../../middlewares/validate.js';
import { authenticationPayloadValidatorDelete, authenticationPayloadValidatorPost, authenticationPayloadValidatorPut, resendResetTokenPasswordPayloadValidatorPost, tokenValidator } from '../validator/authentications.validator.js';


const router = express.Router();

router.get('/auth/verify-email', validate(tokenValidator, 'query'), verifyEmail);

router.post('/auth/resend-verif', authenticateToken, resendLimiter, resendVerifyEmail);

router.post('/auth', validate(authenticationPayloadValidatorPost), login);

router.put('/auth', validate(authenticationPayloadValidatorPut), addRefreshToken);

router.delete('/auth', validate(authenticationPayloadValidatorDelete), logout);

router.post('/auth/reset-password', validate(resendResetTokenPasswordPayloadValidatorPost), resendLimiter, sendResetPassword);




export default router;
