from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///trustx.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

# Initialize extensions
db = SQLAlchemy(app)

# Import routes and models
from app.routes import api_bp
from app.models import *

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def index():
    return jsonify({
        'message': 'TrustX - AI + Blockchain Powered Investor Protection Network',
        'version': '1.0.0',
        'status': 'active',
        'endpoints': {
            'fraud_detection': '/api/detect',
            'sebi_verification': '/api/verify/advisor',
            'blockchain_log': '/api/blockchain/log',
            'analysis_history': '/api/history'
        }
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'database': 'connected'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5000)),
        debug=os.getenv('FLASK_ENV') == 'development'
    )