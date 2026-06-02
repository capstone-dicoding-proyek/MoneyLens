import os
import time
import logging
from pathlib import Path
from typing import Union, List, Dict, Optional, Tuple

import cv2
import numpy as np
from PIL import Image

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("OCRInference")

# ── Thread optimization (lakukan sekali saat import) ──────────────────────────
import torch

_CPU_CORES = os.cpu_count() or 4
torch.set_num_threads(_CPU_CORES)
torch.set_num_interop_threads(max(1, _CPU_CORES // 2))
logger.info(f"PyTorch threads: intra={_CPU_CORES}, inter={max(1, _CPU_CORES // 2)}")

# ── Konstanta ──────────────────────────────────────────────────────────────────
LABEL_NAMES: List[str] = [
    "Address",
    "Date",
    "Item",
    "OrderId",
    "Subtotal",
    "Tax",
    "Title",
    "TotalPrice",
]

LABEL_COLORS: Dict[str, Tuple[int, int, int]] = {
    "Address":    (255, 100,  50),
    "Date":       ( 50, 200, 255),
    "Item":       ( 50, 255, 100),
    "OrderId":    (200,  50, 255),
    "Subtotal":   (255, 200,  50),
    "Tax":        ( 50, 100, 255),
    "Title":      (255,  50, 150),
    "TotalPrice": ( 50, 255, 200),
}

DEFAULT_CONF_THRESHOLD = 0.25
DEFAULT_IOU_THRESHOLD  = 0.45
DEFAULT_IMG_SIZE       = 640
TROCR_MODEL_NAME       = "microsoft/trocr-base-printed"

# Resize gambar input jika lebih besar dari ini (pixels di sisi terpanjang)
# Mengurangi beban YOLO + crop preprocessing tanpa banyak kehilangan akurasi
MAX_INPUT_DIM = 1280


# ── Helper: load & resize gambar ──────────────────────────────────────────────
def _load_image(source: Union[str, Path, np.ndarray, Image.Image]) -> np.ndarray:
    """Terima berbagai tipe input, selalu return numpy array BGR uint8."""
    if isinstance(source, (str, Path)):
        path = str(source)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Gambar tidak ditemukan: {path}")
        img = cv2.imread(path)
        if img is None:
            raise ValueError(f"cv2 gagal membaca gambar: {path}")
        return img

    if isinstance(source, Image.Image):
        return cv2.cvtColor(np.array(source.convert("RGB")), cv2.COLOR_RGB2BGR)

    if isinstance(source, np.ndarray):
        if source.ndim == 2:
            return cv2.cvtColor(source, cv2.COLOR_GRAY2BGR)
        if source.shape[2] == 4:
            return source[:, :, :3]
        return source.copy()

    raise TypeError(f"Tipe gambar tidak didukung: {type(source)}")


def _maybe_resize(img_bgr: np.ndarray, max_dim: int = MAX_INPUT_DIM) -> np.ndarray:
    """
    Resize proporsional jika gambar terlalu besar.
    Gambar resolusi tinggi (4K, 12MP, dll) sangat memperlambat YOLO & preprocessing.
    """
    h, w = img_bgr.shape[:2]
    longest = max(h, w)
    if longest <= max_dim:
        return img_bgr
    scale = max_dim / longest
    new_w, new_h = int(w * scale), int(h * scale)
    logger.info(f"Resize input: {w}x{h} → {new_w}x{new_h}")
    return cv2.resize(img_bgr, (new_w, new_h), interpolation=cv2.INTER_AREA)


# ── Preprocessing crop (ringan, tanpa denoising) ──────────────────────────────
def preprocess_crop(crop_bgr: np.ndarray) -> np.ndarray:
    """
    Preprocessing crop sebelum dikirim ke TrOCR.
    OPTIMIZED: hapus fastNlMeansDenoising (penyebab utama kelambatan).

    Pipeline: grayscale → resize 2x → CLAHE → adaptive threshold → morphology
    CLAHE (Contrast Limited AHE) menggantikan denoising, jauh lebih cepat.
    """
    # 1. Grayscale
    gray = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2GRAY)

    # 2. Resize 2x (tetap berguna untuk teks kecil)
    gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    # 3. CLAHE — tingkatkan kontras lokal (cepat, gantikan denoising)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray  = clahe.apply(gray)

    # 4. Adaptive threshold
    thresh = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11,
        2,
    )

    # 5. Morphology
    kernel = np.ones((2, 2), np.uint8)
    morph  = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    return morph


