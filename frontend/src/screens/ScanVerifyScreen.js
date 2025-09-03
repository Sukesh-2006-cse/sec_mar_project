// screens/ScanVerifyScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ScanVerifyScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('qr');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter something to verify');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Result', {
        inputType: activeTab,
        inputData: inputText,
        riskScore: Math.floor(Math.random() * 100),
      });
    }, 2000);
  };

  const tabs = [
    { id: 'qr', title: 'QR Code', icon: 'qr-code-scanner' },
    { id: 'link', title: 'URL/Link', icon: 'link' },
    { id: 'text', title: 'Text/Tips', icon: 'message' },
    { id: 'advisor', title: 'Advisor', icon: 'person' },
  ];

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'qr':
        return 'Scan QR code or paste decoded text';
      case 'link':
        return 'Paste suspicious URL or app link';
      case 'text':
        return 'Paste WhatsApp tip, SMS, or investment advice';
      case 'advisor':
        return 'Enter advisor name or registration number';
      default:
        return 'Enter text to verify';
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? '#4F46E5' : '#6B7280'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>
          {activeTab === 'qr'
            ? 'QR Code Content'
            : activeTab === 'link'
            ? 'URL to Verify'
            : activeTab === 'text'
            ? 'Suspicious Text'
            : 'Advisor Information'}
        </Text>

        <TextInput
          style={styles.textInput}
          placeholder={getPlaceholder()}
          value={inputText}
          onChangeText={setInputText}
          multiline={activeTab === 'text'}
          numberOfLines={activeTab === 'text' ? 4 : 1}
        />

        {activeTab === 'qr' && (
          <TouchableOpacity style={styles.scanButton}>
            <Icon name="camera-alt" size={24} color="#4F46E5" />
            <Text style={styles.scanButtonText}>Open Camera to Scan</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* AI Analysis Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>🧠 AI Analysis Includes:</Text>
        <View style={styles.featureList}>
          {activeTab === 'qr' && (
            <>
              <Text style={styles.featureItem}>
                • QR code destination analysis
              </Text>
              <Text style={styles.featureItem}>
                • Domain reputation checking
              </Text>
              <Text style={styles.featureItem}>
                • SEBI registration verification
              </Text>
            </>
          )}
          {activeTab === 'link' && (
            <>
              <Text style={styles.featureItem}>
                • Website credibility scoring
              </Text>
              <Text style={styles.featureItem}>
                • SSL certificate validation
              </Text>
              <Text style={styles.featureItem}>
                • Fake trading app detection
              </Text>
            </>
          )}
          {activeTab === 'text' && (
            <>
              <Text style={styles.featureItem}>
                • Pump & dump pattern detection
              </Text>
              <Text style={styles.featureItem}>
                • Unrealistic return promises
              </Text>
              <Text style={styles.featureItem}>
                • Urgency language analysis
              </Text>
            </>
          )}
          {activeTab === 'advisor' && (
            <>
              <Text style={styles.featureItem}>
                • SEBI registration verification
              </Text>
              <Text style={styles.featureItem}>• Impersonation detection</Text>
              <Text style={styles.featureItem}>
                • Historical complaint checking
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        style={[styles.verifyButton, isLoading && styles.disabledButton]}
        onPress={handleVerify}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Icon name="security" size={24} color="white" />
            <Text style={styles.verifyButtonText}>
              Verify with AI + Blockchain
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    elevation: 2,
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4F46E5',
  },
  inputSection: {
    margin: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlignVertical: 'top',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  scanButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
    marginLeft: 8,
  },
  infoSection: {
    margin: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  featureList: {
    marginLeft: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  verifyButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
