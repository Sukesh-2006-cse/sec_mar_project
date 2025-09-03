// screens/AlertsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function AlertsScreen({ navigation }) {
  const [filter, setFilter] = useState('all'); // all, high, medium, low

  const alerts = [
    {
      id: 1,
      type: 'Pump & Dump',
      entity: 'ABC Ltd Stock',
      description: 'Unusual coordinated buying activity detected across multiple platforms. Price artificially inflated by 340% in 2 hours.',
      risk: 'HIGH',
      confidence: 94,
      action: 'BLOCKED',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'Fake Investment Advisor',
      entity: 'XYZ Capital Advisors',
      description: 'Unlicensed entity impersonating registered SEBI advisor. Using fake credentials and testimonials.',
      risk: 'HIGH',
      confidence: 89,
      action: 'REPORTED',
      time: '5 hours ago',
    },
    {
      id: 3,
      type: 'Deepfake Video',
      entity: 'DEF Corp CEO',
      description: 'AI-generated video of company CEO making false claims about upcoming merger announcement.',
      risk: 'HIGH',
      confidence: 87,
      action: 'FLAGGED',
      time: '1 day ago',
    },
    {
      id: 4,
      type: 'Suspicious Trading App',
      entity: 'QuickTrade Pro',
      description: 'Mobile app with fake reviews and suspicious withdrawal restrictions. Multiple user complaints about locked funds.',
      risk: 'MEDIUM',
      confidence: 76,
      action: 'MONITORING',
      time: '2 days ago',
    },
    {
      id: 5,
      type: 'Phishing Website',
      entity: 'fake-zerodha.com',
      description: 'Website mimicking legitimate broker interface to steal login credentials and personal information.',
      risk: 'MEDIUM',
      confidence: 82,
      action: 'BLOCKED',
      time: '3 days ago',
    },
  ];

  const stats = [
    { label: 'Total\nAlerts', value: '1,247', color: '#4F46E5' },
    { label: 'High Risk\nBlocked', value: '156', color: '#EF4444' },
    { label: 'Frauds\nPrevented', value: '89', color: '#10B981' },
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH': return '#EF4444';
      case 'MEDIUM': return '#F59E0B';
      case 'LOW': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'BLOCKED': return '#EF4444';
      case 'REPORTED': return '#F59E0B';
      case 'FLAGGED': return '#3B82F6';
      case 'MONITORING': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const filteredAlerts = filter === 'all' ? alerts : 
    alerts.filter(alert => alert.risk.toLowerCase() === filter.toLowerCase());

  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={[styles.statNumber, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['all', 'high', 'medium', 'low'].map((filterOption) => (
          <TouchableOpacity
            key={filterOption}
            style={[
              styles.filterTab,
              filter === filterOption && styles.activeFilterTab
            ]}
            onPress={() => setFilter(filterOption)}
          >
            <Text style={[
              styles.filterText,
              filter === filterOption && styles.activeFilterText
            ]}>
              {filterOption.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alerts List */}
      <ScrollView style={styles.alertsList}>
        {filteredAlerts.map((alert) => (
          <View key={alert.id} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <View style={styles.alertTitleRow}>
                <Icon name="warning" size={20} color={getRiskColor(alert.risk)} />
                <Text style={styles.alertType}>{alert.type}</Text>
              </View>
              <View style={styles.badgeContainer}>
                <View style={[styles.riskBadge, { backgroundColor: getRiskColor(alert.risk) }]}>
                  <Text style={styles.badgeText}>{alert.risk}</Text>
                </View>
                <View style={[styles.actionBadge, { backgroundColor: getActionColor(alert.action) }]}>
                  <Text style={styles.badgeText}>{alert.action}</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.alertEntity}>{alert.entity}</Text>
            <Text style={styles.alertDescription}>{alert.description}</Text>
            
            <View style={styles.alertFooter}>
              <View style={styles.confidenceContainer}>
                <Icon name="psychology" size={16} color="#4F46E5" />
                <Text style={styles.confidenceText}>{alert.confidence}% Confidence</Text>
              </View>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  statsContainer: {
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    elevation: 2,
  },
  filterTab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeFilterTab: {
    backgroundColor: '#4F46E5',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterText: {
    color: 'white',
  },
  alertsList: {
    flex: 1,
  },
  alertCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  alertEntity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 12,
    color: '#4F46E5',
    marginLeft: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});