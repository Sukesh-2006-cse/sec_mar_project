import re
import hashlib
import os
from datetime import datetime
from typing import Dict, List, Any
import numpy as np
from PIL import Image
import cv2
import pytesseract
from pyzbar import pyzbar
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch

class FraudDetectionService:
    """AI-powered fraud detection service for multiple input types"""
    
    def __init__(self):
        self.initialize_models()
        self.fraud_keywords = self.load_fraud_keywords()
        self.suspicious_patterns = self.load_suspicious_patterns()
        
    def initialize_models(self):
        """Initialize AI models for fraud detection"""
        try:
            # Initialize sentiment analyzer
            nltk.download('vader_lexicon', quiet=True)
            self.sentiment_analyzer = SentimentIntensityAnalyzer()
            
            # Initialize FinBERT for financial text analysis
            self.financial_classifier = pipeline(
                "sentiment-analysis", 
                model="ProsusAI/finbert",
                device=0 if torch.cuda.is_available() else -1
            )
            
            # Initialize text classification model
            self.text_classifier = pipeline(
                "text-classification",
                model="distilbert-base-uncased",
                device=0 if torch.cuda.is_available() else -1
            )
            
        except Exception as e:
            print(f"Warning: Could not initialize AI models: {e}")
            self.financial_classifier = None
            self.text_classifier = None
            
    def load_fraud_keywords(self) -> List[str]:
        """Load common fraud keywords and phrases"""
        return [
            "guaranteed returns", "risk-free", "double your money",
            "limited time offer", "insider trading", "hot tip",
            "pump and dump", "ponzi scheme", "get rich quick",
            "no risk", "guaranteed profit", "easy money",
            "exclusive opportunity", "secret strategy", "sure shot",
            "100% returns", "daily profit", "overnight success",
            "investment advisory without sebi", "unregistered advisor",
            "fake sebi certificate", "bogus investment scheme"
        ]
    
    def load_suspicious_patterns(self) -> Dict[str, str]:
        """Load regex patterns for suspicious content"""
        return {
            'unrealistic_returns': r'(\d{2,3})%?\s*(return|profit|gain)',
            'urgency': r'(urgent|hurry|limited|expire|deadline|now or never)',
            'guarantee': r'(guarantee|assured|sure|certain|promise)',
            'phone_numbers': r'(\+?\d{10,})',
            'crypto_wallet': r'([13][a-km-z1-9]{25,34}|0x[a-fA-F0-9]{40})',
            'suspicious_urls': r'(bit\.ly|tinyurl|t\.co|short\.link)'
        }
    
    def analyze_text(self, text: str) -> Dict[str, Any]:
        """Analyze text content for fraud indicators"""
        if not text:
            return {'error': 'No text provided'}
        
        result = {
            'input_type': 'text',
            'content_hash': hashlib.md5(text.encode()).hexdigest(),
            'risk_score': 0.0,
            'risk_level': 'LOW',
            'indicators': [],
            'analysis': {},
            'recommendations': []
        }
        
        # Basic fraud keyword detection
        fraud_score = self.detect_fraud_keywords(text)
        result['analysis']['keyword_fraud_score'] = fraud_score
        
        # Pattern analysis
        pattern_score = self.analyze_patterns(text)
        result['analysis']['pattern_score'] = pattern_score
        
        # Sentiment analysis
        sentiment = self.sentiment_analyzer.polarity_scores(text)
        result['analysis']['sentiment'] = sentiment
        
        # Financial sentiment analysis using FinBERT
        if self.financial_classifier:
            try:
                fin_sentiment = self.financial_classifier(text[:512])  # Limit text length
                result['analysis']['financial_sentiment'] = fin_sentiment[0]
            except Exception as e:
                result['analysis']['financial_sentiment_error'] = str(e)
        
        # Calculate overall risk score
        risk_components = [
            fraud_score * 0.4,
            pattern_score * 0.3,
            min(abs(sentiment['compound']), 1) * 0.2,  # High sentiment can be suspicious
            self.check_urgency_language(text) * 0.1
        ]
        
        result['risk_score'] = min(sum(risk_components), 1.0)
        result['risk_level'] = self.get_risk_level(result['risk_score'])
        
        # Generate indicators and recommendations
        result['indicators'] = self.generate_text_indicators(text, result['analysis'])
        result['recommendations'] = self.generate_recommendations(result['risk_level'])
        
        return result
    
    def analyze_image(self, image_file) -> Dict[str, Any]:
        """Analyze image for fraud indicators using OCR and visual analysis"""
        try:
            # Read image
            image = Image.open(image_file)
            image_array = np.array(image)
            
            result = {
                'input_type': 'image',
                'content_hash': self.get_image_hash(image_array),
                'risk_score': 0.0,
                'risk_level': 'LOW',
                'indicators': [],
                'analysis': {},
                'recommendations': []
            }
            
            # OCR text extraction
            try:
                extracted_text = pytesseract.image_to_string(image)
                result['analysis']['extracted_text'] = extracted_text
                
                # Analyze extracted text for fraud
                if extracted_text.strip():
                    text_analysis = self.analyze_text(extracted_text)
                    result['analysis']['text_fraud_analysis'] = text_analysis
                    result['risk_score'] = text_analysis['risk_score']
                
            except Exception as e:
                result['analysis']['ocr_error'] = str(e)
            
            # Image-specific fraud detection
            image_fraud_score = self.detect_image_fraud_indicators(image_array)
            result['analysis']['image_fraud_score'] = image_fraud_score
            
            # Update risk score with image analysis
            result['risk_score'] = max(result['risk_score'], image_fraud_score)
            result['risk_level'] = self.get_risk_level(result['risk_score'])
            
            # Generate indicators
            result['indicators'] = self.generate_image_indicators(result['analysis'])
            result['recommendations'] = self.generate_recommendations(result['risk_level'])
            
            return result
            
        except Exception as e:
            return {'error': f'Image analysis failed: {str(e)}'}
    
    def analyze_qr_code(self, qr_image_file) -> Dict[str, Any]:
        """Analyze QR code for malicious content"""
        try:
            image = Image.open(qr_image_file)
            image_array = np.array(image)
            
            result = {
                'input_type': 'qr',
                'content_hash': self.get_image_hash(image_array),
                'risk_score': 0.0,
                'risk_level': 'LOW',
                'indicators': [],
                'analysis': {},
                'recommendations': []
            }
            
            # Decode QR codes
            qr_codes = pyzbar.decode(image_array)
            
            if not qr_codes:
                return {'error': 'No QR code found in image'}
            
            for qr_code in qr_codes:
                qr_data = qr_code.data.decode('utf-8')
                result['analysis']['qr_content'] = qr_data
                
                # Analyze QR content
                if qr_data.startswith(('http://', 'https://')):
                    # URL analysis
                    url_analysis = self.analyze_url(qr_data)
                    result['analysis']['url_analysis'] = url_analysis
                    result['risk_score'] = url_analysis['risk_score']
                else:
                    # Text analysis
                    text_analysis = self.analyze_text(qr_data)
                    result['analysis']['text_analysis'] = text_analysis
                    result['risk_score'] = text_analysis['risk_score']
            
            result['risk_level'] = self.get_risk_level(result['risk_score'])
            result['indicators'] = self.generate_qr_indicators(result['analysis'])
            result['recommendations'] = self.generate_recommendations(result['risk_level'])
            
            return result
            
        except Exception as e:
            return {'error': f'QR code analysis failed: {str(e)}'}
    
    def analyze_url(self, url: str) -> Dict[str, Any]:
        """Analyze URL for malicious indicators"""
        if not url:
            return {'error': 'No URL provided'}
        
        result = {
            'input_type': 'url',
            'content_hash': hashlib.md5(url.encode()).hexdigest(),
            'risk_score': 0.0,
            'risk_level': 'LOW',
            'indicators': [],
            'analysis': {},
            'recommendations': []
        }
        
        # Parse URL
        parsed_url = urlparse(url)
        result['analysis']['domain'] = parsed_url.netloc
        result['analysis']['path'] = parsed_url.path
        
        # Domain analysis
        domain_score = self.analyze_domain(parsed_url.netloc)
        result['analysis']['domain_analysis'] = domain_score
        
        # URL pattern analysis
        url_patterns = self.analyze_url_patterns(url)
        result['analysis']['url_patterns'] = url_patterns
        
        # Try to fetch and analyze content
        try:
            response = requests.get(url, timeout=10, headers={
                'User-Agent': 'TrustX-FraudDetector/1.0'
            })
            
            if response.status_code == 200:
                # Analyze page content
                soup = BeautifulSoup(response.content, 'html.parser')
                page_text = soup.get_text()[:2000]  # Limit text length
                
                content_analysis = self.analyze_text(page_text)
                result['analysis']['content_analysis'] = content_analysis
                
                # Check for SSL
                result['analysis']['ssl_enabled'] = url.startswith('https://')
                
        except Exception as e:
            result['analysis']['fetch_error'] = str(e)
        
        # Calculate risk score
        risk_components = [
            domain_score.get('risk_score', 0) * 0.4,
            url_patterns.get('risk_score', 0) * 0.3,
            result['analysis'].get('content_analysis', {}).get('risk_score', 0) * 0.3
        ]
        
        result['risk_score'] = min(sum(risk_components), 1.0)
        result['risk_level'] = self.get_risk_level(result['risk_score'])
        
        result['indicators'] = self.generate_url_indicators(result['analysis'])
        result['recommendations'] = self.generate_recommendations(result['risk_level'])
        
        return result
    
    def analyze_corporate_announcement(self, announcement_text: str, company_name: str) -> Dict[str, Any]:
        """Analyze corporate announcement for authenticity"""
        result = {
            'input_type': 'corporate_announcement',
            'content_hash': hashlib.md5(announcement_text.encode()).hexdigest(),
            'risk_score': 0.0,
            'risk_level': 'LOW',
            'indicators': [],
            'analysis': {},
            'recommendations': []
        }
        
        # Basic text analysis
        text_analysis = self.analyze_text(announcement_text)
        result['analysis']['text_analysis'] = text_analysis
        
        # Company-specific checks
        company_analysis = self.verify_company_announcement(company_name, announcement_text)
        result['analysis']['company_verification'] = company_analysis
        
        # Calculate credibility score
        credibility_factors = [
            1 - text_analysis['risk_score'],  # Lower fraud score = higher credibility
            company_analysis.get('credibility_score', 0.5),
            self.check_announcement_format(announcement_text)
        ]
        
        result['credibility_score'] = sum(credibility_factors) / len(credibility_factors)
        result['risk_score'] = 1 - result['credibility_score']
        result['risk_level'] = self.get_risk_level(result['risk_score'])
        
        result['indicators'] = self.generate_announcement_indicators(result['analysis'])
        result['recommendations'] = self.generate_recommendations(result['risk_level'])
        
        return result
    
    # Helper methods
    def detect_fraud_keywords(self, text: str) -> float:
        """Detect fraud keywords in text"""
        text_lower = text.lower()
        matches = sum(1 for keyword in self.fraud_keywords if keyword in text_lower)
        return min(matches / len(self.fraud_keywords) * 2, 1.0)
    
    def analyze_patterns(self, text: str) -> float:
        """Analyze suspicious patterns in text"""
        pattern_matches = 0
        total_patterns = len(self.suspicious_patterns)
        
        for pattern_name, pattern in self.suspicious_patterns.items():
            if re.search(pattern, text, re.IGNORECASE):
                pattern_matches += 1
        
        return pattern_matches / total_patterns if total_patterns > 0 else 0.0
    
    def check_urgency_language(self, text: str) -> float:
        """Check for urgency-creating language"""
        urgency_words = ['urgent', 'hurry', 'limited time', 'act now', 'deadline']
        text_lower = text.lower()
        urgency_score = sum(1 for word in urgency_words if word in text_lower)
        return min(urgency_score / len(urgency_words), 1.0)
    
    def get_risk_level(self, risk_score: float) -> str:
        """Convert risk score to risk level"""
        if risk_score >= 0.7:
            return 'HIGH'
        elif risk_score >= 0.4:
            return 'MEDIUM'
        else:
            return 'LOW'
    
    def get_image_hash(self, image_array: np.ndarray) -> str:
        """Generate hash for image"""
        return hashlib.md5(image_array.tobytes()).hexdigest()
    
    def detect_image_fraud_indicators(self, image_array: np.ndarray) -> float:
        """Detect visual fraud indicators in images"""
        # Placeholder for advanced image analysis
        # Could include logo verification, certificate authenticity, etc.
        return 0.0
    
    def analyze_domain(self, domain: str) -> Dict[str, Any]:
        """Analyze domain for suspicious characteristics"""
        analysis = {
            'risk_score': 0.0,
            'indicators': []
        }
        
        # Check for suspicious TLDs
        suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.click', '.download']
        if any(domain.endswith(tld) for tld in suspicious_tlds):
            analysis['risk_score'] += 0.3
            analysis['indicators'].append('Suspicious top-level domain')
        
        # Check domain length and structure
        if len(domain) > 30:
            analysis['risk_score'] += 0.2
            analysis['indicators'].append('Unusually long domain name')
        
        return analysis
    
    def analyze_url_patterns(self, url: str) -> Dict[str, Any]:
        """Analyze URL for suspicious patterns"""
        analysis = {
            'risk_score': 0.0,
            'indicators': []
        }
        
        # Check for URL shorteners
        shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'short.link']
        if any(shortener in url for shortener in shorteners):
            analysis['risk_score'] += 0.4
            analysis['indicators'].append('URL shortener detected')
        
        return analysis
    
    def verify_company_announcement(self, company_name: str, announcement: str) -> Dict[str, Any]:
        """Verify company announcement authenticity"""
        # Placeholder for company verification logic
        return {
            'credibility_score': 0.5,
            'verified_company': False,
            'indicators': []
        }
    
    def check_announcement_format(self, announcement: str) -> float:
        """Check if announcement follows standard format"""
        # Placeholder for format checking
        return 0.5
    
    def generate_text_indicators(self, text: str, analysis: Dict) -> List[str]:
        """Generate human-readable indicators for text analysis"""
        indicators = []
        
        if analysis.get('keyword_fraud_score', 0) > 0.3:
            indicators.append("Contains common fraud keywords")
        
        if analysis.get('pattern_score', 0) > 0.5:
            indicators.append("Matches suspicious text patterns")
        
        sentiment = analysis.get('sentiment', {})
        if sentiment.get('compound', 0) > 0.8:
            indicators.append("Extremely positive language (suspicious for investments)")
        
        return indicators
    
    def generate_image_indicators(self, analysis: Dict) -> List[str]:
        """Generate indicators for image analysis"""
        indicators = []
        
        if 'ocr_error' in analysis:
            indicators.append("Could not extract text from image")
        
        if analysis.get('text_fraud_analysis', {}).get('risk_score', 0) > 0.5:
            indicators.append("Text in image contains fraud indicators")
        
        return indicators
    
    def generate_qr_indicators(self, analysis: Dict) -> List[str]:
        """Generate indicators for QR code analysis"""
        indicators = []
        
        if 'url_analysis' in analysis and analysis['url_analysis'].get('risk_score', 0) > 0.5:
            indicators.append("QR code links to suspicious URL")
        
        return indicators
    
    def generate_url_indicators(self, analysis: Dict) -> List[str]:
        """Generate indicators for URL analysis"""
        indicators = []
        
        if not analysis.get('ssl_enabled', False):
            indicators.append("Website does not use secure HTTPS connection")
        
        domain_analysis = analysis.get('domain_analysis', {})
        indicators.extend(domain_analysis.get('indicators', []))
        
        return indicators
    
    def generate_announcement_indicators(self, analysis: Dict) -> List[str]:
        """Generate indicators for corporate announcement"""
        indicators = []
        
        text_analysis = analysis.get('text_analysis', {})
        if text_analysis.get('risk_score', 0) > 0.5:
            indicators.append("Announcement contains suspicious language patterns")
        
        return indicators
    
    def generate_recommendations(self, risk_level: str) -> List[str]:
        """Generate recommendations based on risk level"""
        if risk_level == 'HIGH':
            return [
                "DO NOT INVEST - High fraud risk detected",
                "Report this content to SEBI",
                "Verify advisor registration independently",
                "Consult with verified financial advisors"
            ]
        elif risk_level == 'MEDIUM':
            return [
                "Exercise caution before investing",
                "Verify all claims independently",
                "Check SEBI registration of advisors",
                "Seek second opinion from certified advisors"
            ]
        else:
            return [
                "Low risk detected, but always verify investment opportunities",
                "Ensure advisor is SEBI registered",
                "Read all terms and conditions carefully"
            ]