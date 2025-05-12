from dotenv import load_dotenv

load_dotenv(".env")

import os
import torch
import requests
from io import BytesIO
from PIL import Image
from flask import Flask, request, jsonify
from transformers import BlipProcessor, BlipForConditionalGeneration

# Initialize BLIP processor and model
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained(
    "Salesforce/blip-image-captioning-base"
)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# Flask setup
app = Flask(__name__)
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_caption(image: Image.Image) -> str:
    image = image.convert("RGB")
    inputs = processor(images=image, return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = model.generate(**inputs, max_new_tokens=30)
    return processor.decode(outputs[0], skip_special_tokens=True)


@app.route("/generate-caption", methods=["POST"])
def generate_caption_route_handler():
    if "image" in request.files:
        image = request.files["image"]
        if image.filename == "":
            return jsonify({"error": "No selected file"}), 400
        if image and allowed_file(image.filename):
            try:
                uploaded_image = Image.open(image.stream)
                caption = generate_caption(uploaded_image)
                return jsonify({"description": caption}), 200
            except Exception as e:
                return jsonify({"error": f"Error processing image: {str(e)}"}), 500

    elif "image_url" in request.form:
        image_url = request.form["image_url"]
        try:
            headers = {
                "User-Agent": "Mozilla/5.0",
                "Accept": "image/webp,*/*",
            }
            response = requests.get(image_url, headers=headers, timeout=10)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content))
            caption = generate_caption(image)
            return jsonify({"description": caption}), 200
        except Exception as e:
            return jsonify({"error": f"Error loading image from URL: {str(e)}"}), 500

    return jsonify({"error": "No image provided."}), 400


if __name__ == "__main__":
    app.run(
        debug=(os.environ.get("DEBUG") == "true" , False),
        port=int(os.environ.get("PORT", 8000)),
    )
