from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

class FraudReport(db.Model):
    """Store fraud detection reports"""
    __tablename__ = 'fraud_reports'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    input_type = db.Column(db.String(20), nullable=False)  # text, image, url, qr, advisor
    content_hash = db.Column(db.String(64), nullable=False)
    risk_score = db.Column(db.Float, nullable=False)
    risk_level = db.Column(db.String(10), nullable=False)  # LOW, MEDIUM, HIGH
    analysis_result = db.Column(db.Text, nullable=False)  # JSON string
    blockchain_hash = db.Column(db.String(66))  # Ethereum transaction hash
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    session_id = db.Column(db.String(36))
    user_agent = db.Column(db.String(255))
    ip_address = db.Column(db.String(45))

class SEBIAdvisor(db.Model):
    """SEBI registered investment advisors cache"""
    __tablename__ = 'sebi_advisors'
    
    id = db.Column(db.Integer, primary_key=True)
    advisor_name = db.Column(db.String(255), nullable=False, index=True)
    advisor_id = db.Column(db.String(50), nullable=False, unique=True)
    registration_number = db.Column(db.String(50), nullable=False)
    registration_date = db.Column(db.Date)
    status = db.Column(db.String(20), default='ACTIVE')  # ACTIVE, SUSPENDED, CANCELLED
    company_name = db.Column(db.String(255))
    contact_info = db.Column(db.Text)  # JSON string
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    verified = db.Column(db.Boolean, default=True)

class FraudPattern(db.Model):
    """Known fraud patterns for ML training"""
    __tablename__ = 'fraud_patterns'
    
    id = db.Column(db.Integer, primary_key=True)
    pattern_type = db.Column(db.String(30), nullable=False)  # text, url, image_text
    pattern_content = db.Column(db.Text, nullable=False)
    is_fraud = db.Column(db.Boolean, nullable=False)
    confidence = db.Column(db.Float, default=1.0)
    source = db.Column(db.String(50))  # manual, reported, ml_detected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class BlockchainTransaction(db.Model):
    """Track blockchain transactions"""
    __tablename__ = 'blockchain_transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    transaction_hash = db.Column(db.String(66), unique=True, nullable=False)
    block_number = db.Column(db.Integer)
    contract_address = db.Column(db.String(42))
    function_name = db.Column(db.String(50), nullable=False)
    data_hash = db.Column(db.String(66))  # Hash of the data stored
    gas_used = db.Column(db.Integer)
    status = db.Column(db.String(20), default='PENDING')  # PENDING, CONFIRMED, FAILED
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    confirmed_at = db.Column(db.DateTime)
    
    # Relationship to fraud report
    fraud_report_id = db.Column(db.String(36), db.ForeignKey('fraud_reports.id'))
    fraud_report = db.relationship('FraudReport', backref='blockchain_transactions')

class AnalysisSession(db.Model):
    """Track user analysis sessions"""
    __tablename__ = 'analysis_sessions'
    
    session_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_type = db.Column(db.String(20), default='INVESTOR')  # INVESTOR, REGULATOR, ADMIN
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(255))
    total_analyses = db.Column(db.Integer, default=0)
    high_risk_detections = db.Column(db.Integer, default=0)
    first_analysis = db.Column(db.DateTime, default=datetime.utcnow)
    last_analysis = db.Column(db.DateTime, default=datetime.utcnow)

class CompanyInfo(db.Model):
    """Company information for announcement verification"""
    __tablename__ = 'company_info'
    
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(255), nullable=False, index=True)
    symbol = db.Column(db.String(20), index=True)
    isin = db.Column(db.String(12), unique=True)
    exchange = db.Column(db.String(10))  # NSE, BSE
    sector = db.Column(db.String(100))
    market_cap = db.Column(db.BigInteger)
    listing_date = db.Column(db.Date)
    official_website = db.Column(db.String(255))
    verified = db.Column(db.Boolean, default=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)