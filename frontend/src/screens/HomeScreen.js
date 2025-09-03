// screens/HomeScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [portfolioData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2,
      },
    ],
  });

  const recentAlerts = [
    {
      id: 1,
      type: 'Pump & Dump',
      stock: 'ABC Ltd',
      risk: 'HIGH',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'Fake Advisor',
      entity: 'XYZ Investments',
      risk: 'MEDIUM',
      time: '5 hours ago',
    },
    {
      id: 3,
      type: 'Deepfake Video',
      stock: 'DEF Corp',
      risk: 'HIGH',
      time: '1 day ago',
    },
  ];

  const quickActions = [
    {
      title: 'Scan QR Code',
      icon: 'qr-code-scanner',
      screen: 'Scan',
      color: '#10B981',
    },
    {
      title: 'Verify Advisor',
      icon: 'verified-user',
      screen: 'Scan',
      color: '#3B82F6',
    },
    { title: 'Check Link', icon: 'link', screen: 'Scan', color: '#F59E0B' },
    {
      title: 'Report Fraud',
      icon: 'report',
      screen: 'Report',
      color: '#EF4444',
    },
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH':
        return '#EF4444';
      case 'MEDIUM':
        return '#F59E0B';
      case 'LOW':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TrustX</Text>
        <Text style={styles.headerSubtitle}>
          AI + Blockchain Investor Protection
        </Text>
      </View>

      {/* Portfolio Security Score */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreHeader}>
          <Text style={styles.scoreTitle}>Portfolio Security Score</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreValue}>85</Text>
            <Text style={styles.scoreLabel}>SAFE</Text>
          </View>
        </View>
        <LineChart
          data={portfolioData}
          width={width - 60}
          height={120}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
              onPress={() => navigation.navigate(action.screen)}
            >
              <Icon name={action.icon} size={24} color={action.color} />
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Alerts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {recentAlerts.map((alert) => (
          <View key={alert.id} style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <Icon name="warning" size={20} color={getRiskColor(alert.risk)} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alert.type}</Text>
              <Text style={styles.alertSubtitle}>
                {alert.stock || alert.entity}
              </Text>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
            <View
              style={[
                styles.riskBadge,
                { backgroundColor: getRiskColor(alert.risk) },
              ]}
            >
              <Text style={styles.riskText}>{alert.risk}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#4F46E5',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
    marginTop: 4,
  },
  scoreCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  scoreBadge: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  viewAll: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
    alignItems: 'center',
  },
  alertIcon: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  alertSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});
