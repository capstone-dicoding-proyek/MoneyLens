from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timezone
import os, sys, re
from pathlib import Path
from dotenv import load_dotenv
import io
from PIL import Image as PILImage

load_dotenv()


sys.path.insert(0, str(Path(__file__).parent / "src"))

from inference import OCRInference, LABEL_NAMES

app = Flask(__name__)
CORS(app)

# ── Load model sekali saat startup ───────────────────────────────────────────
MODEL_PATH = Path(__file__).parent / "saved_model" / "best.pt"
ocr = OCRInference(
    model_path=str(MODEL_PATH),
    conf_threshold=0.25,
    iou_threshold=0.45,
    device="cpu",
)
print("✅ Model loaded")


# ── Helpers ───────────────────────────────────────────────────────────────────
def parse_number(text: str | None) -> float | None:
    """'28,000' / '28.000' / 'Rp 28.000' → 28000.0"""
    if not text:
        return None
    cleaned = re.sub(r"[^\d]", "", text)   # hapus semua non-digit
    return float(cleaned) if cleaned else None


def parse_date(text: str | None) -> str | None:
    """'28/04/2026' → ISO 8601 string, None kalau gagal"""
    if not text:
        return None
    for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d"):
        try:
            dt = datetime.strptime(text.strip(), fmt)
            return dt.replace(tzinfo=timezone.utc).isoformat()
        except ValueError:
            continue
    return None


def map_fields(fields: dict) -> list[dict]:
    """Map output model → format response API."""

    def text_of(label):
        f = fields.get(label, {})
        return f.get("text") if isinstance(f, dict) else None

    # Items
    raw_items = fields.get("Item", [])
    items = []
    for it in raw_items:
        raw_text = it.get("text") if isinstance(it, dict) else str(it)
        # Coba pisah nama & harga dari text (misal: "Kopi Susu 25000")
        match = re.search(r"(\d[\d,.\s]+)$", raw_text or "")
        price = parse_number(match.group(1)) if match else None
        name  = raw_text[:match.start()].strip() if match else raw_text

        items.append({
            "detailType": None,
            "name":       name,
            "quantity":   None,
            "unitPrice":  price,
            "totalPrice": price,
        })

    total = parse_number(text_of("TotalPrice")) \
            or parse_number(text_of("Subtotal")) \
            or (items[0]["totalPrice"] if len(items) == 1 else None)

    return [{
        "description":     text_of("Address"),
        "nameIncome":      text_of("Title"),
        "totalAmount":     total,
        "transactionDate": parse_date(text_of("Date")),
        "items":           items,
    }]


# ── Routes ────────────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/ocr", methods=["POST"])
def ocr_endpoint():
    image = request.files.get("image")
    if not image:
        return jsonify({"success": False, "message": "image required"}), 400

    # Simpan sementara
    try:
        img_bytes = image.read()
        pil_img = PILImage.open(io.BytesIO(img_bytes)).convert("RGB")
        result = ocr.run_inference(pil_img)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

    # Build fields (sama seperti inference_service sebelumnya)
    extracted = result["extracted"]
    fields = {}
    for label in LABEL_NAMES:
        dets = result["grouped"].get(label, [])
        text = extracted.get(label)
        if label == "Item":
            fields[label] = text if text else []
        else:
            fields[label] = {
                "text":       text,
                "confidence": round(dets[0]["confidence"], 4) if dets else None,
                "bbox":       dets[0]["bbox"] if dets else None,
            }

    data = map_fields(fields)

    return jsonify({"success": True, "data": data})


if __name__ == "__main__":
    app.run(
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 7860)),   # 7860 = default HF Spaces
        debug=os.getenv("DEBUG", "false").lower() == "true",
    )