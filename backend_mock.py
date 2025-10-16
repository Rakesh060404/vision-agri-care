from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Mock class names for testing
class_names = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry___healthy', 'Cherry___Powdery_mildew',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust',
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy',
    'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot', 'Peach___healthy', 'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___Late_blight',
    'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

# Treatment data for different diseases
treatment_data = {
    "Apple___Apple_scab": {
        "treatments": [
            "Apply fungicide containing myclobutanil or propiconazole",
            "Remove fallen leaves and debris in autumn",
            "Prune to improve air circulation",
            "Use resistant apple varieties"
        ],
        "remedies": [
            "Baking soda spray (1 tsp per quart of water)",
            "Neem oil application every 2 weeks",
            "Copper fungicide for organic control",
            "Proper tree spacing and pruning"
        ],
        "prevention": [
            "Plant resistant varieties",
            "Avoid overhead watering",
            "Clean up fallen leaves regularly",
            "Apply preventive fungicide in spring"
        ],
        "severity": "medium"
    },
    "Potato___Late_blight": {
        "treatments": [
            "Apply copper-based fungicide every 7-10 days",
            "Remove affected leaves and destroy them",
            "Improve air circulation around plants",
            "Use resistant varieties for future planting"
        ],
        "remedies": [
            "Baking soda spray (1 tsp per quart of water)",
            "Neem oil application every 2 weeks",
            "Bordeaux mixture for severe cases",
            "Proper plant spacing for air flow"
        ],
        "prevention": [
            "Plant in well-draining soil",
            "Avoid overhead watering",
            "Rotate crops annually",
            "Apply preventive fungicide in humid conditions"
        ],
        "severity": "high"
    },
    "Tomato___Early_blight": {
        "treatments": [
            "Apply chlorothalonil or copper fungicide",
            "Remove lower leaves that touch the soil",
            "Mulch around plants to reduce soil splash",
            "Prune for better air circulation"
        ],
        "remedies": [
            "Compost tea application weekly",
            "Milk spray (1:10 ratio with water)",
            "Garlic and pepper spray",
            "Proper plant support and spacing"
        ],
        "prevention": [
            "Use certified disease-free seeds",
            "Maintain proper plant nutrition",
            "Avoid working with wet plants",
            "Clean garden tools regularly"
        ],
        "severity": "medium"
    }
}

def preprocess_image(image_data):
    """Preprocess image for model prediction (mock version)"""
    try:
        # Decode base64 image
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # For mock version, just validate the image
        return True
    except Exception as e:
        raise Exception(f"Error preprocessing image: {str(e)}")

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Preprocess the image (mock validation)
        preprocess_image(data['image'])
        
        # Mock prediction - randomly select a disease
        predicted_class = random.choice(class_names)
        confidence = round(random.uniform(75, 95), 2)
        
        # Determine if plant is healthy
        is_healthy = 'healthy' in predicted_class.lower()
        
        # Get treatment data if not healthy
        treatment = None
        if not is_healthy:
            # Try to find treatment data for this specific disease
            treatment = treatment_data.get(predicted_class, {
                "treatments": ["Consult with local agricultural extension office"],
                "remedies": ["General plant care and monitoring"],
                "prevention": ["Follow good agricultural practices"],
                "severity": "medium"
            })
        
        result = {
            'disease': predicted_class.replace('_', ' ').replace('  ', ' '),
            'confidence': confidence,
            'isHealthy': is_healthy,
            'treatment': treatment
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        
        if 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        user_message = data['message']
        
        # Enhanced responses for plant disease chatbot
        responses = {
            'fertilizer': "For healthy plant growth, I recommend using balanced NPK fertilizers (10-10-10) for general crops. For leafy vegetables, use higher nitrogen content (20-10-10). Always test your soil first and apply fertilizer based on soil test results.",
            'watering': "Water your plants early morning or late evening to reduce evaporation. Most crops need 1-2 inches of water per week. Check soil moisture by inserting your finger 2 inches deep - if it's dry, it's time to water.",
            'pest': "Common organic pest control methods include neem oil spray, companion planting with marigolds, and introducing beneficial insects like ladybugs. For severe infestations, consider targeted organic pesticides.",
            'soil': "Healthy soil should be well-draining with good organic matter. Add compost regularly, maintain pH between 6.0-7.0 for most crops, and rotate crops to prevent nutrient depletion.",
            'disease': "For plant disease identification, I recommend using our Disease Detection feature. You can upload a photo of the affected plant, and I'll help identify the disease and provide treatment recommendations.",
            'crop_rotation': "Crop rotation is essential for soil health. Rotate between nitrogen-fixing legumes, heavy feeders like corn, and light feeders like root vegetables. A typical 4-year rotation might be: Year 1 - Legumes, Year 2 - Leafy greens, Year 3 - Root crops, Year 4 - Fallow or cover crops.",
            'organic': "Organic farming focuses on natural methods. Use compost and organic fertilizers, practice companion planting, encourage beneficial insects, and use organic-approved pest control methods like neem oil, diatomaceous earth, and beneficial bacteria.",
            'tomato': "Tomatoes need full sun (6-8 hours), well-draining soil, and consistent watering. Common issues include blossom end rot (add calcium), early blight (improve air circulation), and aphids (use neem oil).",
            'potato': "Potatoes prefer cool weather and loose, well-drained soil. Plant in hills or rows, keep soil consistently moist, and watch for Colorado potato beetles and late blight disease.",
            'apple': "Apple trees need full sun, well-drained soil, and regular pruning. Common diseases include apple scab (fungicide treatment), fire blight (prune infected branches), and codling moth (pheromone traps).",
            'default': "That's a great question! For specific agricultural advice, I recommend consulting with your local agricultural extension office. They can provide region-specific guidance based on your climate and soil conditions. You can also use our Disease Detection feature to identify plant problems from photos."
        }
        
        # Simple keyword matching for responses
        lower_message = user_message.lower()
        
        if any(word in lower_message for word in ['fertilizer', 'nutrient', 'npk', 'feed']):
            response = responses['fertilizer']
        elif any(word in lower_message for word in ['water', 'irrigation', 'moisture', 'dry']):
            response = responses['watering']
        elif any(word in lower_message for word in ['pest', 'insect', 'bug', 'aphid', 'beetle']):
            response = responses['pest']
        elif any(word in lower_message for word in ['soil', 'compost', 'ph', 'drainage']):
            response = responses['soil']
        elif any(word in lower_message for word in ['disease', 'sick', 'infected', 'blight', 'mold']):
            response = responses['disease']
        elif any(word in lower_message for word in ['rotation', 'rotate', 'crop rotation']):
            response = responses['crop_rotation']
        elif any(word in lower_message for word in ['organic', 'natural', 'chemical-free']):
            response = responses['organic']
        elif any(word in lower_message for word in ['tomato', 'tomatoes']):
            response = responses['tomato']
        elif any(word in lower_message for word in ['potato', 'potatoes']):
            response = responses['potato']
        elif any(word in lower_message for word in ['apple', 'apples', 'apple tree']):
            response = responses['apple']
        else:
            response = responses['default']
        
        return jsonify({
            'response': response,
            'timestamp': str(datetime.now())
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Plant Disease Detection API is running (Mock Mode)'})

if __name__ == '__main__':
    print("Starting Plant Disease Detection API (Mock Mode)...")
    print("Note: This is a mock version for testing. Install TensorFlow to use the real model.")
    print(f"Number of classes: {len(class_names)}")
    app.run(debug=True, host='0.0.0.0', port=5000)
