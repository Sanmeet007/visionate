import os
import numpy as np
import pickle
import tensorflow as tf
from flask import Flask, request, jsonify
from tensorflow.keras.models import Model
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.preprocessing.sequence import pad_sequences
import requests
from io import BytesIO
from werkzeug.utils import secure_filename
from tensorflow.keras.saving import register_keras_serializable
from dotenv import load_dotenv

load_dotenv(".env")

app = Flask(__name__)


ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}


register_keras_serializable()


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


mobilenet_model = MobileNetV2(weights="imagenet")
mobilenet_model = Model(
    inputs=mobilenet_model.inputs, outputs=mobilenet_model.layers[-2].output
)

try:
    model = tf.keras.models.load_model("mymodel.h5")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

try:
    with open("tokenizer.pkl", "rb") as tokenizer_file:
        tokenizer = pickle.load(tokenizer_file)
except Exception as e:
    print(f"Error loading tokenizer: {e}")
    tokenizer = None


def get_word_from_index(index, tokenizer):
    return next(
        (word for word, idx in tokenizer.word_index.items() if idx == index), None
    )


def predict_caption(model, image_features, tokenizer, max_caption_length):
    caption = "startseq"
    for _ in range(max_caption_length):
        sequence = tokenizer.texts_to_sequences([caption])[0]
        sequence = pad_sequences([sequence], maxlen=max_caption_length)
        yhat = model.predict([image_features, sequence], verbose=0)
        predicted_index = np.argmax(yhat)
        predicted_word = get_word_from_index(predicted_index, tokenizer)
        caption += " " + predicted_word
        if predicted_word is None or predicted_word == "endseq":
            break
    return caption


@app.route("/generate_caption", methods=["POST"])
def generate_caption():
    if "image" not in request.files:
        return jsonify({"error": "No image file part"}), 400
    image = request.files["image"]

    if image.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if image and allowed_file(image.filename):

        image_content = image.read()

        try:

            uploaded_image = load_img(BytesIO(image_content), target_size=(224, 224))
            image_array = img_to_array(uploaded_image)
            image_array = image_array.reshape(
                (1, image_array.shape[0], image_array.shape[1], image_array.shape[2])
            )
            image_array = preprocess_input(image_array)

            image_features = mobilenet_model.predict(image_array, verbose=0)

            max_caption_length = 34
            generated_caption = predict_caption(
                model, image_features, tokenizer, max_caption_length
            )
            generated_caption = generated_caption.replace("startseq", "").replace(
                "endseq", ""
            )

        except Exception as e:
            return jsonify({"error": f"Error processing image: {e}"}), 500

        return jsonify({"description": generated_caption}), 200

    return jsonify({"error": "Invalid file type. Please upload a valid image."}), 400


if __name__ == "__main__":
    app.run(debug=True, port=os.environ.get("PORT", 5000))
