import express from 'express';
import authenticateToken from '../../../middlewares/authenticate-token.js';
import validate from '../../../middlewares/validate.js';
import { addTransactionsExpense, addTransactionsIncome, getDashboard, getHistory, uploadFileFoto } from '../controller/transactions.controller.js';
import { transactionGetQuery, transactionsValidatorExpense, transactionsValidatorIncome } from '../validator/transactions.validator.js';
import VerifyVerifiedEmail from '../../../middlewares/verify-verified-email.js';
import uploadFileMiddleware from '../../../middlewares/upload-file-middleware.js';

const router = express.Router();

router.use(authenticateToken, VerifyVerifiedEmail);

router.post('/transactions/expense', validate(transactionsValidatorExpense), addTransactionsExpense);

router.post('/transactions/income', validate(transactionsValidatorIncome), addTransactionsIncome);


router.get('/transactions/dashboard', validate(transactionGetQuery, 'query'), getDashboard);

router.post('/transactions/upload', uploadFileMiddleware, uploadFileFoto);

router.get('/transactions/history', getHistory);



export default router;
