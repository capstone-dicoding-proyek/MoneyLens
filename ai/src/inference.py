import os
import time
import logging
from pathlib import Path
from typing import Union, List, Dict, Optional, Tuple
 
import cv2
import numpy as np
from PIL import Image
 
# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("OCRInference")
 
 
# ── Konstanta ─────────────────────────────────────────────────────────────────
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
 
# Warna BGR unik per label untuk visualisasi
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
 
DEFAULT_CONF_THRESHOLD   = 0.25   # confidence minimum
DEFAULT_IOU_THRESHOLD    = 0.45   # NMS IoU threshold
DEFAULT_IMG_SIZE         = 640    # resolusi input model
 
 
# ── Helper: load gambar ───────────────────────────────────────────────────────
def _load_image(source: Union[str, Path, np.ndarray, Image.Image]) -> np.ndarray:
    """
    Terima path string, Path, numpy array (BGR/RGB), atau PIL Image.
    Selalu kembalikan numpy array BGR uint8.
    """
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
        if source.ndim == 2:                         # grayscale → BGR
            return cv2.cvtColor(source, cv2.COLOR_GRAY2BGR)
        if source.shape[2] == 4:                     # BGRA / RGBA → BGR
            return source[:, :, :3]
        return source.copy()
 
    raise TypeError(f"Tipe gambar tidak didukung: {type(source)}")
 
 
