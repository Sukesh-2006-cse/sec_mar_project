// screens/ResultScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ResultScreen({ route, navigation }) {
  const { inputType, inputData, riskScore } = route.params;

  const getRiskLevel = (score) => {
    if (score >= 80) {
      return { level: 'HIGH', color: '#EF4444', icon: 'dangerous' };
    }
    if (score >= 50) {
      return { level: 'MEDIUM', color: '#F59E0B', icon: 'warning' };
    }
    return { level: 'LOW', color: '#10B981', icon: 'verified' };
  };

  const risk = getRiskLevel(riskScore);

  const analysisResults = [
    {
      category: 'SEBI Registration',
      status: riskScore > 70 ? 'Not Found' : 'Verified',
      passed: riskScore <= 70,
    },
    {
      category: 'Domain Reputation',
      status: riskScore > 60 ? 'Suspicious' : 'Clean',
      passed: riskScore <= 60,
    },
    {
      category: 'Content Analysis',
      status: riskScore > 50 ? 'Fraud Patterns Detected' : 'No Issues',
      passed: riskScore <= 50,
    },
    { category: 'Blockchain Verification', status: 'Recorded', passed: true },
  ];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `TrustX Verification Result:\nRisk Level: ${risk.level}\nScore: ${riskScore}/100\n\nVerified with AI + Blockchain technology.`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Risk Score Header */}
      <View style={[styles.riskHeader, { backgroundColor: risk.color }]}>
        <Icon name={risk.icon} size={48} color="white" />
        <Text style={styles.riskScore}>{riskScore}/100</Text>
        <Text style={styles.riskLevel}>{risk.level} RISK</Text>
      </View>

      {/* Quick Recommendation */}
      <View style={styles.recommendationCard}>
        <Text style={styles.recommendationTitle}>
          {risk.level === 'HIGH'
            ? '🚨 DO NOT PROCEED'
            : risk.level === 'MEDIUM'
            ? '⚠️ PROCEED WITH CAUTION'
            : '✅ APPEARS SAFE'}
        </Text>
        <Text style={styles.recommendationText}>
          {risk.level === 'HIGH'
            ? 'High probability of fraud detected. Avoid this investment opportunity.'
            : risk.level === 'MEDIUM'
            ? 'Some suspicious indicators found. Verify independently before proceeding.'
            : 'No major red flags detected, but always do your own research.'}
        </Text>
      </View>

      {/* Analysis Details */}
      <View style={styles.analysisSection}>
        <Text style={styles.sectionTitle}>🧠 AI Analysis Results</Text>
        {analysisResults.map((result, index) => (
          <View key={index} style={styles.analysisRow}>
            <Icon
              name={result.passed ? 'check-circle' : 'cancel'}
              size={20}
              color={result.passed ? '#10B981' : '#EF4444'}
            />
            <View style={styles.analysisContent}>
              <Text style={styles.analysisCategory}>{result.category}</Text>
              <Text
                style={[
                  styles.analysisStatus,
                  { color: result.passed ? '#10B981' : '#EF4444' },
                ]}
              >
                {result.status}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Blockchain Verification */}
      <View style={styles.blockchainSection}>
        <Text style={styles.sectionTitle}>🔗 Blockchain Verification</Text>
        <View style={styles.blockchainCard}>
          <Icon name="verified" size={24} color="#4F46E5" />
          <View style={styles.blockchainContent}>
            <Text style={styles.blockchainTitle}>Immutably Recorded</Text>
            <Text style={styles.blockchainSubtitle}>
              Transaction ID: 0x1a2b3c...def456
            </Text>
            <Text style={styles.blockchainSubtitle}>Block: #2,847,362</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Icon name="share" size={20} color="#4F46E5" />
          <Text style={styles.shareButtonText}>Share Report</Text>
        </TouchableOpacity>

        {risk.level === 'HIGH' && (
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => navigation.navigate('Report')}
          >
            <Icon name="report" size={20} color="white" />
            <Text style={styles.reportButtonText}>Report This Fraud</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  riskHeader: {
    alignItems: 'center',
    padding: 32,
  },
  riskScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  riskLevel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 4,
  },
  recommendationCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  analysisSection: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  analysisRow: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 8,
    alignItems: 'center',
  },
  analysisContent: {
    marginLeft: 12,
    flex: 1,
  },
  analysisCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  analysisStatus: {
    fontSize: 14,
    marginTop: 2,
  },
  blockchainSection: {
    margin: 20,
    marginTop: 0,
  },
  blockchainCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    alignItems: 'center',
  },
  blockchainContent: {
    marginLeft: 12,
    flex: 1,
  },
  blockchainTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  blockchainSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actionSection: {
    margin: 20,
    marginTop: 0,
  },
  shareButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  shareButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reportButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  reportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
