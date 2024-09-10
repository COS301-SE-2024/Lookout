from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import requests
from io import BytesIO

app = Flask(__name__)

CORS(app)

# Load your pre-trained model
saved_model = tf.keras.models.load_model('models/image_classifier.keras')

# Define the class names
class_names = ['buffalo', 'elephant', 'leopard', 'lion', 'rhino']

def load_and_preprocess_image(image_data):
    # Convert the image to an OpenCV format, resize and normalize
    img = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)
    img = cv2.resize(img, (256, 256))  # Resize to model input size
    img = img / 255.0  # Normalize to [0, 1]
    return img

@app.route('/predict', methods=['POST'])
def predict():
    # Check if an image is in the request
    if 'image' in request.files:
        # Process uploaded image file
        file = request.files['image']
        image_data = file.read()
    elif 'image_url' in request.json:
        # Process image from URL
        image_url = request.json['image_url']
        try:
            response = requests.get(image_url)
            if response.status_code != 200:
                return jsonify({'error': 'Failed to download image from URL'}), 400
            image_data = response.content
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    else:
        return jsonify({'error': 'No image uploaded or URL provided'}), 400

    # Load and preprocess image
    img = load_and_preprocess_image(image_data)

    # Predict class probabilities
    yhat = saved_model.predict(np.expand_dims(img, 0))

    # Determine predicted class
    predicted_class_index = np.argmax(yhat)
    predicted_class_name = class_names[predicted_class_index]
    predicted_probability = yhat[0][predicted_class_index]

    # Return the prediction
    return jsonify({
        'predicted_class': predicted_class_name,
        'probability': float(predicted_probability)
    })

if __name__ == '__main__':
    app.run(debug=True)
