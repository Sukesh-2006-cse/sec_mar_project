# Backend Directory

This directory contains the backend API server for the TrustX application. The backend is structured to support AI-powered fraud detection and blockchain integration.

## Directory Structure

```
backend/
├── src/
│   ├── routes/          # API route definitions
│   ├── controllers/     # Business logic and request handlers  
│   ├── models/          # Data models and database schemas
│   ├── middleware/      # Custom middleware functions
│   └── utils/           # Utility functions and helpers
├── server.js            # Main server entry point
└── package.json         # Backend dependencies and scripts
```

## Getting Started

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Start production server:
   ```bash
   npm start
   ```

## API Endpoints (Planned)

- `GET /health` - Health check endpoint
- `POST /api/fraud/verify-url` - Verify suspicious URLs
- `POST /api/fraud/verify-advisor` - Verify advisor credentials  
- `POST /api/fraud/analyze-content` - Analyze content for fraud patterns
- `POST /api/alerts` - Manage fraud alerts
- `POST /api/reports` - Submit fraud reports

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger