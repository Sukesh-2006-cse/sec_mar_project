// server.js - Backend API Server Entry Point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (to be implemented)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TrustX Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Future API routes will be added here:
// app.use('/api/fraud', require('./src/routes/fraudRoutes'));
// app.use('/api/verification', require('./src/routes/verificationRoutes'));
// app.use('/api/alerts', require('./src/routes/alertRoutes'));
// app.use('/api/reports', require('./src/routes/reportRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`TrustX Backend API server running on port ${PORT}`);
});

module.exports = app;