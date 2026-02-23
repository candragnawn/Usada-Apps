from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
model = load_model('model_herbal.h5')
IMG_SIZE = 260

# Gunakan path relatif ke folder static di root project Flask, bukan hardcode E:\dataset\static
STATIC_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

class_names = ['Belimbing_Wuluh', 'Jambu_Biji', 'Katuk', 'Kelor', 'Kemangi', 'Kembang_Sepatu', 'Sirih', 'Sirsak']

@app.route('/', methods=['GET', 'POST'])
def index():
    prediction = None
    confidence = None
    filename = None

    if request.method == 'POST':
        file = request.files['file']
        if file:
            # Pastikan folder static ada
            os.makedirs(STATIC_FOLDER, exist_ok=True)
            # Simpan file dengan nama unik agar tidak overwrite
            import time
            filename = f"herbal_{int(time.time())}.jpg"
            filepath = os.path.join(STATIC_FOLDER, filename)
            file.save(filepath)

            img = image.load_img(filepath, target_size=(IMG_SIZE, IMG_SIZE))
            img_array = image.img_to_array(img) / 255.
            img_array = np.expand_dims(img_array, axis=0)

            pred = model.predict(img_array)
            predicted_class = class_names[np.argmax(pred)]
            confidence = f"{np.max(pred) * 100:.2f}%"

            prediction = predicted_class

    # Kirim hanya nama file, bukan path absolut
    return render_template('index.html', prediction=prediction, confidence=confidence, image_path=filename)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400

    # Pastikan folder static ada
    os.makedirs(STATIC_FOLDER, exist_ok=True)

    # Simpan file dengan nama unik agar tidak overwrite
    import time
    filename = f"herbal_{int(time.time())}.jpg"
    filepath = os.path.join(STATIC_FOLDER, filename)
    file.save(filepath)

    try:
        img = image.load_img(filepath, target_size=(IMG_SIZE, IMG_SIZE))
        img_array = image.img_to_array(img) / 255.
        img_array = np.expand_dims(img_array, axis=0)

        pred = model.predict(img_array)
        predicted_class = class_names[np.argmax(pred)]
        confidence = float(np.max(pred)) * 100

        return jsonify({
            'prediction': predicted_class,
            'confidence': confidence,
            'image_path': filename  # Kirim hanya nama file, bukan path absolut
        })
    except Exception as e:
        # Jika error, hapus file yang gagal diproses
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

