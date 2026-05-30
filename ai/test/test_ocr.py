import json
import numpy as np
from PIL import Image
import cv2
from ultralytics import YOLO
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-printed")
ocr_model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-printed").to(device)

IMG_PATH = "D:/dump/WhatsApp_Image_2026-05-14_at_23.04.18.jpeg"


def extract_text(crop_img):
    # Langsung convert BGR → RGB tanpa preprocessing
    rgb = cv2.cvtColor(crop_img, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(rgb)

    pixel_values = processor(images=pil_img, return_tensors="pt").pixel_values.to(device)

    generated_ids = ocr_model.generate(
        pixel_values,
        max_length=64,
        num_beams=5,
        early_stopping=True,
        no_repeat_ngram_size=2
    )

    return processor.batch_decode(generated_ids, skip_special_tokens=True)[0].strip()


model = YOLO("D:/coding/js/MoneyLens/ai/saved_model/best.pt")
image = cv2.imread(IMG_PATH)

if image is None:
    print("❌ Gambar tidak ditemukan!")
else:
    results = model(image)[0]
    output_text = []

    for box in results.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        conf = float(box.conf[0])

        if conf < 0.2:
            continue

        output_text.append({
            "label": model.names[int(box.cls[0])],
            "confidence": round(conf, 3),
            "text": extract_text(image[y1:y2, x1:x2])
        })

    print(json.dumps(output_text, indent=2, ensure_ascii=False))