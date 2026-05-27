import express from 'express';
import authenticateToken from '../../../middlewares/authenticate-token.js';
import validate from '../../../middlewares/validate.js';
import { addTransactionsExpense, addTransactionsIncome, deleteTransaction, getDashboard, getHistory, uploadFileFoto } from '../controller/transactions.controller.js';
import { deleteTransactionPayload, transactionGetQuery, transactionsValidatorExpense, transactionsValidatorIncome } from '../validator/transactions.validator.js';
import VerifyVerifiedEmail from '../../../middlewares/verify-verified-email.js';
import uploadFileMiddleware from '../../../middlewares/upload-file-middleware.js';
import { transactionLimiter, uploadOcrLimiter } from '../../../middlewares/rate-limiter.js';

const router = express.Router();

router.use(authenticateToken, VerifyVerifiedEmail);

router.post('/transactions/expense', transactionLimiter, validate(transactionsValidatorExpense), addTransactionsExpense);

router.post('/transactions/income', transactionLimiter, validate(transactionsValidatorIncome), addTransactionsIncome);


router.get('/transactions/dashboard', validate(transactionGetQuery, 'query'), getDashboard);

router.post('/transactions/upload', uploadOcrLimiter, uploadFileMiddleware, uploadFileFoto);

router.delete('/transactions', validate(deleteTransactionPayload), deleteTransaction);

router.get('/transactions/history', getHistory);



export default router;
