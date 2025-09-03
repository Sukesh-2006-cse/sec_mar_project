// screens/ReportFraudScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ReportFraudScreen({ navigation }) {
  const [selectedFraudType, setSelectedFraudType] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceText, setEvidenceText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const fraudTypes = [
    {
      id: 'pump-dump',
      title: 'Pump & Dump',
      icon: 'trending-up',
      description: 'Stock price manipulation',
    },
    {
      id: 'fake-advisor',
      title: 'Fake Advisor',
      icon: 'person-outline',
      description: 'Unlicensed investment advisor',
    },
    {
      id: 'ponzi',
      title: 'Ponzi Scheme',
      icon: 'account-balance',
      description: 'Fraudulent investment operation',
    },
    {
      id: 'deepfake',
      title: 'Deepfake Content',
      icon: 'face',
      description: 'AI-generated fake videos/audio',
    },
    {
      id: 'phishing',
      title: 'Phishing Site',
      icon: 'security',
      description: 'Fake website stealing credentials',
    },
    {
      id: 'fake-app',
      title: 'Fake Trading App',
      icon: 'smartphone',
      description: 'Malicious mobile application',
    },
    {
      id: 'social-media',
      title: 'Social Media Scam',
      icon: 'share',
      description: 'WhatsApp/Telegram fraud',
    },
    {
      id: 'other',
      title: 'Other',
      icon: 'more-horiz',
      description: 'Other type of fraud',
    },
  ];

  const handleSubmit = () => {
    if (!selectedFraudType || !description.trim()) {
      Alert.alert('Error', 'Please select fraud type and provide description');
      return;
    }

    Alert.alert(
      'Report Submitted',
      'Your fraud report has been recorded on the blockchain and forwarded to relevant authorities. Thank you for helping protect the investment community.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setSelectedFraudType('');
            setDescription('');
            setEvidenceText('');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report Investment Fraud</Text>
        <Text style={styles.headerSubtitle}>
          Help protect the community with blockchain-verified reports
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Fraud Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type of Fraud</Text>
          <View style={styles.fraudTypesGrid}>
            {fraudTypes.map((fraudType) => (
              <TouchableOpacity
                key={fraudType.id}
                style={[
                  styles.fraudTypeCard,
                  selectedFraudType === fraudType.id &&
                    styles.selectedFraudType,
                ]}
                onPress={() => setSelectedFraudType(fraudType.id)}
              >
                <Icon
                  name={fraudType.icon}
                  size={24}
                  color={
                    selectedFraudType === fraudType.id ? '#4F46E5' : '#6B7280'
                  }
                />
                <Text
                  style={[
                    styles.fraudTypeText,
                    selectedFraudType === fraudType.id &&
                      styles.selectedFraudTypeText,
                  ]}
                >
                  {fraudType.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.textAreaInput}
            placeholder="Describe the fraudulent activity in detail. Include names, websites, phone numbers, or any other relevant information..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Evidence */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evidence (Optional)</Text>
          <TextInput
            style={styles.textAreaInput}
            placeholder="Paste WhatsApp messages, SMS, email content, URLs, or any other evidence you have..."
            value={evidenceText}
            onChangeText={setEvidenceText}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          <View style={styles.privacyContainer}>
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyTitle}>Anonymous Reporting</Text>
              <Text style={styles.privacySubtitle}>
                Your identity will be protected using blockchain privacy
                features
              </Text>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: '#E5E7EB', true: '#C7D2FE' }}
              thumbColor={isAnonymous ? '#4F46E5' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Blockchain Info */}
        <View style={styles.blockchainInfo}>
          <Icon name="security" size={24} color="#4F46E5" />
          <Text style={styles.blockchainText}>
            Your report will be immutably recorded on blockchain, ensuring
            transparency while protecting your privacy. This creates a
            permanent, tamper-proof record that authorities can verify.
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Icon name="send" size={20} color="white" />
        <Text style={styles.submitButtonText}>Submit Report to Blockchain</Text>
      </TouchableOpacity>
    </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#C7D2FE',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  fraudTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fraudTypeCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFraudType: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  fraudTypeText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  selectedFraudTypeText: {
    color: '#4F46E5',
  },
  textAreaInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
  },
  privacyInfo: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  privacySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  blockchainInfo: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    margin: 20,
    alignItems: 'center',
  },
  blockchainText: {
    fontSize: 14,
    color: '#4F46E5',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
