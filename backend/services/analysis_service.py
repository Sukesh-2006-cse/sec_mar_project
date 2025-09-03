from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy import desc, func
from app.models import FraudReport, AnalysisSession, BlockchainTransaction, SEBIAdvisor, db
import json

class AnalysisService:
    """Service for analysis history, statistics and dashboard data"""
    
    def __init__(self):
        pass
    
    def get_analysis_history(self, session_id: str = None, limit: int = 10) -> List[Dict[str, Any]]:
        """Get analysis history for a session or all analyses"""
        try:
            query = FraudReport.query
            
            if session_id:
                query = query.filter_by(session_id=session_id)
            
            reports = query.order_by(desc(FraudReport.created_at)).limit(limit).all()
            
            history = []
            for report in reports:
                history.append({
                    'id': report.id,
                    'input_type': report.input_type,
                    'risk_score': report.risk_score,
                    'risk_level': report.risk_level,
                    'analysis_result': json.loads(report.analysis_result) if report.analysis_result else {},
                    'blockchain_hash': report.blockchain_hash,
                    'created_at': report.created_at.isoformat(),
                    'session_id': report.session_id
                })
            
            return history
            
        except Exception as e:
            print(f"Error getting analysis history: {e}")
            return []
    
    def get_dashboard_statistics(self) -> Dict[str, Any]:
        """Get comprehensive statistics for regulator dashboard"""
        try:
            # Get time ranges
            now = datetime.utcnow()
            today = now.replace(hour=0, minute=0, second=0, microsecond=0)
            week_ago = today - timedelta(days=7)
            month_ago = today - timedelta(days=30)
            
            # Total analyses
            total_analyses = FraudReport.query.count()
            analyses_today = FraudReport.query.filter(FraudReport.created_at >= today).count()
            analyses_week = FraudReport.query.filter(FraudReport.created_at >= week_ago).count()
            analyses_month = FraudReport.query.filter(FraudReport.created_at >= month_ago).count()
            
            # Risk level breakdown
            risk_breakdown = db.session.query(
                FraudReport.risk_level,
                func.count(FraudReport.id)
            ).group_by(FraudReport.risk_level).all()
            
            risk_stats = {level: count for level, count in risk_breakdown}
            
            # Input type breakdown
            input_breakdown = db.session.query(
                FraudReport.input_type,
                func.count(FraudReport.id)
            ).group_by(FraudReport.input_type).all()
            
            input_stats = {input_type: count for input_type, count in input_breakdown}
            
            # High risk trends (last 7 days)
            high_risk_trend = []
            for i in range(7):
                day_start = today - timedelta(days=i)
                day_end = day_start + timedelta(days=1)
                
                high_risk_count = FraudReport.query.filter(
                    FraudReport.created_at >= day_start,
                    FraudReport.created_at < day_end,
                    FraudReport.risk_level == 'HIGH'
                ).count()
                
                high_risk_trend.append({
                    'date': day_start.strftime('%Y-%m-%d'),
                    'high_risk_count': high_risk_count
                })
            
            # Blockchain statistics
            blockchain_stats = self.get_blockchain_statistics()
            
            # SEBI verification statistics
            sebi_stats = self.get_sebi_statistics()
            
            # Geographic distribution (simulated)
            geographic_stats = self.get_geographic_distribution()
            
            # Top fraud patterns
            top_patterns = self.get_top_fraud_patterns()
            
            return {
                'overview': {
                    'total_analyses': total_analyses,
                    'analyses_today': analyses_today,
                    'analyses_this_week': analyses_week,
                    'analyses_this_month': analyses_month,
                    'high_risk_percentage': round(
                        (risk_stats.get('HIGH', 0) / max(total_analyses, 1)) * 100, 2
                    )
                },
                'risk_breakdown': risk_stats,
                'input_type_breakdown': input_stats,
                'trends': {
                    'high_risk_7_days': high_risk_trend,
                    'fraud_detection_rate': self.calculate_fraud_detection_rate()
                },
                'blockchain': blockchain_stats,
                'sebi_verification': sebi_stats,
                'geographic_distribution': geographic_stats,
                'top_fraud_patterns': top_patterns,
                'alerts': self.get_active_alerts(),
                'last_updated': now.isoformat()
            }
            
        except Exception as e:
            print(f"Error getting dashboard statistics: {e}")
            return {'error': str(e)}
    
    def get_blockchain_statistics(self) -> Dict[str, Any]:
        """Get blockchain-related statistics"""
        try:
            total_blockchain_logs = BlockchainTransaction.query.count()
            confirmed_logs = BlockchainTransaction.query.filter_by(status='CONFIRMED').count()
            pending_logs = BlockchainTransaction.query.filter_by(status='PENDING').count()
            failed_logs = BlockchainTransaction.query.filter_by(status='FAILED').count()
            
            return {
                'total_blockchain_logs': total_blockchain_logs,
                'confirmed_logs': confirmed_logs,
                'pending_logs': pending_logs,
                'failed_logs': failed_logs,
                'success_rate': round(
                    (confirmed_logs / max(total_blockchain_logs, 1)) * 100, 2
                )
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def get_sebi_statistics(self) -> Dict[str, Any]:
        """Get SEBI verification statistics"""
        try:
            # Get verification attempts (from fraud reports with advisor type)
            advisor_verifications = FraudReport.query.filter_by(input_type='advisor').count()
            
            # Get registered advisors in cache
            total_advisors = SEBIAdvisor.query.count()
            active_advisors = SEBIAdvisor.query.filter_by(status='ACTIVE').count()
            suspended_advisors = SEBIAdvisor.query.filter_by(status='SUSPENDED').count()
            
            return {
                'advisor_verifications': advisor_verifications,
                'registered_advisors_cached': total_advisors,
                'active_advisors': active_advisors,
                'suspended_advisors': suspended_advisors,
                'verification_success_rate': 85.5  # Simulated metric
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def get_geographic_distribution(self) -> List[Dict[str, Any]]:
        """Get geographic distribution of fraud reports (simulated)"""
        # In a real implementation, this would analyze IP addresses or user location data
        return [
            {'state': 'Maharashtra', 'fraud_reports': 45, 'percentage': 25.0},
            {'state': 'Delhi', 'fraud_reports': 38, 'percentage': 21.1},
            {'state': 'Karnataka', 'fraud_reports': 32, 'percentage': 17.8},
            {'state': 'Tamil Nadu', 'fraud_reports': 28, 'percentage': 15.6},
            {'state': 'Gujarat', 'fraud_reports': 22, 'percentage': 12.2},
            {'state': 'Others', 'fraud_reports': 15, 'percentage': 8.3}
        ]
    
    def get_top_fraud_patterns(self) -> List[Dict[str, Any]]:
        """Get most common fraud patterns detected"""
        try:
            # Analyze fraud reports to find common patterns
            reports = FraudReport.query.filter_by(risk_level='HIGH').limit(100).all()
            
            pattern_counts = {}
            for report in reports:
                try:
                    analysis_data = json.loads(report.analysis_result)
                    indicators = analysis_data.get('indicators', [])
                    
                    for indicator in indicators:
                        if indicator in pattern_counts:
                            pattern_counts[indicator] += 1
                        else:
                            pattern_counts[indicator] = 1
                            
                except (json.JSONDecodeError, KeyError):
                    continue
            
            # Sort by frequency and return top patterns
            sorted_patterns = sorted(
                pattern_counts.items(), 
                key=lambda x: x[1], 
                reverse=True
            )[:10]
            
            return [
                {'pattern': pattern, 'count': count, 'severity': 'HIGH'} 
                for pattern, count in sorted_patterns
            ]
            
        except Exception as e:
            print(f"Error getting fraud patterns: {e}")
            # Return sample patterns for demo
            return [
                {'pattern': 'Contains common fraud keywords', 'count': 127, 'severity': 'HIGH'},
                {'pattern': 'Unrealistic returns promised', 'count': 89, 'severity': 'HIGH'},
                {'pattern': 'Unregistered investment advisor', 'count': 76, 'severity': 'HIGH'},
                {'pattern': 'Suspicious URL patterns', 'count': 54, 'severity': 'MEDIUM'},
                {'pattern': 'No SSL certificate', 'count': 43, 'severity': 'MEDIUM'}
            ]
    
    def calculate_fraud_detection_rate(self) -> Dict[str, float]:
        """Calculate fraud detection accuracy rates"""
        # In a real implementation, this would compare against validated fraud cases
        return {
            'overall_accuracy': 92.5,
            'false_positive_rate': 4.2,
            'false_negative_rate': 3.3,
            'high_risk_precision': 89.8
        }
    
    def get_active_alerts(self) -> List[Dict[str, Any]]:
        """Get active alerts for regulators"""
        alerts = []
        
        # Check for high activity spikes
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        today_high_risk = FraudReport.query.filter(
            FraudReport.created_at >= today,
            FraudReport.risk_level == 'HIGH'
        ).count()
        
        if today_high_risk > 10:  # Threshold for alert
            alerts.append({
                'type': 'HIGH_ACTIVITY',
                'severity': 'HIGH',
                'message': f'High fraud activity detected: {today_high_risk} high-risk reports today',
                'created_at': datetime.utcnow().isoformat(),
                'action_required': True
            })
        
        # Check for blockchain issues
        pending_blockchain = BlockchainTransaction.query.filter_by(status='PENDING').count()
        if pending_blockchain > 5:
            alerts.append({
                'type': 'BLOCKCHAIN_DELAY',
                'severity': 'MEDIUM',
                'message': f'{pending_blockchain} blockchain transactions pending confirmation',
                'created_at': datetime.utcnow().isoformat(),
                'action_required': False
            })
        
        # Sample alerts for demo
        alerts.extend([
            {
                'type': 'NEW_FRAUD_PATTERN',
                'severity': 'MEDIUM',
                'message': 'New fraud pattern detected: Fake cryptocurrency investment apps',
                'created_at': (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                'action_required': True
            },
            {
                'type': 'SEBI_UPDATE',
                'severity': 'LOW',
                'message': 'SEBI registry updated with 15 new registered advisors',
                'created_at': (datetime.utcnow() - timedelta(hours=6)).isoformat(),
                'action_required': False
            }
        ])
        
        return alerts
    
    def create_analysis_session(self, session_data: Dict[str, Any]) -> str:
        """Create new analysis session"""
        try:
            session = AnalysisSession(
                user_type=session_data.get('user_type', 'INVESTOR'),
                ip_address=session_data.get('ip_address'),
                user_agent=session_data.get('user_agent')
            )
            
            db.session.add(session)
            db.session.commit()
            
            return session.session_id
            
        except Exception as e:
            db.session.rollback()
            print(f"Error creating analysis session: {e}")
            return None
    
    def update_session_stats(self, session_id: str, analysis_result: Dict[str, Any]):
        """Update session statistics after analysis"""
        try:
            session = AnalysisSession.query.filter_by(session_id=session_id).first()
            
            if session:
                session.total_analyses += 1
                if analysis_result.get('risk_level') == 'HIGH':
                    session.high_risk_detections += 1
                session.last_analysis = datetime.utcnow()
                
                db.session.commit()
                
        except Exception as e:
            db.session.rollback()
            print(f"Error updating session stats: {e}")
    
    def get_session_summary(self, session_id: str) -> Dict[str, Any]:
        """Get summary for analysis session"""
        try:
            session = AnalysisSession.query.filter_by(session_id=session_id).first()
            
            if not session:
                return {'error': 'Session not found'}
            
            return {
                'session_id': session.session_id,
                'user_type': session.user_type,
                'total_analyses': session.total_analyses,
                'high_risk_detections': session.high_risk_detections,
                'risk_detection_rate': round(
                    (session.high_risk_detections / max(session.total_analyses, 1)) * 100, 2
                ),
                'first_analysis': session.first_analysis.isoformat(),
                'last_analysis': session.last_analysis.isoformat(),
                'session_duration': str(session.last_analysis - session.first_analysis)
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def generate_fraud_report_pdf(self, report_id: str) -> Dict[str, Any]:
        """Generate PDF report for fraud analysis"""
        try:
            report = FraudReport.query.filter_by(id=report_id).first()
            
            if not report:
                return {'error': 'Report not found'}
            
            # In a real implementation, this would generate an actual PDF
            # For demo, return metadata for PDF generation
            return {
                'report_id': report.id,
                'pdf_url': f'/api/reports/{report.id}/pdf',
                'generated_at': datetime.utcnow().isoformat(),
                'file_size': '2.3 MB',  # Simulated
                'pages': 3  # Simulated
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def export_dashboard_data(self, format_type: str = 'json') -> Dict[str, Any]:
        """Export dashboard data in various formats"""
        try:
            dashboard_data = self.get_dashboard_statistics()
            
            if format_type == 'csv':
                # In real implementation, convert to CSV
                return {
                    'format': 'csv',
                    'download_url': '/api/export/dashboard.csv',
                    'generated_at': datetime.utcnow().isoformat()
                }
            elif format_type == 'excel':
                # In real implementation, convert to Excel
                return {
                    'format': 'excel',
                    'download_url': '/api/export/dashboard.xlsx',
                    'generated_at': datetime.utcnow().isoformat()
                }
            else:
                return {
                    'format': 'json',
                    'data': dashboard_data,
                    'generated_at': datetime.utcnow().isoformat()
                }
                
        except Exception as e:
            return {'error': str(e)}
    
    def get_current_timestamp(self) -> str:
        """Get current timestamp in ISO format"""
        return datetime.utcnow().isoformat()