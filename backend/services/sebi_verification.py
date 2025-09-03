import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from app.models import SEBIAdvisor, db

class SEBIVerificationService:
    """Service for verifying investment advisors and entities against SEBI registry"""
    
    def __init__(self):
        self.sebi_api_base = "https://www.sebi.gov.in"
        self.cache_duration = timedelta(hours=24)  # Cache SEBI data for 24 hours
        self.initialize_sebi_data()
    
    def initialize_sebi_data(self):
        """Initialize with sample SEBI registered advisors data"""
        sample_advisors = [
            {
                'advisor_name': 'Certified Financial Planner Ltd',
                'advisor_id': 'INA000001234',
                'registration_number': 'INA000001234',
                'registration_date': datetime(2020, 1, 15).date(),
                'status': 'ACTIVE',
                'company_name': 'Certified Financial Planner Ltd',
                'contact_info': json.dumps({
                    'address': 'Mumbai, Maharashtra',
                    'phone': '+91-22-12345678',
                    'email': 'info@cfp.com'
                }),
                'verified': True
            },
            {
                'advisor_name': 'Wealth Advisory Services',
                'advisor_id': 'INA000005678',
                'registration_number': 'INA000005678',
                'registration_date': datetime(2019, 6, 10).date(),
                'status': 'ACTIVE',
                'company_name': 'Wealth Advisory Services Pvt Ltd',
                'contact_info': json.dumps({
                    'address': 'Delhi, NCR',
                    'phone': '+91-11-98765432',
                    'email': 'contact@wealth.com'
                }),
                'verified': True
            }
        ]
        
        # Add sample data if not exists
        for advisor_data in sample_advisors:
            existing = SEBIAdvisor.query.filter_by(
                advisor_id=advisor_data['advisor_id']
            ).first()
            
            if not existing:
                advisor = SEBIAdvisor(**advisor_data)
                db.session.add(advisor)
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Error adding sample SEBI data: {e}")
    
    def verify_advisor(self, advisor_name: str, advisor_id: str = None) -> Dict[str, Any]:
        """Verify investment advisor against SEBI registry"""
        result = {
            'advisor_name': advisor_name,
            'advisor_id': advisor_id,
            'is_registered': False,
            'verification_status': 'NOT_FOUND',
            'registration_details': {},
            'risk_indicators': [],
            'recommendations': [],
            'verified_at': datetime.utcnow().isoformat()
        }
        
        # First check local database cache
        local_result = self.check_local_sebi_cache(advisor_name, advisor_id)
        if local_result:
            result.update(local_result)
            result['source'] = 'local_cache'
            return result
        
        # Try to fetch from SEBI website if not in cache
        sebi_result = self.fetch_from_sebi_registry(advisor_name, advisor_id)
        if sebi_result:
            result.update(sebi_result)
            result['source'] = 'sebi_website'
            
            # Cache the result
            self.cache_sebi_advisor(result)
        else:
            # Check for potential fraud indicators if not found
            result['risk_indicators'] = self.analyze_unregistered_advisor(advisor_name)
            result['recommendations'] = self.generate_unregistered_recommendations()
        
        return result
    
    def check_local_sebi_cache(self, advisor_name: str, advisor_id: str = None) -> Optional[Dict[str, Any]]:
        """Check local database cache for SEBI advisor information"""
        query = SEBIAdvisor.query
        
        if advisor_id:
            advisor = query.filter_by(advisor_id=advisor_id).first()
        else:
            # Fuzzy search by name
            advisor = query.filter(
                SEBIAdvisor.advisor_name.ilike(f'%{advisor_name}%')
            ).first()
        
        if advisor and self.is_cache_valid(advisor.last_updated):
            return {
                'is_registered': True,
                'verification_status': advisor.status,
                'registration_details': {
                    'advisor_id': advisor.advisor_id,
                    'registration_number': advisor.registration_number,
                    'registration_date': advisor.registration_date.isoformat() if advisor.registration_date else None,
                    'status': advisor.status,
                    'company_name': advisor.company_name,
                    'contact_info': json.loads(advisor.contact_info) if advisor.contact_info else {}
                },
                'risk_indicators': self.get_registered_advisor_risks(advisor),
                'recommendations': self.generate_registered_recommendations(advisor.status)
            }
        
        return None
    
    def fetch_from_sebi_registry(self, advisor_name: str, advisor_id: str = None) -> Optional[Dict[str, Any]]:
        """Fetch advisor information from SEBI website"""
        try:
            # SEBI Investment Advisors search URL
            search_url = f"{self.sebi_api_base}/sebiweb/other/Search"
            
            # Search parameters
            params = {
                'intermediary': 'IA',  # Investment Advisor
                'name': advisor_name if not advisor_id else '',
                'regn_no': advisor_id if advisor_id else ''
            }
            
            headers = {
                'User-Agent': 'TrustX-SEBIVerifier/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
            
            response = requests.get(search_url, params=params, headers=headers, timeout=15)
            
            if response.status_code == 200:
                return self.parse_sebi_response(response.content, advisor_name, advisor_id)
            
        except Exception as e:
            print(f"Error fetching from SEBI registry: {e}")
        
        return None
    
    def parse_sebi_response(self, html_content: bytes, advisor_name: str, advisor_id: str) -> Optional[Dict[str, Any]]:
        """Parse SEBI website response"""
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Look for search results table
            results_table = soup.find('table', {'class': 'data'})
            if not results_table:
                return None
            
            # Parse table rows
            rows = results_table.find_all('tr')[1:]  # Skip header row
            
            for row in rows:
                cells = row.find_all('td')
                if len(cells) >= 4:
                    found_name = cells[0].get_text(strip=True)
                    found_id = cells[1].get_text(strip=True)
                    registration_date = cells[2].get_text(strip=True)
                    status = cells[3].get_text(strip=True)
                    
                    # Check if this matches our search
                    if (advisor_name.lower() in found_name.lower() or 
                        (advisor_id and advisor_id == found_id)):
                        
                        return {
                            'is_registered': True,
                            'verification_status': status,
                            'registration_details': {
                                'advisor_name': found_name,
                                'advisor_id': found_id,
                                'registration_date': registration_date,
                                'status': status
                            },
                            'risk_indicators': [],
                            'recommendations': self.generate_registered_recommendations(status)
                        }
            
        except Exception as e:
            print(f"Error parsing SEBI response: {e}")
        
        return None
    
    def cache_sebi_advisor(self, advisor_data: Dict[str, Any]):
        """Cache SEBI advisor data in local database"""
        try:
            reg_details = advisor_data.get('registration_details', {})
            
            existing = SEBIAdvisor.query.filter_by(
                advisor_id=reg_details.get('advisor_id', '')
            ).first()
            
            if existing:
                # Update existing record
                existing.advisor_name = reg_details.get('advisor_name', '')
                existing.status = reg_details.get('status', 'UNKNOWN')
                existing.last_updated = datetime.utcnow()
            else:
                # Create new record
                advisor = SEBIAdvisor(
                    advisor_name=reg_details.get('advisor_name', ''),
                    advisor_id=reg_details.get('advisor_id', ''),
                    registration_number=reg_details.get('advisor_id', ''),
                    status=reg_details.get('status', 'ACTIVE'),
                    verified=True
                )
                db.session.add(advisor)
            
            db.session.commit()
            
        except Exception as e:
            db.session.rollback()
            print(f"Error caching SEBI advisor data: {e}")
    
    def verify_broker(self, broker_name: str, broker_id: str = None) -> Dict[str, Any]:
        """Verify broker against SEBI registry"""
        result = {
            'broker_name': broker_name,
            'broker_id': broker_id,
            'is_registered': False,
            'verification_status': 'NOT_FOUND',
            'registration_details': {},
            'risk_indicators': [],
            'recommendations': [],
            'verified_at': datetime.utcnow().isoformat()
        }
        
        # Sample registered brokers for demonstration
        registered_brokers = [
            'Zerodha Broking Limited',
            'ICICI Securities Limited',
            'HDFC Securities Limited',
            'Angel Broking Limited',
            'Kotak Securities Limited'
        ]
        
        # Check if broker is in our sample list
        for registered_broker in registered_brokers:
            if broker_name.lower() in registered_broker.lower():
                result.update({
                    'is_registered': True,
                    'verification_status': 'ACTIVE',
                    'registration_details': {
                        'broker_name': registered_broker,
                        'status': 'ACTIVE',
                        'type': 'Stock Broker'
                    },
                    'risk_indicators': [],
                    'recommendations': ['Broker is SEBI registered and can be trusted for trading']
                })
                return result
        
        # If not found, flag as potential fraud
        result['risk_indicators'] = [
            'Broker not found in SEBI registered list',
            'Potentially operating without SEBI registration'
        ]
        result['recommendations'] = [
            'DO NOT trade with unregistered broker',
            'Verify broker registration on SEBI website',
            'Choose only SEBI registered brokers'
        ]
        
        return result
    
    def verify_mutual_fund(self, fund_name: str, amc_name: str = None) -> Dict[str, Any]:
        """Verify mutual fund against SEBI registered AMCs"""
        result = {
            'fund_name': fund_name,
            'amc_name': amc_name,
            'is_registered': False,
            'verification_status': 'NOT_FOUND',
            'registration_details': {},
            'risk_indicators': [],
            'recommendations': [],
            'verified_at': datetime.utcnow().isoformat()
        }
        
        # Sample registered AMCs
        registered_amcs = [
            'SBI Mutual Fund',
            'HDFC Mutual Fund',
            'ICICI Prudential Mutual Fund',
            'Aditya Birla Sun Life Mutual Fund',
            'Axis Mutual Fund'
        ]
        
        # Check fund/AMC against registered list
        if amc_name:
            for amc in registered_amcs:
                if amc_name.lower() in amc.lower():
                    result.update({
                        'is_registered': True,
                        'verification_status': 'ACTIVE',
                        'registration_details': {
                            'amc_name': amc,
                            'fund_name': fund_name,
                            'status': 'ACTIVE'
                        },
                        'recommendations': ['AMC is SEBI registered']
                    })
                    return result
        
        result['risk_indicators'] = ['Fund/AMC not found in SEBI registered list']
        result['recommendations'] = ['Verify fund registration before investing']
        
        return result
    
    def check_sebi_alerts(self, entity_name: str) -> Dict[str, Any]:
        """Check if entity is mentioned in SEBI alerts/warnings"""
        result = {
            'entity_name': entity_name,
            'has_alerts': False,
            'alert_details': [],
            'risk_level': 'LOW'
        }
        
        # Sample fraudulent entities for demonstration
        fraud_entities = [
            'Fake Investment Advisory',
            'Ponzi Scheme Corp',
            'Get Rich Quick Ltd',
            'Guaranteed Returns Inc'
        ]
        
        for fraud_entity in fraud_entities:
            if entity_name.lower() in fraud_entity.lower():
                result.update({
                    'has_alerts': True,
                    'alert_details': [
                        f"SEBI Alert: {fraud_entity} is operating without registration",
                        "Entity has been flagged for fraudulent activities"
                    ],
                    'risk_level': 'HIGH'
                })
                break
        
        return result
    
    def analyze_unregistered_advisor(self, advisor_name: str) -> List[str]:
        """Analyze potential fraud indicators for unregistered advisor"""
        indicators = []
        
        # Check for suspicious naming patterns
        suspicious_keywords = [
            'guaranteed', 'sure', 'profit', 'rich', 'wealth',
            'expert', 'guru', 'master', 'champion'
        ]
        
        name_lower = advisor_name.lower()
        for keyword in suspicious_keywords:
            if keyword in name_lower:
                indicators.append(f"Suspicious keyword '{keyword}' in advisor name")
        
        # Check for typical fraud patterns
        if re.search(r'\d{10,}', advisor_name):
            indicators.append("Phone number in advisor name (red flag)")
        
        if len(advisor_name.split()) < 2:
            indicators.append("Unusually short advisor name")
        
        return indicators
    
    def get_registered_advisor_risks(self, advisor: SEBIAdvisor) -> List[str]:
        """Get risk indicators for registered advisor"""
        risks = []
        
        if advisor.status != 'ACTIVE':
            risks.append(f"Advisor status is {advisor.status}, not ACTIVE")
        
        if advisor.registration_date:
            days_since_reg = (datetime.now().date() - advisor.registration_date).days
            if days_since_reg < 365:
                risks.append("Recently registered advisor (less than 1 year)")
        
        return risks
    
    def generate_registered_recommendations(self, status: str) -> List[str]:
        """Generate recommendations for registered advisor"""
        recommendations = [
            "Advisor is SEBI registered - good sign",
            "Verify advisor credentials independently",
            "Check fee structure and terms carefully"
        ]
        
        if status != 'ACTIVE':
            recommendations.insert(0, f"WARNING: Advisor status is {status} - proceed with caution")
        
        return recommendations
    
    def generate_unregistered_recommendations(self) -> List[str]:
        """Generate recommendations for unregistered advisor"""
        return [
            "DANGER: Advisor not found in SEBI registry",
            "DO NOT invest through unregistered advisors",
            "Report this advisor to SEBI if they claim to be registered",
            "Only use SEBI registered investment advisors"
        ]
    
    def is_cache_valid(self, last_updated: datetime) -> bool:
        """Check if cache is still valid"""
        return datetime.utcnow() - last_updated < self.cache_duration
    
    def get_sebi_registered_entities_count(self) -> Dict[str, int]:
        """Get count of registered entities in local cache"""
        return {
            'investment_advisors': SEBIAdvisor.query.filter_by(status='ACTIVE').count(),
            'total_advisors': SEBIAdvisor.query.count(),
            'last_updated': datetime.utcnow().isoformat()
        }