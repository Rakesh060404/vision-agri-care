import streamlit as st
import tensorflow as tf
import numpy as np
from tensorflow.keras.models import load_model

# Load model
MODEL_PATH = "plant_disease_model.keras"  # update path if needed
model = load_model(MODEL_PATH)

# Load class names (from your dataset)
class_names = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry___healthy', 'Cherry___Powdery_mildew',
    # ... add all 38 classes in correct order
]

# UI
st.title("🌱 Plant Disease Detection")
st.write("Upload a leaf image and the model will predict its disease.")

uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "png", "jpeg"])

if uploaded_file is not None:
    # Read image
    img = tf.keras.utils.load_img(uploaded_file, target_size=(224, 224))
    st.image(img, caption="Uploaded Image", use_column_width=True)

    # Preprocess
    img_array = tf.keras.utils.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)

    # Prediction
    preds = model.predict(img_array)
    pred_class = np.argmax(preds[0])
    confidence = np.max(preds[0]) * 100

    st.success(f"Prediction: **{class_names[pred_class]}** ({confidence:.2f}%)")