# ── Helper: preprocess ────────────────────────────────────────────────────────
def preprocess_image(
    img_bgr: np.ndarray,
    target_size: int = DEFAULT_IMG_SIZE,
) -> np.ndarray:
    """
    Resize + letterbox ke `target_size × target_size` dengan padding abu-abu.
    YOLOv8 melakukan preprocessing internal, tapi fungsi ini berguna untuk
    pipeline kustom atau validasi visual sebelum dikirim ke model.
 
    Returns
    -------
    np.ndarray
        Gambar uint8 BGR berukuran (target_size, target_size, 3).
    """
    h, w = img_bgr.shape[:2]
    scale = target_size / max(h, w)
    new_w, new_h = int(w * scale), int(h * scale)
 
    resized = cv2.resize(img_bgr, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
 
    # Buat canvas abu-abu dan tempel gambar di tengah
    canvas = np.full((target_size, target_size, 3), 114, dtype=np.uint8)
    pad_top  = (target_size - new_h) // 2
    pad_left = (target_size - new_w) // 2
    canvas[pad_top:pad_top + new_h, pad_left:pad_left + new_w] = resized
 
    return canvas
 
 
# ── Helper: postprocess detection ────────────────────────────────────────────
def _parse_detections(results, conf_threshold: float) -> List[Dict]:
    """
    Ubah output ultralytics Results menjadi list of dict yang mudah dikonsumsi.
 
    Setiap dict berisi:
        label     : str   – nama kelas
        confidence: float – skor kepercayaan
        bbox      : dict  – {x1, y1, x2, y2} dalam piksel gambar asli
        bbox_norm : dict  – {x1, y1, x2, y2} ternormalisasi [0, 1]
    """
    detections: List[Dict] = []
 
    for result in results:
        if result.boxes is None:
            continue
 
        boxes      = result.boxes.xyxy.cpu().numpy()    # (N, 4) piksel
        boxes_norm = result.boxes.xyxyn.cpu().numpy()   # (N, 4) normalized
        confs      = result.boxes.conf.cpu().numpy()    # (N,)
        cls_ids    = result.boxes.cls.cpu().numpy().astype(int)  # (N,)
 
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
 
    # Urutkan: confidence tertinggi dulu
    detections.sort(key=lambda d: d["confidence"], reverse=True)
    return detections
 
 
def _group_by_label(detections: List[Dict]) -> Dict[str, List[Dict]]:
    """
    Kelompokkan deteksi berdasarkan label.
    Berguna untuk akses cepat, misal: grouped['TotalPrice'][0]
    """
    grouped: Dict[str, List[Dict]] = {label: [] for label in LABEL_NAMES}
    for det in detections:
        grouped.setdefault(det["label"], []).append(det)
    return grouped
 
 
# ── OCRInference ──────────────────────────────────────────────────────────────
class OCRInference:
    """
    Wrapper inference untuk model YOLOv8 OCR MoneyLens.
 
    Parameters
    ----------
    model_path : str | Path
        Path ke file `best.pt`.
    conf_threshold : float
        Confidence minimum untuk memfilter deteksi (default 0.25).
    iou_threshold : float
        IoU threshold untuk Non-Maximum Suppression (default 0.45).
    img_size : int
        Resolusi input model (default 640).
    device : str
        Device inferensi: 'cpu', 'cuda', 'cuda:0', dll.
        None = auto-detect (GPU jika tersedia).
    """
 
    def __init__(
        self,
        model_path: Union[str, Path] = "saved_model/best.pt",
        conf_threshold: float = DEFAULT_CONF_THRESHOLD,
        iou_threshold: float  = DEFAULT_IOU_THRESHOLD,
        img_size: int         = DEFAULT_IMG_SIZE,
        device: Optional[str] = None,
    ) -> None:
        try:
            from ultralytics import YOLO
        except ImportError:
            raise ImportError(
                "ultralytics belum terinstall. Jalankan: pip install ultralytics"
            )
 
        self.model_path     = Path(model_path)
        self.conf_threshold = conf_threshold
        self.iou_threshold  = iou_threshold
        self.img_size       = img_size
 
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Model tidak ditemukan: {self.model_path.resolve()}"
            )
 
        logger.info(f"Memuat model dari: {self.model_path}")
        self.model = YOLO(str(self.model_path))
 
        # Tentukan device
        import torch
        if device is None:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device
 
        self.model.to(self.device)
        logger.info(f"Model siap | device={self.device} | conf={conf_threshold} | iou={iou_threshold}")
 
    # ── Inference tunggal ────────────────────────────────────────────────────
    def run_inference(
        self,
        source: Union[str, Path, np.ndarray, Image.Image],
        verbose: bool = False,
    ) -> Dict:
        """
        Jalankan deteksi pada satu gambar.
 
        Parameters
        ----------
        source : str | Path | np.ndarray | PIL.Image
            Gambar input.
        verbose : bool
            Tampilkan log detail dari ultralytics (default False).
 
        Returns
        -------
        dict dengan key:
            detections  : List[dict] — semua deteksi terurut by confidence
            grouped     : Dict[str, List[dict]] — deteksi per label
            image_shape : (height, width) gambar asli
            inference_time_ms : float — waktu inferensi dalam milidetik
        """
        img_bgr = _load_image(source)
        h, w    = img_bgr.shape[:2]
 
        start_ns = time.perf_counter_ns()
 
        results = self.model.predict(
            source        = img_bgr,
            conf          = self.conf_threshold,
            iou           = self.iou_threshold,
            imgsz         = self.img_size,
            device        = self.device,
            verbose       = verbose,
        )
 
        elapsed_ms = (time.perf_counter_ns() - start_ns) / 1e6
 
        detections = _parse_detections(results, self.conf_threshold)
        grouped    = _group_by_label(detections)
 
        logger.info(
            f"Inferensi selesai | {len(detections)} deteksi | {elapsed_ms:.1f} ms"
        )
 
        return {
            "detections":        detections,
            "grouped":           grouped,
            "image_shape":       (h, w),
            "inference_time_ms": round(elapsed_ms, 2),
        }
 
    # ── Inference batch ──────────────────────────────────────────────────────
    def batch_inference(
        self,
        sources: List[Union[str, Path, np.ndarray, Image.Image]],
        verbose: bool = False,
    ) -> List[Dict]:
        """
        Jalankan deteksi pada banyak gambar sekaligus.
 
        Parameters
        ----------
        sources : list
            List path gambar atau array numpy.
        verbose : bool
            Tampilkan log detail (default False).
 
        Returns
        -------
        List[dict] — satu entry per gambar, format sama dengan run_inference().
        """
        if not sources:
            return []
 
        logger.info(f"Batch inference: {len(sources)} gambar")
 
        # Load semua gambar
        images: List[np.ndarray] = []
        shapes: List[Tuple[int, int]] = []
        for src in sources:
            img = _load_image(src)
            images.append(img)
            shapes.append(img.shape[:2])  # (h, w)
 
        start_ns = time.perf_counter_ns()
 
        all_results = self.model.predict(
            source  = images,
            conf    = self.conf_threshold,
            iou     = self.iou_threshold,
            imgsz   = self.img_size,
            device  = self.device,
            verbose = verbose,
        )
 
        elapsed_ms = (time.perf_counter_ns() - start_ns) / 1e6
        per_img_ms = elapsed_ms / len(sources)
 
        outputs = []
        for i, result in enumerate(all_results):
            detections = _parse_detections([result], self.conf_threshold)
            grouped    = _group_by_label(detections)
            h, w       = shapes[i]
 
            outputs.append({
                "detections":        detections,
                "grouped":           grouped,
                "image_shape":       (h, w),
                "inference_time_ms": round(per_img_ms, 2),
            })
 
        logger.info(
            f"Batch selesai | {len(sources)} gambar | total {elapsed_ms:.1f} ms "
            f"| rata-rata {per_img_ms:.1f} ms/gambar"
        )
 
        return outputs
 
    # ── Crop region per deteksi ───────────────────────────────────────────────
    def crop_detections(
        self,
        source: Union[str, Path, np.ndarray, Image.Image],
        result: Optional[Dict] = None,
        padding: int = 4,
    ) -> Dict[str, List[np.ndarray]]:
        """
        Potong area bounding box setiap deteksi dari gambar asli.
        Berguna untuk pipeline downstream (misal: text extraction per field).
 
        Parameters
        ----------
        source  : gambar asli
        result  : output run_inference(); jika None, dijalankan otomatis
        padding : piksel ekstra di sekeliling bbox (default 4)
 
        Returns
        -------
        Dict[label, List[np.ndarray]] — crops per label, urutan confidence
        """
        img_bgr = _load_image(source)
        if result is None:
            result = self.run_inference(img_bgr)
 
        h, w = img_bgr.shape[:2]
        crops: Dict[str, List[np.ndarray]] = {label: [] for label in LABEL_NAMES}
 
        for det in result["detections"]:
            x1 = max(0, det["bbox"]["x1"] - padding)
            y1 = max(0, det["bbox"]["y1"] - padding)
            x2 = min(w, det["bbox"]["x2"] + padding)
            y2 = min(h, det["bbox"]["y2"] + padding)
 
            crop = img_bgr[y1:y2, x1:x2]
            if crop.size > 0:
                crops[det["label"]].append(crop)
 
        return crops
 
    # ── Visualisasi ───────────────────────────────────────────────────────────
    def visualize_result(
        self,
        source: Union[str, Path, np.ndarray, Image.Image],
        result: Optional[Dict] = None,
        save_path: Optional[Union[str, Path]] = None,
        show: bool = False,
        line_thickness: int = 2,
        font_scale: float = 0.55,
    ) -> np.ndarray:
        """
        Gambar bounding box + label + confidence pada gambar.
 
        Parameters
        ----------
        source      : gambar asli
        result      : output run_inference(); jika None, dijalankan otomatis
        save_path   : path untuk menyimpan hasil (opsional)
        show        : tampilkan dengan cv2.imshow (opsional, butuh display)
        line_thickness : ketebalan garis bbox
        font_scale  : ukuran font label
 
        Returns
        -------
        np.ndarray — gambar BGR dengan anotasi
        """
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
 
            # Gambar kotak
            cv2.rectangle(vis, (x1, y1), (x2, y2), color, line_thickness)
 
            # Label background
            text   = f"{label} {conf:.2f}"
            (tw, th), baseline = cv2.getTextSize(
                text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, 1
            )
            label_y = max(y1 - 4, th + 4)
            cv2.rectangle(
                vis,
                (x1, label_y - th - baseline - 2),
                (x1 + tw + 2, label_y + baseline),
                color, -1,
            )
 
            # Teks label
            cv2.putText(
                vis, text, (x1 + 1, label_y - 1),
                cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), 1,
                cv2.LINE_AA,
            )
 
        # Tampilkan info ringkas di pojok kiri atas
        info_text = (
            f"Deteksi: {len(result['detections'])} | "
            f"{result['inference_time_ms']:.0f} ms"
        )
        cv2.putText(
            vis, info_text, (8, 24),
            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA
        )
        cv2.putText(
            vis, info_text, (8, 24),
            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 1, cv2.LINE_AA
        )
 
        if save_path:
            cv2.imwrite(str(save_path), vis)
            logger.info(f"Visualisasi disimpan: {save_path}")
 
        if show:
            cv2.imshow("OCR Result", vis)
            cv2.waitKey(0)
            cv2.destroyAllWindows()
 
        return vis
 
    # ── Ringkasan hasil ───────────────────────────────────────────────────────
    @staticmethod
    def summarize(result: Dict) -> Dict[str, Optional[Dict]]:
        """
        Ambil deteksi dengan confidence tertinggi per label.
        Cocok untuk output final struk (satu nilai per field).
 
        Returns
        -------
        Dict[label, detection_dict | None]
        """
        summary: Dict[str, Optional[Dict]] = {}
        for label in LABEL_NAMES:
            dets = result["grouped"].get(label, [])
            # grouped sudah terurut confidence tertinggi dulu
            summary[label] = dets[0] if dets else None
        return summary
 
 
