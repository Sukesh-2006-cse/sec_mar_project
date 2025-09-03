// screens/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProfileScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);

  const userStats = {
    scansPerformed: 247,
    fraudsDetected: 12,
    reportsSubmitted: 5,
    communityRank: 'Guardian',
    joinDate: 'March 2024',
  };

  const menuItems = [
    {
      title: 'Blockchain Wallet',
      subtitle: 'Manage your TrustX tokens and rewards',
      icon: 'account-balance-wallet',
      onPress: () => Alert.alert('Blockchain Wallet', 'Wallet management feature coming soon!'),
    },
    {
      title: 'Verification History',
      subtitle: 'View your past scans and results',
      icon: 'history',
      onPress: () => Alert.alert('History', 'Verification history feature coming soon!'),
    },
    {
      title: 'Community Contributions',
      subtitle: 'Your fraud reports and community impact',
      icon: 'group',
      onPress: () => Alert.alert('Community', 'Community features coming soon!'),
    },
    {
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      icon: 'privacy-tip',
      onPress: () => Alert.alert('Privacy', 'Privacy settings coming soon!'),
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help-outline',
      onPress: () => Alert.alert('Support', 'Support center coming soon!'),
    },
    {
      title: 'About TrustX',
      subtitle: 'Learn more about our mission',
      icon: 'info-outline',
      onPress: () => Alert.alert('About', 'TrustX v1.0.0\nAI + Blockchain Investor Protection Platform'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          Alert.alert('Logged Out', 'You have been logged out successfully.');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Icon name="account-circle" size={80} color="white" />
        </View>
        <Text style={styles.welcomeText}>Welcome, Guardian!</Text>
        <Text style={styles.communityRank}>🛡️ {userStats.communityRank}</Text>
        <Text style={styles.joinDate}>Member since {userStats.joinDate}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.scansPerformed}</Text>
            <Text style={styles.statLabel}>Scans Performed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.fraudsDetected}</Text>
            <Text style={styles.statLabel}>Frauds Detected</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.reportsSubmitted}</Text>
            <Text style={styles.statLabel}>Reports Submitted</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSubtitle}>Receive alerts about new fraud threats</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#C7D2FE' }}
              thumbColor={notificationsEnabled ? '#4F46E5' : '#9CA3AF'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Biometric Authentication</Text>
              <Text style={styles.settingSubtitle}>Use fingerprint or face unlock</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#E5E7EB', true: '#C7D2FE' }}
              thumbColor={biometricEnabled ? '#4F46E5' : '#9CA3AF'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Auto-Scan Links</Text>
              <Text style={styles.settingSubtitle}>Automatically verify links you click</Text>
            </View>
            <Switch
              value={autoScanEnabled}
              onValueChange={setAutoScanEnabled}
              trackColor={{ false: '#E5E7EB', true: '#C7D2FE' }}
              thumbColor={autoScanEnabled ? '#4F46E5' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Options</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <Icon name={item.icon} size={24} color="#4F46E5" />
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Blockchain Status */}
        <View style={styles.blockchainStatus}>
          <Icon name="verified" size={24} color="#065F46" />
          <View style={styles.blockchainStatusContent}>
            <Text style={styles.blockchainTitle}>Blockchain Connected</Text>
            <Text style={styles.blockchainSubtitle}>All your activities are securely recorded</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  profileHeader: {
    backgroundColor: '#4F46E5',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  communityRank: {
    fontSize: 16,
    color: '#FCD34D',
    fontWeight: '600',
  },
  joinDate: {
    fontSize: 12,
    color: '#C7D2FE',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  statsGrid: {
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
    color: '#4F46E5',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
  },
  menuContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  blockchainStatus: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    margin: 20,
    alignItems: 'center',
  },
  blockchainStatusContent: {
    marginLeft: 12,
    flex: 1,
  },
  blockchainTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  blockchainSubtitle: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});