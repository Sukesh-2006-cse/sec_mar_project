from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

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
    return jsonify({'status': 'healthy', 'message': 'TrustX API is running'})

@app.route('/api/detect', methods=['POST'])
def detect_fraud():
    """Simplified fraud detection endpoint"""
    try:
        data = request.get_json() or {}
        input_type = data.get('type', 'unknown')
        content = data.get('content', data.get('url', ''))
        
        # Simplified fraud analysis
        risk_score = 0.0
        indicators = []
        
        if input_type == 'text' and content:
            # Basic keyword detection
            fraud_keywords = ['guaranteed', 'risk-free', 'double money', '100% return', 'urgent']
            found_keywords = [kw for kw in fraud_keywords if kw.lower() in content.lower()]
            
            risk_score = min(len(found_keywords) * 0.2, 1.0)
            if found_keywords:
                indicators.append(f"Contains suspicious keywords: {', '.join(found_keywords)}")
        
        elif input_type == 'url' and content:
            # Basic URL analysis
            if not content.startswith('https://'):
                risk_score += 0.3
                indicators.append('Website does not use secure HTTPS')
            
            suspicious_domains = ['bit.ly', 'tinyurl', 'short.link']
            if any(domain in content for domain in suspicious_domains):
                risk_score += 0.4
                indicators.append('Uses URL shortener (potential phishing)')
        
        # Determine risk level
        if risk_score >= 0.7:
            risk_level = 'HIGH'
        elif risk_score >= 0.4:
            risk_level = 'MEDIUM' 
        else:
            risk_level = 'LOW'
        
        recommendations = []
        if risk_level == 'HIGH':
            recommendations = ['DO NOT INVEST - High fraud risk detected', 'Report to SEBI']
        elif risk_level == 'MEDIUM':
            recommendations = ['Exercise caution', 'Verify independently']
        else:
            recommendations = ['Low risk detected, but always verify investments']
        
        return jsonify({
            'status': 'success',
            'analysis': {
                'input_type': input_type,
                'risk_score': risk_score,
                'risk_level': risk_level,
                'indicators': indicators,
                'recommendations': recommendations
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'failed'}), 500

@app.route('/api/verify/advisor', methods=['POST'])
def verify_advisor():
    """Simplified advisor verification"""
    try:
        data = request.get_json() or {}
        advisor_name = data.get('advisor_name', '')
        
        # Sample registered advisors
        registered_advisors = [
            'Certified Financial Planner Ltd',
            'Wealth Advisory Services',
            'ICICI Securities Limited',
            'HDFC Securities Limited'
        ]
        
        is_registered = any(advisor.lower() in advisor_name.lower() for advisor in registered_advisors)
        
        return jsonify({
            'status': 'success',
            'verification': {
                'advisor_name': advisor_name,
                'is_registered': is_registered,
                'verification_status': 'ACTIVE' if is_registered else 'NOT_FOUND',
                'recommendations': ['Advisor is SEBI registered'] if is_registered else ['DANGER: Advisor not found in SEBI registry']
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5000)),
        debug=True
    )