# ── Helper: postprocess deteksi YOLO ──────────────────────────────────────────
def _parse_detections(results, conf_threshold: float) -> List[Dict]:
    """Ubah output ultralytics Results menjadi list of dict."""
    detections: List[Dict] = []

    for result in results:
        if result.boxes is None:
            continue

        boxes      = result.boxes.xyxy.cpu().numpy()
        boxes_norm = result.boxes.xyxyn.cpu().numpy()
        confs      = result.boxes.conf.cpu().numpy()
        cls_ids    = result.boxes.cls.cpu().numpy().astype(int)

        for box, box_n, conf, cls_id in zip(boxes, boxes_norm, confs, cls_ids):
            if conf < conf_threshold:
                continue

            label = LABEL_NAMES[cls_id] if cls_id < len(LABEL_NAMES) else str(cls_id)

            detections.append({
                "label":      label,
                "confidence": float(conf),
                "bbox": {
                    "x1": int(box[0]), "y1": int(box[1]),
                    "x2": int(box[2]), "y2": int(box[3]),
                },
                "bbox_norm": {
                    "x1": float(box_n[0]), "y1": float(box_n[1]),
                    "x2": float(box_n[2]), "y2": float(box_n[3]),
                },
            })

    detections.sort(key=lambda d: d["confidence"], reverse=True)
    return detections


def _group_by_label(detections: List[Dict]) -> Dict[str, List[Dict]]:
    """Kelompokkan deteksi berdasarkan label."""
    grouped: Dict[str, List[Dict]] = {label: [] for label in LABEL_NAMES}
    for det in detections:
        grouped.setdefault(det["label"], []).append(det)
    return grouped


