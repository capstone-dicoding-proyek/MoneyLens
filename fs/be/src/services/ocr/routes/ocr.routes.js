import express from 'express';
import authenticateToken from '../../../middlewares/authenticate-token.js';
import uploadFileMiddleware from '../../../middlewares/upload-file-middleware.js';
import { scanReceipt } from '../controller/ocr.controller.js';

const router = express.Router();

router.post('/ocr/scan', authenticateToken, uploadFileMiddleware, scanReceipt);

export default router;

