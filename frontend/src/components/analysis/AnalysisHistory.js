import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { fraudDetectionApi } from '../../services/api';
import { toast } from 'react-toastify';

const AnalysisHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from the API
      // const response = await fraudDetectionApi.getHistory();
      
      // Sample data for demonstration
      const sampleHistory = [
        {
          id: '1',
          input_type: 'text',
          risk_score: 0.85,
          risk_level: 'HIGH',
          analysis_result: {
            indicators: ['Contains common fraud keywords', 'Unrealistic returns promised'],
            recommendations: ['DO NOT INVEST - High fraud risk detected']
          },
          blockchain_hash: '0x1a2b3c4d5e6f...',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          session_id: 'sess_001'
        },
        {
          id: '2',
          input_type: 'advisor',
          risk_score: 0.15,
          risk_level: 'LOW',
          analysis_result: {
            indicators: [],
            recommendations: ['Advisor is SEBI registered - good sign']
          },
          blockchain_hash: null,
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          session_id: 'sess_001'
        },
        {
          id: '3',
          input_type: 'url',
          risk_score: 0.65,
          risk_level: 'MEDIUM',
          analysis_result: {
            indicators: ['No SSL certificate', 'Domain created recently'],
            recommendations: ['Exercise caution before investing']
          },
          blockchain_hash: '0x9f8e7d6c5b4a...',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          session_id: 'sess_002'
        }
      ];

      setHistory(sampleHistory);
    } catch (error) {
      toast.error(`Failed to load history: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item =>
    item.input_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.risk_level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const getInputTypeLabel = (inputType) => {
    const labels = {
      text: 'Text Analysis',
      image: 'Image Analysis',
      qr: 'QR Code',
      url: 'URL Analysis',
      advisor: 'Advisor Check',
      corporate_announcement: 'Announcement'
    };
    return labels[inputType] || inputType;
  };

  const handleViewDetails = (analysis) => {
    setSelectedAnalysis(analysis);
    setDetailsOpen(true);
  };

  const handleDownloadReport = (analysisId) => {
    // In a real app, this would download the PDF report
    toast.info('PDF download functionality coming soon!');
  };

  const handleShareAnalysis = (analysis) => {
    const shareData = {
      title: `TrustX Fraud Analysis - ${analysis.risk_level} Risk`,
      text: `Analysis completed: ${analysis.risk_level} risk level detected`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(JSON.stringify(shareData));
      toast.success('Analysis details copied to clipboard!');
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderDetailsDialog = () => {
    if (!selectedAnalysis) return null;

    return (
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Analysis Details - {getInputTypeLabel(selectedAnalysis.input_type)}
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Risk Assessment
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Chip
                label={`${selectedAnalysis.risk_level} RISK`}
                color={getRiskColor(selectedAnalysis.risk_level)}
                variant="filled"
              />
              <Typography variant="body2">
                Score: {Math.round(selectedAnalysis.risk_score * 100)}%
              </Typography>
            </Box>
          </Box>

          {selectedAnalysis.analysis_result.indicators?.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Risk Indicators
              </Typography>
              <ul>
                {selectedAnalysis.analysis_result.indicators.map((indicator, index) => (
                  <li key={index}>
                    <Typography variant="body2">{indicator}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {selectedAnalysis.analysis_result.recommendations?.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Recommendations
              </Typography>
              <ul>
                {selectedAnalysis.analysis_result.recommendations.map((rec, index) => (
                  <li key={index}>
                    <Typography variant="body2">{rec}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Blockchain Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedAnalysis.blockchain_hash
                ? `Logged on blockchain: ${selectedAnalysis.blockchain_hash}`
                : 'Not logged on blockchain (low risk)'
              }
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Analysis Timestamp
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatTimestamp(selectedAnalysis.created_at)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          <Button
            variant="outlined"
            onClick={() => handleDownloadReport(selectedAnalysis.id)}
          >
            Download Report
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <Typography>Loading analysis history...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" component="h2">
                  Analysis History
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search analyses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 300 }}
                />
              </Box>

              {filteredHistory.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No analysis history found. Start by analyzing some content!
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Risk Level</TableCell>
                        <TableCell>Risk Score</TableCell>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Blockchain</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredHistory.map((analysis) => (
                        <TableRow key={analysis.id} hover>
                          <TableCell>
                            <Typography variant="body2">
                              {getInputTypeLabel(analysis.input_type)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={analysis.risk_level}
                              color={getRiskColor(analysis.risk_level)}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {Math.round(analysis.risk_score * 100)}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatTimestamp(analysis.created_at)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={analysis.blockchain_hash ? 'Verified' : 'Not Logged'}
                              color={analysis.blockchain_hash ? 'success' : 'default'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" gap={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(analysis)}
                                title="View Details"
                              >
                                <ViewIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDownloadReport(analysis.id)}
                                title="Download Report"
                              >
                                <DownloadIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleShareAnalysis(analysis)}
                                title="Share Analysis"
                              >
                                <ShareIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {renderDetailsDialog()}
    </Box>
  );
};

export default AnalysisHistory;