from flask import Flask,request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

CORS(app)
@app.route("/ocr", methods=["POST"])
def ocr():
    image = request.files.get("image")
    print(image)
    if not image:
        return jsonify({
            "success": False,
            "message": "image required"
        }), 400

    data = [
        {
            "description": None,
            "nameIncome": None,
            "totalAmount": 2233232,
            "transactionDate": "2026-05-29T00:00:00.000Z",
            "items": [
                {
                    "detailType": None,
                    "name": "asdp[askd[p",
                    "quantity": None,
                    "unitPrice": 2233232,
                    "totalPrice": 2233232
                }
            ]
        }
    ]

    return jsonify({
        "success": False,
        "data": data
    })

if __name__ == "__main__":
    app.run(
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 5000)),
        debug=os.getenv("DEBUG", "true").lower() == "true"
    )