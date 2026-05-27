import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { ClientError } from '../../exceptions/client-error.js';
import { PlayloadError } from '../../exceptions/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path ke inference_service.py relatif dari file ini
// MoneyLens/fs/be/src/services/ocr/controller/ → MoneyLens/ai/src/
const INFERENCE_SCRIPT = path.resolve(
  __dirname,
  '../../../../../ai/src/inference_service.py'
);

const PYTHON_BIN = process.env.PYTHON_BIN || 'python3';
const MODEL_PATH = path.resolve(
  __dirname,
  '../../../../../ai/saved_model/best.pt'
);

/**
 * Jalankan inference Python dan kembalikan hasil JSON.
 * Gambar dikirim via stdin (buffer dari multer memoryStorage).
 *
 * @param {Buffer} imageBuffer - Buffer gambar dari multer
 * @param {string} mimetype    - MIME type gambar (image/jpeg, image/png, dst)
 * @returns {Promise<object>}  - Parsed JSON dari Python
 */
function runPythonInference(imageBuffer, mimetype) {
  return new Promise((resolve, reject) => {
    const ext = mimetype === 'image/png' ? '.png' : '.jpg';

    const args = [
      INFERENCE_SCRIPT,
      '--source', 'stdin',
      '--model',  MODEL_PATH,
      '--ext',    ext,
      '--conf',   process.env.OCR_CONF_THRESHOLD || '0.25',
      '--iou',    process.env.OCR_IOU_THRESHOLD  || '0.45',
    ];

    const py = spawn(PYTHON_BIN, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    py.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    py.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

    py.on('close', (code) => {
      if (code !== 0) {
        console.error('[OCR] Python stderr:', stderr);
        return reject(new Error(`Python process exit code ${code}: ${stderr}`));
      }

      try {
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch {
        console.error('[OCR] stdout tidak valid JSON:', stdout);
        reject(new Error('Gagal parse output Python'));
      }
    });

    py.on('error', (err) => {
      reject(new Error(`Gagal menjalankan Python: ${err.message}`));
    });

    // Kirim gambar ke stdin lalu tutup
    py.stdin.write(imageBuffer);
    py.stdin.end();
  });
}

/**
 * POST /api/ocr/scan
 * Upload gambar struk → deteksi field OCR → return JSON
 */
export const scanReceipt = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new PlayloadError('Gambar struk wajib diupload');
    }

    const { buffer, mimetype } = req.file;

    const pythonResult = await runPythonInference(buffer, mimetype);

    if (!pythonResult.success) {
      throw new ClientError(pythonResult.error || 'Inferensi OCR gagal');
    }

    const { fields, total_detections, image_shape, inference_time_ms } =
      pythonResult.data;

    return res.status(200).json({
      status:  'success',
      message: 'Struk berhasil dianalisis',
      data: {
        fields,           // hasil deteksi per label (Address, Date, dll)
        total_detections,
        image_shape,
        inference_time_ms,
      },
    });
  } catch (err) {
    next(err);
  }
};