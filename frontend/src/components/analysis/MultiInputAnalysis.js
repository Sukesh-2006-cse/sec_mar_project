import React, { useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  QrCode as QrIcon,
  Link as LinkIcon,
  TextFields as TextIcon,
  Person as AdvisorIcon,
  Business as BusinessIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { fraudDetectionApi } from '../../services/api';

const MultiInputAnalysis = ({ onAnalysisComplete }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Form states
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [advisorName, setAdvisorName] = useState('');
  const [advisorId, setAdvisorId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const tabsConfig = [
    {
      label: 'Text Analysis',
      icon: <TextIcon />,
      description: 'Analyze WhatsApp messages, SMS, emails for fraud patterns'
    },
    {
      label: 'Image/QR Scan',
      icon: <UploadIcon />,
      description: 'Upload screenshots, certificates, or QR codes for analysis'
    },
    {
      label: 'URL Analysis',
      icon: <LinkIcon />,
      description: 'Check suspicious website links and trading platforms'
    },
    {
      label: 'Advisor Check',
      icon: <AdvisorIcon />,
      description: 'Verify investment advisors against SEBI registry'
    },
    {
      label: 'Announcement',
      icon: <BusinessIcon />,
      description: 'Verify corporate announcements and press releases'
    }
  ];

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      toast.success('File uploaded successfully!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const simulateProgress = () => {
    setAnalysisProgress(0);
    const steps = [
      { progress: 20, message: 'Extracting content...' },
      { progress: 40, message: 'Running AI analysis...' },
      { progress: 60, message: 'Checking databases...' },
      { progress: 80, message: 'Verifying with blockchain...' },
      { progress: 100, message: 'Generating report...' }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setAnalysisProgress(step.progress);
        if (step.progress === 100) {
          setTimeout(() => {
            setAnalyzing(false);
            setAnalysisProgress(0);
          }, 500);
        }
      }, (index + 1) * 1000);
    });
  };

  const handleAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisResult(null);
    simulateProgress();

    try {
      let result;
      
      switch (selectedTab) {
        case 0: // Text Analysis
          if (!textInput.trim()) {
            toast.error('Please enter text to analyze');
            setAnalyzing(false);
            return;
          }
          result = await fraudDetectionApi.analyzeText(textInput);
          break;

        case 1: // Image/QR Analysis
          if (!uploadedFile) {
            toast.error('Please upload an image file');
            setAnalyzing(false);
            return;
          }
          
          const formData = new FormData();
          formData.append('image', uploadedFile);
          formData.append('type', uploadedFile.type.includes('image') ? 'image' : 'qr');
          
          result = await fraudDetectionApi.analyzeImage(formData);
          break;

        case 2: // URL Analysis
          if (!urlInput.trim()) {
            toast.error('Please enter a URL to analyze');
            setAnalyzing(false);
            return;
          }
          result = await fraudDetectionApi.analyzeUrl(urlInput);
          break;

        case 3: // Advisor Check
          if (!advisorName.trim()) {
            toast.error('Please enter advisor name');
            setAnalyzing(false);
            return;
          }
          result = await fraudDetectionApi.verifyAdvisor(advisorName, advisorId);
          break;

        case 4: // Announcement Analysis
          if (!announcementText.trim() || !companyName.trim()) {
            toast.error('Please fill in both company name and announcement text');
            setAnalyzing(false);
            return;
          }
          result = await fraudDetectionApi.analyzeAnnouncement(companyName, announcementText);
          break;

        default:
          throw new Error('Invalid analysis type');
      }

      setTimeout(() => {
        setAnalysisResult(result);
        if (onAnalysisComplete) onAnalysisComplete();
        
        // Show appropriate toast based on risk level
        const riskLevel = result.analysis?.risk_level || result.risk_level || 'UNKNOWN';
        if (riskLevel === 'HIGH') {
          toast.error('HIGH RISK detected! Please review the analysis carefully.');
        } else if (riskLevel === 'MEDIUM') {
          toast.warning('MEDIUM RISK detected. Exercise caution.');
        } else {
          toast.success('Analysis completed successfully.');
        }
      }, 5000); // Wait for progress animation to complete

    } catch (error) {
      setTimeout(() => {
        setAnalyzing(false);
        setAnalysisProgress(0);
        toast.error(`Analysis failed: ${error.message}`);
      }, 1000);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH': return <ErrorIcon />;
      case 'MEDIUM': return <WarningIcon />;
      case 'LOW': return <CheckIcon />;
      default: return <InfoIcon />;
    }
  };

  const renderAnalysisForm = () => {
    switch (selectedTab) {
      case 0: // Text Analysis
        return (
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Enter text content to analyze"
            placeholder="Paste WhatsApp messages, SMS, emails, or any suspicious text here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            variant="outlined"
          />
        );

      case 1: // Image/QR Analysis
        return (
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'primary.light' : 'transparent',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.light',
              },
            }}
          >
            <input {...getInputProps()} />
            <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {uploadedFile ? uploadedFile.name : 'Upload Image or QR Code'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isDragActive
                ? 'Drop the file here...'
                : 'Drag & drop files here, or click to select files'}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Supports: JPG, PNG, GIF, PDF (Max 16MB)
            </Typography>
          </Box>
        );

      case 2: // URL Analysis
        return (
          <TextField
            fullWidth
            label="Website URL"
            placeholder="https://example.com or paste suspicious link here..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            variant="outlined"
          />
        );

      case 3: // Advisor Check
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Investment Advisor Name"
                placeholder="Enter advisor name"
                value={advisorName}
                onChange={(e) => setAdvisorName(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Advisor ID (Optional)"
                placeholder="INA000001234"
                value={advisorId}
                onChange={(e) => setAdvisorId(e.target.value)}
                variant="outlined"
                helperText="SEBI registration ID if known"
              />
            </Grid>
          </Grid>
        );

      case 4: // Announcement Analysis
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Announcement Text"
                placeholder="Paste the corporate announcement or press release here..."
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    const analysis = analysisResult.analysis || analysisResult;
    const riskLevel = analysis.risk_level || analysis.verification_status || 'UNKNOWN';
    const riskScore = analysis.risk_score || (analysis.credibility_score ? 1 - analysis.credibility_score : 0);
    const indicators = analysis.indicators || analysis.risk_indicators || [];
    const recommendations = analysis.recommendations || [];

    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" component="h2">
              Analysis Results
            </Typography>
            <Chip
              icon={getRiskIcon(riskLevel)}
              label={`${riskLevel} RISK`}
              color={getRiskColor(riskLevel)}
              variant="filled"
              size="large"
            />
          </Box>

          <Box mb={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Risk Score: {Math.round(riskScore * 100)}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={riskScore * 100}
              color={getRiskColor(riskLevel)}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          {indicators.length > 0 && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Risk Indicators
              </Typography>
              <List dense>
                {indicators.map((indicator, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon>
                      <WarningIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary={indicator} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {recommendations.length > 0 && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Recommendations
              </Typography>
              <List dense>
                {recommendations.map((recommendation, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon>
                      <InfoIcon color="info" />
                    </ListItemIcon>
                    <ListItemText primary={recommendation} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => setDetailsOpen(true)}
              size="small"
            >
              View Details
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                // In a real app, this would generate and download a PDF
                toast.info('PDF report generation coming soon!');
              }}
              size="small"
            >
              Download Report
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
                toast.success('Analysis results copied to clipboard!');
              }}
              size="small"
            >
              Share Results
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Multi-Input Fraud Analysis
              </Typography>
              
              <Tabs
                value={selectedTab}
                onChange={(e, newValue) => setSelectedTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
              >
                {tabsConfig.map((tab, index) => (
                  <Tab
                    key={index}
                    icon={tab.icon}
                    label={tab.label}
                    iconPosition="start"
                  />
                ))}
              </Tabs>

              <Typography variant="body2" color="text.secondary" mb={3}>
                {tabsConfig[selectedTab]?.description}
              </Typography>

              {renderAnalysisForm()}

              <Box mt={3}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAnalysis}
                  disabled={analyzing}
                  startIcon={analyzing ? <CircularProgress size={20} /> : <SecurityIcon />}
                  fullWidth
                >
                  {analyzing ? 'Analyzing...' : 'Analyze for Fraud'}
                </Button>
              </Box>

              {analyzing && (
                <Box mt={2}>
                  <LinearProgress 
                    variant="determinate" 
                    value={analysisProgress} 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {analysisProgress < 100 ? `Processing... ${analysisProgress}%` : 'Finalizing...'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {renderAnalysisResult()}

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detailed Analysis</DialogTitle>
        <DialogContent>
          <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px' }}>
            {JSON.stringify(analysisResult, null, 2)}
          </pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MultiInputAnalysis;