# ── OCRInference ───────────────────────────────────────────────────────────────
class OCRInference:
    """
    Pipeline OCR MoneyLens: YOLOv8 deteksi field → TrOCR baca teks.

    Parameters
    ----------
    model_path     : path ke best.pt (YOLO)
    conf_threshold : confidence minimum deteksi
    iou_threshold  : IoU threshold NMS
    img_size       : resolusi input YOLO
    device         : 'cpu' atau 'cuda'; None = auto-detect
    trocr_model    : nama model TrOCR HuggingFace
    crop_padding   : padding piksel di sekeliling bbox sebelum crop
    trocr_batch    : jumlah crop yang diproses sekaligus oleh TrOCR
    """

    def __init__(
        self,
        model_path: Union[str, Path] = "saved_model/best.pt",
        conf_threshold: float = DEFAULT_CONF_THRESHOLD,
        iou_threshold: float  = DEFAULT_IOU_THRESHOLD,
        img_size: int         = DEFAULT_IMG_SIZE,
        device: Optional[str] = None,
        trocr_model: str      = TROCR_MODEL_NAME,
        crop_padding: int     = 4,
        trocr_batch: int      = 8,   # BARU: batch size TrOCR
    ) -> None:
        try:
            from ultralytics import YOLO
        except ImportError:
            raise ImportError("Jalankan: pip install ultralytics")

        try:
            from transformers import TrOCRProcessor, VisionEncoderDecoderModel
        except ImportError:
            raise ImportError("Jalankan: pip install transformers")

        self.conf_threshold = conf_threshold
        self.iou_threshold  = iou_threshold
        self.img_size       = img_size
        self.crop_padding   = crop_padding
        self.trocr_batch    = trocr_batch

        # ── Device ──────────────────────────────────────────────────────────
        if device is None:
            cuda_ok = torch.cuda.is_available()
            if cuda_ok:
                try:
                    torch.zeros(1).cuda()
                except Exception:
                    cuda_ok = False
            self.device = "cuda" if cuda_ok else "cpu"
        else:
            self.device = device

        # ── Load YOLO ───────────────────────────────────────────────────────
        self.model_path = Path(model_path)
        if not self.model_path.exists():
            raise FileNotFoundError(f"Model tidak ditemukan: {self.model_path.resolve()}")

        logger.info(f"Memuat YOLO dari: {self.model_path}")
        self.yolo = YOLO(str(self.model_path))
        self.yolo.to(self.device)

        # ── Load TrOCR ──────────────────────────────────────────────────────
        logger.info(f"Memuat TrOCR: {trocr_model} (pertama kali butuh download ~400MB)")
        self.trocr_processor = TrOCRProcessor.from_pretrained(trocr_model)
        self.trocr_model     = VisionEncoderDecoderModel.from_pretrained(trocr_model).to(self.device)
        self.trocr_model.eval()

        logger.info(f"Model siap | device={self.device} | conf={conf_threshold} | iou={iou_threshold} | batch={trocr_batch}")

    # ── Baca teks dari BATCH crop ──────────────────────────────────────────
    def _extract_texts_batch(self, crops_bgr: List[np.ndarray]) -> List[str]:
        """
        OPTIMIZED: proses semua crop sekaligus dalam satu forward pass TrOCR.
        Jauh lebih efisien daripada panggil generate() N kali.
        """
        if not crops_bgr:
            return []

        pil_images = []
        for crop in crops_bgr:
            processed = preprocess_crop(crop)
            pil_images.append(Image.fromarray(processed).convert("RGB"))

        results: List[str] = []

        # Proses dalam sub-batch jika jumlah crop sangat banyak
        for i in range(0, len(pil_images), self.trocr_batch):
            batch = pil_images[i : i + self.trocr_batch]

            pixel_values = self.trocr_processor(
                images=batch,
                return_tensors="pt",
            ).pixel_values.to(self.device)

            with torch.no_grad():
                generated_ids = self.trocr_model.generate(
                    pixel_values,
                    max_new_tokens=32,   # OPTIMIZED: 64→32, cukup untuk teks struk
                    num_beams=1,         # OPTIMIZED: greedy decode (5→1), ~4x lebih cepat
                    do_sample=False,
                )

            decoded = self.trocr_processor.batch_decode(
                generated_ids,
                skip_special_tokens=True,
            )
            results.extend([t.strip() for t in decoded])

        return results

    # ── Inference tunggal ─────────────────────────────────────────────────
    def run_inference(
        self,
        source: Union[str, Path, np.ndarray, Image.Image],
        verbose: bool = False,
    ) -> Dict:
        """
        Jalankan pipeline YOLO + TrOCR pada satu gambar.

        Returns
        -------
        dict:
            detections        : semua deteksi YOLO (sorted by confidence)
            grouped           : deteksi per label
            extracted         : teks hasil TrOCR per label (key utama)
            image_shape       : (height, width)
            inference_time_ms : total waktu (ms)
        """
        img_bgr = _load_image(source)
        img_bgr = _maybe_resize(img_bgr)          # BARU: resize jika terlalu besar
        h, w    = img_bgr.shape[:2]

        start_ns = time.perf_counter_ns()

        # ── Step 1: YOLO deteksi field ────────────────────────────────────
        yolo_results = self.yolo.predict(
            source  = img_bgr,
            conf    = self.conf_threshold,
            iou     = self.iou_threshold,
            imgsz   = self.img_size,
            device  = self.device,
            verbose = verbose,
        )

        detections = _parse_detections(yolo_results, self.conf_threshold)
        grouped    = _group_by_label(detections)

        # ── Step 2: Kumpulkan semua crop, lalu batch TrOCR sekaligus ─────
        # Urutan: (label, det_index, crop_bgr)
        crop_queue: List[Tuple[str, int, np.ndarray]] = []

        for label in LABEL_NAMES:
            for det in grouped.get(label, []):
                x1 = max(0, det["bbox"]["x1"] - self.crop_padding)
                y1 = max(0, det["bbox"]["y1"] - self.crop_padding)
                x2 = min(w, det["bbox"]["x2"] + self.crop_padding)
                y2 = min(h, det["bbox"]["y2"] + self.crop_padding)

                crop = img_bgr[y1:y2, x1:x2]
                if crop.size == 0:
                    continue
                crop_queue.append((label, len(crop_queue), crop))

        # Batch inference TrOCR — semua crop dalam 1–2 forward pass
        all_crops   = [c for _, _, c in crop_queue]
        all_texts   = self._extract_texts_batch(all_crops)

        # ── Step 3: Susun hasil ke struktur extracted ─────────────────────
        # Map hasil teks kembali ke label & deteksi
        text_by_idx = {idx: txt for (_, idx, _), txt in zip(crop_queue, all_texts)}

        # Rebuild: iterasi ulang dengan counter yang sama
        counter     = 0
        label_texts: Dict[str, List[Dict]] = {label: [] for label in LABEL_NAMES}

        for label in LABEL_NAMES:
            for det in grouped.get(label, []):
                x1 = max(0, det["bbox"]["x1"] - self.crop_padding)
                y1 = max(0, det["bbox"]["y1"] - self.crop_padding)
                x2 = min(w, det["bbox"]["x2"] + self.crop_padding)
                y2 = min(h, det["bbox"]["y2"] + self.crop_padding)
                crop = img_bgr[y1:y2, x1:x2]
                if crop.size == 0:
                    continue

                txt = text_by_idx.get(counter, "")
                label_texts[label].append({
                    "text":       txt,
                    "confidence": round(det["confidence"], 4),
                    "bbox":       det["bbox"],
                })
                counter += 1

        extracted: Dict[str, object] = {}
        for label in LABEL_NAMES:
            texts = label_texts[label]
            if not texts:
                extracted[label] = None
            elif label == "Item":
                extracted[label] = texts          # list
            else:
                extracted[label] = texts[0]["text"] if texts else None

        elapsed_ms = (time.perf_counter_ns() - start_ns) / 1e6

        logger.info(
            f"Inferensi selesai | {len(detections)} deteksi | {elapsed_ms:.1f} ms"
        )

        return {
            "detections":        detections,
            "grouped":           grouped,
            "extracted":         extracted,
            "image_shape":       (h, w),
            "inference_time_ms": round(elapsed_ms, 2),
        }

    # ── Batch inference ───────────────────────────────────────────────────
    def batch_inference(
        self,
        sources: List[Union[str, Path, np.ndarray, Image.Image]],
        verbose: bool = False,
    ) -> List[Dict]:
        """Jalankan run_inference pada banyak gambar."""
        if not sources:
            return []

        logger.info(f"Batch inference: {len(sources)} gambar")
        results = []
        for src in sources:
            results.append(self.run_inference(src, verbose=verbose))
        return results

    # ── Visualisasi ───────────────────────────────────────────────────────
    def visualize_result(
        self,
        source: Union[str, Path, np.ndarray, Image.Image],
        result: Optional[Dict] = None,
        save_path: Optional[Union[str, Path]] = None,
        show: bool = False,
        line_thickness: int = 2,
        font_scale: float   = 0.55,
    ) -> np.ndarray:
        """Gambar bbox + label + confidence + teks pada gambar."""
        img_bgr = _load_image(source)
        if result is None:
            result = self.run_inference(img_bgr)

        vis = img_bgr.copy()

        for det in result["detections"]:
            label = det["label"]
            conf  = det["confidence"]
            x1, y1, x2, y2 = (
                det["bbox"]["x1"], det["bbox"]["y1"],
                det["bbox"]["x2"], det["bbox"]["y2"],
            )

            color = LABEL_COLORS.get(label, (0, 255, 0))
            cv2.rectangle(vis, (x1, y1), (x2, y2), color, line_thickness)

            ext = result["extracted"].get(label)
            if isinstance(ext, list):
                display_text = f"{label} {conf:.2f}"
            elif isinstance(ext, str):
                short = ext[:20] + "…" if len(ext) > 20 else ext
                display_text = f"{label}: {short}"
            else:
                display_text = f"{label} {conf:.2f}"

            (tw, th), baseline = cv2.getTextSize(
                display_text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, 1
            )
            label_y = max(y1 - 4, th + 4)
            cv2.rectangle(
                vis,
                (x1, label_y - th - baseline - 2),
                (x1 + tw + 2, label_y + baseline),
                color, -1,
            )
            cv2.putText(
                vis, display_text, (x1 + 1, label_y - 1),
                cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), 1,
                cv2.LINE_AA,
            )

        info_text = f"Deteksi: {len(result['detections'])} | {result['inference_time_ms']:.0f} ms"
        cv2.putText(vis, info_text, (8, 24), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2, cv2.LINE_AA)
        cv2.putText(vis, info_text, (8, 24), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,0), 1, cv2.LINE_AA)

        if save_path:
            cv2.imwrite(str(save_path), vis)
            logger.info(f"Visualisasi disimpan: {save_path}")

        if show:
            cv2.imshow("OCR Result", vis)
            cv2.waitKey(0)
            cv2.destroyAllWindows()

        return vis


# ── CLI ────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse, json

    parser = argparse.ArgumentParser(description="MoneyLens OCR Inference")
    parser.add_argument("image",     help="Path gambar")
    parser.add_argument("--model",   default="saved_model/best.pt")
    parser.add_argument("--conf",    type=float, default=0.25)
    parser.add_argument("--iou",     type=float, default=0.45)
    parser.add_argument("--save",    default=None)
    parser.add_argument("--show",    action="store_true")
    args = parser.parse_args()

    ocr    = OCRInference(model_path=args.model, conf_threshold=args.conf, iou_threshold=args.iou)
    result = ocr.run_inference(args.image)

    print("\n=== HASIL EKSTRAKSI ===\n")
    print(json.dumps(result["extracted"], indent=2, ensure_ascii=False))

    if args.save or args.show:
        ocr.visualize_result(args.image, result, save_path=args.save, show=args.show)