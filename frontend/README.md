# Frontend Directory

This directory contains the React Native mobile application for TrustX - AI + Blockchain Investor Protection.

## Directory Structure

```
frontend/
├── src/
│   ├── screens/         # Screen components
│   ├── components/      # Reusable UI components (future)
│   ├── utils/           # Utility functions (future)
│   └── App.js           # Main app component with navigation
├── index.js             # React Native entry point
├── package.json         # Frontend dependencies and scripts
├── babel.config.js      # Babel configuration
├── metro.config.js      # Metro bundler configuration
└── app.json             # App metadata and configuration
```

## Getting Started

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start Metro bundler:
   ```bash
   npm start
   ```

3. Run on Android:
   ```bash
   npm run android
   ```

4. Run on iOS:
   ```bash
   npm run ios
   ```

## Features

- **Home Dashboard** - Portfolio security score and recent alerts
- **QR/Link Scanner** - Verify suspicious investment opportunities
- **AI Fraud Alerts** - Real-time fraud detection notifications
- **Fraud Reporting** - Community-driven fraud reporting system
- **User Profile** - Settings and blockchain wallet integration

## Technology Stack

- **React Native 0.72.0** - Mobile app framework
- **React Navigation** - Navigation and routing
- **React Native Vector Icons** - Material Icons
- **React Native Chart Kit** - Data visualization
- **React Native SVG** - SVG support for charts