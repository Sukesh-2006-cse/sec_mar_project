# TrustX - AI + Blockchain Investor Protection

TrustX is a React Native mobile application that combines AI and blockchain technology to protect investors from financial fraud. The app helps users verify suspicious investment opportunities, detect fraudulent activities, and report scams to help protect the investment community.

## Features

- **AI-Powered Fraud Detection**: Advanced AI algorithms analyze investment opportunities, advisor credentials, and suspicious content
- **QR Code & Link Verification**: Scan QR codes or paste suspicious URLs for instant fraud analysis
- **Blockchain Integration**: Immutable fraud reporting and verification records on blockchain
- **Real-time Alerts**: AI-generated alerts about new fraud patterns and threats
- **Community Protection**: Crowdsourced fraud reporting system
- **Investment Security Score**: Portfolio security analysis and risk assessment

## Project Structure

```
sec_mar_project/
├── App.js                      # Main app component with navigation setup
├── index.js                    # React Native entry point
├── package.json                # Dependencies and project configuration
├── babel.config.js             # Babel configuration
├── metro.config.js             # Metro bundler configuration  
├── app.json                    # App metadata
├── .gitignore                  # Git ignore rules
└── screens/                    # Screen components directory
    ├── HomeScreen.js           # Home dashboard with security score & alerts
    ├── ScanVerifyScreen.js     # QR/Link/Text verification interface
    ├── ResultScreen.js         # Verification results and recommendations
    ├── AlertsScreen.js         # AI-detected fraud alerts listing
    ├── ReportFraudScreen.js    # Fraud reporting interface
    └── ProfileScreen.js        # User profile and settings
```

## Key Components

### App.js
Main application component that sets up:
- React Navigation with bottom tabs and stack navigation
- Tab navigator for main screens (Home, Scan, Alerts, Report, Profile)
- Stack navigator for result screen overlay

### Screen Components

1. **HomeScreen.js**: Dashboard displaying portfolio security score, quick actions, and recent alerts
2. **ScanVerifyScreen.js**: Multi-tab interface for verifying QR codes, URLs, text messages, and advisors
3. **ResultScreen.js**: Shows AI analysis results with risk scores and recommendations
4. **AlertsScreen.js**: Lists AI-detected fraud alerts with filtering and statistics
5. **ReportFraudScreen.js**: Form for users to report suspected fraud with blockchain recording
6. **ProfileScreen.js**: User profile, statistics, settings, and blockchain wallet integration

## Technology Stack

- **React Native 0.72.0**: Mobile app framework
- **React Navigation**: Navigation and routing
- **React Native Vector Icons**: Material Icons for UI
- **React Native Chart Kit**: Data visualization for security scores
- **React Native SVG**: SVG support for charts

## Dependencies

Key dependencies as defined in package.json:
- React & React Native core packages
- Navigation packages (@react-navigation/native, @react-navigation/bottom-tabs, @react-navigation/stack)
- UI packages (react-native-vector-icons, react-native-chart-kit)
- Development tools (ESLint, Jest, Babel, Metro)

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Metro Bundler**:
   ```bash
   npm start
   ```

3. **Run on Android**:
   ```bash
   npm run android
   ```

4. **Run on iOS**:
   ```bash
   npm run ios
   ```

## Features Implementation

### AI Analysis Features
- Pump & dump pattern detection
- Fake advisor verification via SEBI database
- Deepfake content detection
- Phishing website analysis
- Investment scam text analysis

### Blockchain Integration
- Immutable fraud report recording
- Transparent verification system
- Privacy-preserving anonymous reporting
- Community-driven fraud database

### Security Features  
- Biometric authentication
- Auto-scan suspicious links
- Real-time fraud alerts
- Portfolio security scoring

## Future Enhancements

- Machine learning model training with user feedback
- Integration with regulatory databases (SEBI, RBI)
- Cross-platform browser extension
- API for third-party integrations
- Advanced blockchain features (smart contracts, DeFi integration)

## Contributing

This project is organized as a clean, modular React Native application with proper separation of concerns. Each screen is a self-contained component with its own styles and logic.

## License

MIT License - See LICENSE file for details
