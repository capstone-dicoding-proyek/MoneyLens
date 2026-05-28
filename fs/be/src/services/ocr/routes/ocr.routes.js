routerOcr.post(
  '/ocr/scan',
  authenticateToken,       // harus login
  uploadFileMiddleware,    // parse multipart/form-data, field name: foto
  scanReceipt
);
 
export default routerOcr;