import json
import hashlib
from datetime import datetime
from typing import Dict, List, Any, Optional
from web3 import Web3
from eth_account import Account
import os
from app.models import BlockchainTransaction, db

class BlockchainService:
    """Service for blockchain operations including fraud report logging and verification"""
    
    def __init__(self):
        self.initialize_blockchain()
        self.contract_abi = self.load_contract_abi()
        self.fraud_registry_address = os.getenv('FRAUD_REGISTRY_CONTRACT_ADDRESS')
        
    def initialize_blockchain(self):
        """Initialize blockchain connection"""
        try:
            # For demo purposes, using Polygon testnet
            rpc_url = os.getenv('BLOCKCHAIN_RPC_URL', 'https://rpc-mumbai.maticvigil.com/')
            self.w3 = Web3(Web3.HTTPProvider(rpc_url))
            
            # Set up account (in production, use secure key management)
            private_key = os.getenv('BLOCKCHAIN_PRIVATE_KEY', '0x' + '0' * 64)  # Demo key
            self.account = Account.from_key(private_key)
            self.w3.eth.default_account = self.account.address
            
            # Check connection
            self.is_connected = self.w3.is_connected()
            
        except Exception as e:
            print(f"Blockchain initialization failed: {e}")
            self.is_connected = False
            self.w3 = None
    
    def load_contract_abi(self) -> List[Dict]:
        """Load smart contract ABI"""
        # Fraud Registry Contract ABI
        return [
            {
                "anonymous": False,
                "inputs": [
                    {"indexed": True, "name": "reportId", "type": "bytes32"},
                    {"indexed": False, "name": "contentHash", "type": "bytes32"},
                    {"indexed": False, "name": "riskScore", "type": "uint256"},
                    {"indexed": False, "name": "timestamp", "type": "uint256"}
                ],
                "name": "FraudReportLogged",
                "type": "event"
            },
            {
                "constant": False,
                "inputs": [
                    {"name": "_contentHash", "type": "bytes32"},
                    {"name": "_riskScore", "type": "uint256"},
                    {"name": "_inputType", "type": "string"},
                    {"name": "_indicators", "type": "string"}
                ],
                "name": "logFraudReport",
                "outputs": [{"name": "", "type": "bytes32"}],
                "payable": False,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": True,
                "inputs": [{"name": "_reportId", "type": "bytes32"}],
                "name": "getFraudReport",
                "outputs": [
                    {"name": "contentHash", "type": "bytes32"},
                    {"name": "riskScore", "type": "uint256"},
                    {"name": "inputType", "type": "string"},
                    {"name": "indicators", "type": "string"},
                    {"name": "timestamp", "type": "uint256"},
                    {"name": "verified", "type": "bool"}
                ],
                "payable": False,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": True,
                "inputs": [{"name": "_contentHash", "type": "bytes32"}],
                "name": "isContentFlagged",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": False,
                "stateMutability": "view",
                "type": "function"
            }
        ]
    
    def log_fraud_report(self, report_data: Dict[str, Any]) -> Dict[str, Any]:
        """Log fraud report to blockchain"""
        result = {
            'success': False,
            'hash': None,
            'block_number': None,
            'error': None,
            'gas_used': None
        }
        
        if not self.is_connected:
            result['error'] = 'Blockchain not connected'
            return result
        
        try:
            # Generate content hash
            content_str = json.dumps(report_data, sort_keys=True)
            content_hash = self.generate_content_hash(content_str)
            
            # Convert risk score to integer (multiply by 100 for 2 decimal precision)
            risk_score_int = int(report_data.get('risk_score', 0) * 100)
            
            # Prepare transaction data
            indicators_str = json.dumps(report_data.get('indicators', []))
            
            # For demo purposes, simulate blockchain transaction
            tx_hash = self.simulate_blockchain_transaction(
                content_hash, 
                risk_score_int, 
                report_data.get('input_type', 'unknown'),
                indicators_str
            )
            
            if tx_hash:
                # Store transaction in database
                self.store_blockchain_transaction(
                    tx_hash, 
                    content_hash, 
                    report_data
                )
                
                result.update({
                    'success': True,
                    'hash': tx_hash,
                    'content_hash': content_hash.hex(),
                    'gas_used': 85000  # Estimated gas
                })
            
        except Exception as e:
            result['error'] = str(e)
        
        return result
    
    def simulate_blockchain_transaction(self, content_hash: bytes, risk_score: int, 
                                      input_type: str, indicators: str) -> Optional[str]:
        """Simulate blockchain transaction for demo purposes"""
        try:
            # In a real implementation, this would interact with the actual smart contract
            # For demo, generate a realistic transaction hash
            timestamp = str(int(datetime.utcnow().timestamp()))
            hash_input = f"{content_hash.hex()}{risk_score}{input_type}{indicators}{timestamp}"
            tx_hash = '0x' + hashlib.sha256(hash_input.encode()).hexdigest()
            
            return tx_hash
            
        except Exception as e:
            print(f"Blockchain transaction simulation failed: {e}")
            return None
    
    def verify_report_on_blockchain(self, report_id: str) -> Dict[str, Any]:
        """Verify fraud report exists on blockchain"""
        result = {
            'exists': False,
            'verified': False,
            'report_data': {},
            'error': None
        }
        
        try:
            # Check local database first
            tx = BlockchainTransaction.query.filter_by(
                transaction_hash=report_id
            ).first()
            
            if tx:
                result.update({
                    'exists': True,
                    'verified': tx.status == 'CONFIRMED',
                    'report_data': {
                        'transaction_hash': tx.transaction_hash,
                        'data_hash': tx.data_hash,
                        'function_name': tx.function_name,
                        'gas_used': tx.gas_used,
                        'created_at': tx.created_at.isoformat(),
                        'confirmed_at': tx.confirmed_at.isoformat() if tx.confirmed_at else None
                    }
                })
            
        except Exception as e:
            result['error'] = str(e)
        
        return result
    
    def create_sebi_registry_hash(self, advisor_data: Dict[str, Any]) -> str:
        """Create immutable hash for SEBI registered advisor"""
        # Create deterministic hash of advisor data
        advisor_str = json.dumps({
            'advisor_id': advisor_data.get('advisor_id'),
            'advisor_name': advisor_data.get('advisor_name'),
            'registration_number': advisor_data.get('registration_number'),
            'status': advisor_data.get('status'),
            'verified_date': datetime.utcnow().date().isoformat()
        }, sort_keys=True)
        
        return hashlib.sha256(advisor_str.encode()).hexdigest()
    
    def log_sebi_verification(self, advisor_data: Dict[str, Any]) -> Dict[str, Any]:
        """Log SEBI advisor verification to blockchain"""
        result = {
            'success': False,
            'hash': None,
            'advisor_hash': None,
            'error': None
        }
        
        try:
            advisor_hash = self.create_sebi_registry_hash(advisor_data)
            
            # Simulate logging to SEBI registry contract
            tx_hash = self.simulate_sebi_registry_transaction(advisor_hash, advisor_data)
            
            if tx_hash:
                result.update({
                    'success': True,
                    'hash': tx_hash,
                    'advisor_hash': advisor_hash
                })
            
        except Exception as e:
            result['error'] = str(e)
        
        return result
    
    def simulate_sebi_registry_transaction(self, advisor_hash: str, advisor_data: Dict[str, Any]) -> str:
        """Simulate SEBI registry blockchain transaction"""
        timestamp = str(int(datetime.utcnow().timestamp()))
        hash_input = f"{advisor_hash}{advisor_data.get('advisor_id', '')}{timestamp}"
        return '0x' + hashlib.sha256(hash_input.encode()).hexdigest()
    
    def create_announcement_certificate(self, announcement_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create blockchain certificate for corporate announcement"""
        result = {
            'success': False,
            'certificate_hash': None,
            'blockchain_hash': None,
            'error': None
        }
        
        try:
            # Create certificate data
            certificate_data = {
                'company_name': announcement_data.get('company_name'),
                'announcement_hash': hashlib.sha256(
                    announcement_data.get('announcement_text', '').encode()
                ).hexdigest(),
                'credibility_score': announcement_data.get('credibility_score'),
                'verified_at': datetime.utcnow().isoformat(),
                'verification_method': 'TrustX-AI-Analysis'
            }
            
            # Generate certificate hash
            cert_hash = hashlib.sha256(
                json.dumps(certificate_data, sort_keys=True).encode()
            ).hexdigest()
            
            # Log to blockchain
            blockchain_hash = self.simulate_certificate_transaction(cert_hash, certificate_data)
            
            result.update({
                'success': True,
                'certificate_hash': cert_hash,
                'blockchain_hash': blockchain_hash,
                'certificate_data': certificate_data
            })
            
        except Exception as e:
            result['error'] = str(e)
        
        return result
    
    def simulate_certificate_transaction(self, cert_hash: str, cert_data: Dict[str, Any]) -> str:
        """Simulate certificate blockchain transaction"""
        timestamp = str(int(datetime.utcnow().timestamp()))
        hash_input = f"{cert_hash}{cert_data.get('company_name', '')}{timestamp}"
        return '0x' + hashlib.sha256(hash_input.encode()).hexdigest()
    
    def verify_announcement_certificate(self, certificate_hash: str) -> Dict[str, Any]:
        """Verify announcement certificate on blockchain"""
        return {
            'valid': True,  # Simulated verification
            'certificate_hash': certificate_hash,
            'verified_on_blockchain': True,
            'verification_timestamp': datetime.utcnow().isoformat()
        }
    
    def get_fraud_statistics(self) -> Dict[str, Any]:
        """Get blockchain-based fraud statistics"""
        try:
            total_reports = BlockchainTransaction.query.filter_by(
                function_name='logFraudReport'
            ).count()
            
            confirmed_reports = BlockchainTransaction.query.filter_by(
                function_name='logFraudReport',
                status='CONFIRMED'
            ).count()
            
            high_risk_reports = BlockchainTransaction.query.join(
                BlockchainTransaction.fraud_report
            ).filter(
                BlockchainTransaction.function_name == 'logFraudReport'
            ).count()  # Simplified for demo
            
            return {
                'total_fraud_reports': total_reports,
                'confirmed_reports': confirmed_reports,
                'high_risk_reports': high_risk_reports,
                'blockchain_network': 'Polygon Mumbai Testnet',
                'last_updated': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def store_blockchain_transaction(self, tx_hash: str, content_hash: bytes, 
                                   report_data: Dict[str, Any]):
        """Store blockchain transaction in database"""
        try:
            transaction = BlockchainTransaction(
                transaction_hash=tx_hash,
                contract_address=self.fraud_registry_address or '0x0000000000000000000000000000000000000000',
                function_name='logFraudReport',
                data_hash=content_hash.hex(),
                gas_used=85000,
                status='CONFIRMED',  # Simulated
                confirmed_at=datetime.utcnow()
            )
            
            db.session.add(transaction)
            db.session.commit()
            
        except Exception as e:
            db.session.rollback()
            print(f"Error storing blockchain transaction: {e}")
    
    def generate_content_hash(self, content: str) -> bytes:
        """Generate SHA-256 hash for content"""
        return hashlib.sha256(content.encode()).digest()
    
    def create_immutable_audit_trail(self, fraud_reports: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create immutable audit trail of fraud reports"""
        try:
            # Create merkle-like hash of all reports
            report_hashes = []
            for report in fraud_reports:
                report_str = json.dumps(report, sort_keys=True)
                report_hash = hashlib.sha256(report_str.encode()).hexdigest()
                report_hashes.append(report_hash)
            
            # Create combined hash
            combined_hash = hashlib.sha256(
                ''.join(sorted(report_hashes)).encode()
            ).hexdigest()
            
            # Simulate blockchain storage
            blockchain_hash = self.simulate_audit_trail_transaction(combined_hash)
            
            return {
                'success': True,
                'audit_trail_hash': combined_hash,
                'blockchain_hash': blockchain_hash,
                'total_reports': len(fraud_reports),
                'created_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def simulate_audit_trail_transaction(self, audit_hash: str) -> str:
        """Simulate audit trail blockchain transaction"""
        timestamp = str(int(datetime.utcnow().timestamp()))
        hash_input = f"audit_trail_{audit_hash}_{timestamp}"
        return '0x' + hashlib.sha256(hash_input.encode()).hexdigest()
    
    def get_blockchain_status(self) -> Dict[str, Any]:
        """Get blockchain connection and contract status"""
        return {
            'connected': self.is_connected,
            'network': 'Polygon Mumbai Testnet' if self.is_connected else 'Disconnected',
            'account_address': self.account.address if hasattr(self, 'account') else None,
            'fraud_registry_contract': self.fraud_registry_address or 'Not deployed',
            'latest_block': 'Simulated' if self.is_connected else None,
            'gas_price': 'Dynamic' if self.is_connected else None
        }