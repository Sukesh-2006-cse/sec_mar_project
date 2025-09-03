from flask import Blueprint, request, jsonify
from services.fraud_detection import FraudDetectionService
from services.sebi_verification import SEBIVerificationService
from services.blockchain_service import BlockchainService
from services.analysis_service import AnalysisService
import traceback

api_bp = Blueprint('api', __name__)

# Initialize services
fraud_detector = FraudDetectionService()
sebi_verifier = SEBIVerificationService()
blockchain_service = BlockchainService()
analysis_service = AnalysisService()

@api_bp.route('/detect', methods=['POST'])
def detect_fraud():
    """Main fraud detection endpoint supporting multiple input types"""
    try:
        data = request.get_json() if request.is_json else {}
        files = request.files
        
        input_type = data.get('type', 'unknown')
        analysis_result = {}
        
        if input_type == 'text':
            text_content = data.get('content', '')
            analysis_result = fraud_detector.analyze_text(text_content)
            
        elif input_type == 'url':
            url = data.get('url', '')
            analysis_result = fraud_detector.analyze_url(url)
            
        elif input_type == 'image' and 'image' in files:
            image_file = files['image']
            analysis_result = fraud_detector.analyze_image(image_file)
            
        elif input_type == 'qr' and 'qr_image' in files:
            qr_file = files['qr_image']
            analysis_result = fraud_detector.analyze_qr_code(qr_file)
            
        elif input_type == 'advisor':
            advisor_name = data.get('advisor_name', '')
            analysis_result = sebi_verifier.verify_advisor(advisor_name)
            
        else:
            return jsonify({'error': 'Invalid input type or missing data'}), 400
        
        # Log to blockchain
        if analysis_result.get('risk_score', 0) > 0.7:
            blockchain_result = blockchain_service.log_fraud_report(analysis_result)
            analysis_result['blockchain_hash'] = blockchain_result.get('hash')
        
        return jsonify({
            'status': 'success',
            'analysis': analysis_result,
            'timestamp': analysis_service.get_current_timestamp()
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed',
            'trace': traceback.format_exc()
        }), 500

@api_bp.route('/verify/advisor', methods=['POST'])
def verify_advisor():
    """Verify investment advisor against SEBI registry"""
    try:
        data = request.get_json()
        advisor_name = data.get('advisor_name', '')
        advisor_id = data.get('advisor_id', '')
        
        result = sebi_verifier.verify_advisor(advisor_name, advisor_id)
        
        return jsonify({
            'status': 'success',
            'verification': result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/analyze/announcement', methods=['POST'])
def analyze_announcement():
    """Analyze corporate announcement credibility"""
    try:
        data = request.get_json()
        announcement_text = data.get('text', '')
        company_name = data.get('company', '')
        
        result = fraud_detector.analyze_corporate_announcement(
            announcement_text, company_name
        )
        
        return jsonify({
            'status': 'success',
            'credibility_analysis': result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/blockchain/log', methods=['POST'])
def log_to_blockchain():
    """Log fraud report to blockchain"""
    try:
        data = request.get_json()
        report_data = data.get('report', {})
        
        result = blockchain_service.log_fraud_report(report_data)
        
        return jsonify({
            'status': 'success',
            'blockchain_result': result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/history', methods=['GET'])
def get_analysis_history():
    """Get analysis history for user/session"""
    try:
        session_id = request.args.get('session_id')
        limit = int(request.args.get('limit', 10))
        
        history = analysis_service.get_analysis_history(session_id, limit)
        
        return jsonify({
            'status': 'success',
            'history': history
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/stats/dashboard', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics for regulators"""
    try:
        stats = analysis_service.get_dashboard_statistics()
        
        return jsonify({
            'status': 'success',
            'statistics': stats
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500