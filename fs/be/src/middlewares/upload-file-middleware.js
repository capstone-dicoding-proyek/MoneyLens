import multer from 'multer';
import { PlayloadError } from '../exceptions/error.js';
import { upload } from '../utils/upload-file.js';

const uploadFileMiddleware = async (req, res, next) =>{
  upload.single('foto')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new PlayloadError('Ukuran file maksimal 5mb'));
      }
    } else if (err) {
      return next(err);
    }
    next();
  });
};

export default uploadFileMiddleware;