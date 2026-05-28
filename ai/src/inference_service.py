"""
inference_service.py
====================
Entry point Python yang di-spawn oleh Express.js via child_process.
Menerima gambar dari stdin → YOLO + TrOCR → print JSON ke stdout.
"""

import sys
import os
import json
import argparse
import tempfile
import traceback
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from inference import OCRInference, LABEL_NAMES


def build_response(success: bool, data=None, error: str = None) -> dict:
    return {"success": success, "data": data, "error": error}


def run(args):
    # ── Load model ────────────────────────────────────────────────────────
    ocr = OCRInference(
        model_path=args.model,
        conf_threshold=args.conf,
        iou_threshold=args.iou,
        device="cpu",
    )

    # ── Baca gambar ───────────────────────────────────────────────────────
    if args.source == "stdin":
        image_bytes = sys.stdin.buffer.read()
        if not image_bytes:
            return build_response(False, error="Tidak ada data gambar dari stdin")

        suffix = args.ext if args.ext else ".jpg"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(image_bytes)
            tmp_path = tmp.name

        try:
            result = ocr.run_inference(tmp_path)
        finally:
            os.unlink(tmp_path)
    else:
        if not os.path.exists(args.source):
            return build_response(False, error=f"File tidak ditemukan: {args.source}")
        result = ocr.run_inference(args.source)

    # ── Format output JSON ────────────────────────────────────────────────
    # extracted sudah berisi teks per label langsung
    extracted = result["extracted"]

    # Tambahkan confidence & bbox per label untuk referensi frontend
    fields = {}
    for label in LABEL_NAMES:
        dets = result["grouped"].get(label, [])
        text = extracted.get(label)

        if label == "Item":
            # Item bisa banyak → list of {text, confidence, bbox}
            fields[label] = text if text else []
        else:
            fields[label] = {
                "text":       text,
                "confidence": round(dets[0]["confidence"], 4) if dets else None,
                "bbox":       dets[0]["bbox"] if dets else None,
            }

    return build_response(
        success=True,
        data={
            "fields":            fields,
            "total_detections":  len(result["detections"]),
            "image_shape": {
                "height": result["image_shape"][0],
                "width":  result["image_shape"][1],
            },
            "inference_time_ms": result["inference_time_ms"],
        },
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source",  default="stdin")
    parser.add_argument("--model",   default=str(Path(__file__).parent.parent / "saved_model" / "best.pt"))
    parser.add_argument("--conf",    type=float, default=0.25)
    parser.add_argument("--iou",     type=float, default=0.45)
    parser.add_argument("--ext",     default=".jpg")
    args = parser.parse_args()

    try:
        response = run(args)
    except Exception as e:
        response = build_response(False, error=f"{type(e).__name__}: {str(e)}")
        traceback.print_exc(file=sys.stderr)

    print(json.dumps(response, ensure_ascii=False))