# ── CLI sederhana untuk pengujian cepat ───────────────────────────────────────
if __name__ == "__main__":
    import argparse, json
 
    parser = argparse.ArgumentParser(description="MoneyLens OCR Inference")
    parser.add_argument("image",       help="Path gambar atau folder")
    parser.add_argument(
        "--model",   default="saved_model/best.pt", help="Path ke best.pt"
    )
    parser.add_argument(
        "--conf",    type=float, default=0.25,       help="Confidence threshold"
    )
    parser.add_argument(
        "--iou",     type=float, default=0.45,       help="IoU threshold"
    )
    parser.add_argument(
        "--save",    default=None,                   help="Simpan hasil visualisasi"
    )
    parser.add_argument(
        "--show",    action="store_true",             help="Tampilkan dengan imshow"
    )
    args = parser.parse_args()
 
    ocr = OCRInference(
        model_path=args.model,
        conf_threshold=args.conf,
        iou_threshold=args.iou,
    )
 
    # Jika folder → batch inference
    source_path = Path(args.image)
    if source_path.is_dir():
        img_paths = sorted(
            source_path.glob("*.jpg")
        ) + sorted(source_path.glob("*.png"))
        print(f"[Batch] Memproses {len(img_paths)} gambar...")
        outputs = ocr.batch_inference(img_paths)
        for p, out in zip(img_paths, outputs):
            summary = OCRInference.summarize(out)
            found   = {k: v["confidence"] for k, v in summary.items() if v}
            print(f"{p.name}: {found}")
    else:
        result  = ocr.run_inference(args.image)
        summary = OCRInference.summarize(result)
        print("\n=== Hasil Deteksi ===")
        print(json.dumps(summary, indent=2, default=str))
 
        if args.save or args.show:
            ocr.visualize_result(args.image, result, save_path=args.save, show=args.show)