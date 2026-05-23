import { useEffect, useRef, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import {
  IoCamera,
  IoCloudUploadOutline,
  IoCheckmark,
  IoClose,
} from 'react-icons/io5';
import { postTransactionUpload } from '../api/transaction';

export default function OcrSectionComponent({ onOcrResult }) {
  const [ocrLoading, setOcrLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState('');
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);
  const openCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(s);
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = s;
      }, 100);
    } catch {
      setError('Kamera tidak dapat diakses');
    }
  };

  const closeCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setShowCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        closeCamera();
        showPreview(blob, 'photo.jpg');
      },
      'image/jpeg',
      0.9,
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) showPreview(file, file.name);
    e.target.value = '';
  };

  const showPreview = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    setPreview({ url, blob, filename });
  };

  const cancelPreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const submitOcr = async () => {
    if (!preview) return;
    setOcrLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('foto', preview.blob, preview.filename);

      const res = await postTransactionUpload({ formData });
      console.log(res);
      if (res) onOcrResult(res);
      cancelPreview();
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Gagal memproses gambar');
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <div className="border border-dashed border-line rounded-xl p-3 space-y-2">
      <div className="text-xs font-semibold text-tthird flex items-center gap-1.5">
        <IoCloudUploadOutline className="text-base" />
        Isi otomatis dari struk / nota
      </div>

      {showCamera && (
        <div className="space-y-2">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={capturePhoto}
              className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-secondary transition flex items-center justify-center gap-1"
            >
              <IoCamera /> Ambil Foto
            </button>
            <button
              type="button"
              onClick={closeCamera}
              className="px-4 py-2 border border-line rounded-lg text-sm text-tthird hover:text-black transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {!showCamera && preview && (
        <div className="space-y-2">
          <div className="relative rounded-lg overflow-hidden border border-line">
            <img
              src={preview.url}
              alt="Preview struk"
              className="w-full object-contain max-h-56"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={submitOcr}
              disabled={ocrLoading}
              className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-secondary transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {ocrLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  <IoCheckmark className="text-base" /> Gunakan Gambar Ini
                </>
              )}
            </button>
            <button
              type="button"
              onClick={cancelPreview}
              disabled={ocrLoading}
              className="px-4 py-2 border flex items-center justify-center border-line rounded-lg text-sm text-tthird hover:text-black transition disabled:opacity-50  gap-1"
            >
              <IoClose className="text-base" /> Batal
            </button>
          </div>
        </div>
      )}
      {error && (
        <div className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      {!showCamera && !preview && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={openCamera}
            className="flex-1 flex items-center justify-center gap-1.5 border border-line rounded-lg py-2 text-sm text-tthird hover:border-primary hover:text-primary transition"
          >
            <IoCamera /> Kamera
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 border border-line rounded-lg py-2 text-sm text-tthird hover:border-primary hover:text-primary transition"
          >
            <IoCloudUploadOutline /> Upload
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
