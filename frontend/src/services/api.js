import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout for fraud detection
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('trustx_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    throw new Error(errorMessage);
  }
);

// Fraud Detection API
export const fraudDetectionApi = {
  // Analyze text content
  analyzeText: async (content) => {
    const response = await apiClient.post('/api/detect', {
      type: 'text',
      content: content
    });
    return response;
  },

  // Analyze image/QR code
  analyzeImage: async (formData) => {
    const response = await apiClient.post('/api/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Analyze URL
  analyzeUrl: async (url) => {
    const response = await apiClient.post('/api/detect', {
      type: 'url',
      url: url
    });
    return response;
  },

  // Verify investment advisor
  verifyAdvisor: async (advisorName, advisorId = null) => {
    const response = await apiClient.post('/api/verify/advisor', {
      advisor_name: advisorName,
      advisor_id: advisorId
    });
    return response;
  },

  // Analyze corporate announcement
  analyzeAnnouncement: async (companyName, announcementText) => {
    const response = await apiClient.post('/api/analyze/announcement', {
      company: companyName,
      text: announcementText
    });
    return response;
  },

  // Get analysis history
  getHistory: async (sessionId = null, limit = 10) => {
    const params = new URLSearchParams();
    if (sessionId) params.append('session_id', sessionId);
    if (limit) params.append('limit', limit);
    
    const response = await apiClient.get(`/api/history?${params}`);
    return response;
  }
};

// Dashboard API
export const dashboardApi = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await apiClient.get('/api/stats/dashboard');
    return response;
  },

  // Export dashboard data
  exportData: async (format = 'json') => {
    const response = await apiClient.get('/api/export/dashboard', {
      params: { format }
    });
    return response;
  }
};

// Blockchain API
export const blockchainApi = {
  // Log fraud report to blockchain
  logFraudReport: async (reportData) => {
    const response = await apiClient.post('/api/blockchain/log', {
      report: reportData
    });
    return response;
  },

  // Verify blockchain transaction
  verifyTransaction: async (txHash) => {
    const response = await apiClient.get(`/api/blockchain/verify/${txHash}`);
    return response;
  },

  // Get blockchain status
  getStatus: async () => {
    const response = await apiClient.get('/api/blockchain/status');
    return response;
  }
};

// SEBI Verification API
export const sebiApi = {
  // Verify advisor
  verifyAdvisor: async (advisorName, advisorId = null) => {
    const response = await apiClient.post('/api/sebi/verify/advisor', {
      advisor_name: advisorName,
      advisor_id: advisorId
    });
    return response;
  },

  // Verify broker
  verifyBroker: async (brokerName, brokerId = null) => {
    const response = await apiClient.post('/api/sebi/verify/broker', {
      broker_name: brokerName,
      broker_id: brokerId
    });
    return response;
  },

  // Verify mutual fund
  verifyMutualFund: async (fundName, amcName = null) => {
    const response = await apiClient.post('/api/sebi/verify/fund', {
      fund_name: fundName,
      amc_name: amcName
    });
    return response;
  },

  // Check SEBI alerts
  checkAlerts: async (entityName) => {
    const response = await apiClient.get('/api/sebi/alerts', {
      params: { entity: entityName }
    });
    return response;
  }
};

// Reports API
export const reportsApi = {
  // Generate PDF report
  generatePDF: async (reportId) => {
    const response = await apiClient.post(`/api/reports/${reportId}/pdf`);
    return response;
  },

  // Download report
  downloadReport: async (reportId, format = 'pdf') => {
    const response = await apiClient.get(`/api/reports/${reportId}/download`, {
      params: { format },
      responseType: 'blob'
    });
    return response;
  }
};

// Utils API
export const utilsApi = {
  // Health check
  healthCheck: async () => {
    const response = await apiClient.get('/health');
    return response;
  },

  // Get API info
  getInfo: async () => {
    const response = await apiClient.get('/');
    return response;
  }
};

// Error handling helper
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.error || 'Server error occurred';
    
    switch (status) {
      case 400:
        return `Bad Request: ${message}`;
      case 401:
        return 'Unauthorized. Please check your credentials.';
      case 403:
        return 'Forbidden. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return message;
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection and try again.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.';
  }
};

// Session management
export const sessionApi = {
  // Create analysis session
  createSession: async (userType = 'INVESTOR', metadata = {}) => {
    const response = await apiClient.post('/api/session/create', {
      user_type: userType,
      metadata: metadata
    });
    return response;
  },

  // Get session summary
  getSessionSummary: async (sessionId) => {
    const response = await apiClient.get(`/api/session/${sessionId}/summary`);
    return response;
  }
};

export default apiClient;