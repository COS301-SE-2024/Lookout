from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2

app = Flask(__name__)

CORS(app)

# Load your pre-trained model
saved_model = tf.keras.models.load_model('models/image_classifier.keras')

# Define the class names
class_names = ['buffalo', 'elephant', 'leopard', 'lion', 'rhino']

@app.route('/predict', methods=['POST'])
def predict():
    # Check if an image is in the request
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']

    # Convert the file to an OpenCV image
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    img = cv2.resize(img, (256, 256))  # Resize to model input size
    img = img / 255.0  # Normalize to [0, 1]

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
