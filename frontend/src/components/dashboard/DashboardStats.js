import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  NotificationImportant as AlertIcon,
} from '@mui/icons-material';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { dashboardApi } from '../../services/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  BarElement
);

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardStats = async () => {
    try {
      // In a real app, this would fetch from the API
      // const response = await dashboardApi.getStats();
      
      // Sample data for demonstration
      const sampleStats = {
        overview: {
          total_analyses: 1247,
          analyses_today: 89,
          analyses_this_week: 523,
          analyses_this_month: 1247,
          high_risk_percentage: 23.5
        },
        risk_breakdown: {
          HIGH: 293,
          MEDIUM: 458,
          LOW: 496
        },
        input_type_breakdown: {
          text: 486,
          url: 321,
          image: 178,
          advisor: 156,
          qr: 106
        },
        trends: {
          high_risk_7_days: [
            { date: '2023-09-25', high_risk_count: 34 },
            { date: '2023-09-26', high_risk_count: 28 },
            { date: '2023-09-27', high_risk_count: 45 },
            { date: '2023-09-28', high_risk_count: 52 },
            { date: '2023-09-29', high_risk_count: 38 },
            { date: '2023-09-30', high_risk_count: 41 },
            { date: '2023-10-01', high_risk_count: 47 }
          ],
          fraud_detection_rate: {
            overall_accuracy: 92.5,
            false_positive_rate: 4.2,
            false_negative_rate: 3.3,
            high_risk_precision: 89.8
          }
        },
        blockchain: {
          total_blockchain_logs: 345,
          confirmed_logs: 340,
          pending_logs: 3,
          failed_logs: 2,
          success_rate: 98.6
        },
        sebi_verification: {
          advisor_verifications: 156,
          registered_advisors_cached: 2847,
          active_advisors: 2785,
          suspended_advisors: 62,
          verification_success_rate: 85.5
        },
        geographic_distribution: [
          { state: 'Maharashtra', fraud_reports: 45, percentage: 25.0 },
          { state: 'Delhi', fraud_reports: 38, percentage: 21.1 },
          { state: 'Karnataka', fraud_reports: 32, percentage: 17.8 },
          { state: 'Tamil Nadu', fraud_reports: 28, percentage: 15.6 },
          { state: 'Gujarat', fraud_reports: 22, percentage: 12.2 }
        ],
        top_fraud_patterns: [
          { pattern: 'Contains common fraud keywords', count: 127, severity: 'HIGH' },
          { pattern: 'Unrealistic returns promised', count: 89, severity: 'HIGH' },
          { pattern: 'Unregistered investment advisor', count: 76, severity: 'HIGH' },
          { pattern: 'Suspicious URL patterns', count: 54, severity: 'MEDIUM' },
          { pattern: 'No SSL certificate', count: 43, severity: 'MEDIUM' }
        ],
        alerts: [
          {
            type: 'HIGH_ACTIVITY',
            severity: 'HIGH',
            message: 'High fraud activity detected: 15 high-risk reports today',
            created_at: new Date().toISOString(),
            action_required: true
          },
          {
            type: 'NEW_FRAUD_PATTERN',
            severity: 'MEDIUM',
            message: 'New fraud pattern detected: Fake cryptocurrency investment apps',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            action_required: true
          }
        ]
      };

      setStats(sampleStats);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'info';
      default: return 'default';
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box color={`${color}.main`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Alert severity="error">
        Failed to load dashboard data. Please try again.
      </Alert>
    );
  }

  // Chart configurations
  const riskTrendData = {
    labels: stats.trends.high_risk_7_days.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'High Risk Detections',
        data: stats.trends.high_risk_7_days.map(d => d.high_risk_count),
        borderColor: 'rgb(220, 38, 127)',
        backgroundColor: 'rgba(220, 38, 127, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const riskBreakdownData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [stats.risk_breakdown.HIGH, stats.risk_breakdown.MEDIUM, stats.risk_breakdown.LOW],
        backgroundColor: [
          'rgba(244, 67, 54, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(76, 175, 80, 0.8)',
        ],
        borderColor: [
          'rgba(244, 67, 54, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(76, 175, 80, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const inputTypeData = {
    labels: Object.keys(stats.input_type_breakdown).map(key => 
      key.charAt(0).toUpperCase() + key.slice(1)
    ),
    datasets: [
      {
        label: 'Analyses by Type',
        data: Object.values(stats.input_type_breakdown),
        backgroundColor: 'rgba(25, 118, 210, 0.8)',
        borderColor: 'rgba(25, 118, 210, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Regulator Dashboard
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton onClick={loadDashboardStats} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Active Alerts */}
      {stats.alerts.length > 0 && (
        <Box mb={3}>
          {stats.alerts.map((alert, index) => (
            <Alert
              key={index}
              severity={getAlertSeverityColor(alert.severity)}
              icon={<AlertIcon />}
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {alert.type.replace('_', ' ')} Alert
              </Typography>
              <Typography variant="body2">
                {alert.message}
              </Typography>
            </Alert>
          ))}
        </Box>
      )}

      {/* Overview Statistics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Analyses"
            value={stats.overview.total_analyses.toLocaleString()}
            subtitle="All time"
            icon={<AssessmentIcon sx={{ fontSize: 40 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Analyses"
            value={stats.overview.analyses_today}
            subtitle="+12% from yesterday"
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="High Risk Rate"
            value={`${stats.overview.high_risk_percentage}%`}
            subtitle="This month"
            icon={<WarningIcon sx={{ fontSize: 40 }} />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Detection Accuracy"
            value={`${stats.trends.fraud_detection_rate.overall_accuracy}%`}
            subtitle="AI model performance"
            icon={<SecurityIcon sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* High Risk Trend Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                High Risk Detection Trends (Last 7 Days)
              </Typography>
              <Box height={300}>
                <Line
                  data={riskTrendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Level Breakdown */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Level Distribution
              </Typography>
              <Box height={300}>
                <Doughnut
                  data={riskBreakdownData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Analysis Type Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analysis Types
              </Typography>
              <Box height={250}>
                <Bar
                  data={inputTypeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Fraud Patterns */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Fraud Patterns
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Pattern</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Severity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.top_fraud_patterns.map((pattern, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2">
                            {pattern.pattern}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{pattern.count}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={pattern.severity}
                            size="small"
                            color={pattern.severity === 'HIGH' ? 'error' : 'warning'}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Blockchain Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Blockchain Integration
              </Typography>
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Success Rate</Typography>
                  <Typography variant="body2" color="success.main">
                    {stats.blockchain.success_rate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.blockchain.success_rate}
                  color="success"
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Logs
                  </Typography>
                  <Typography variant="h6">
                    {stats.blockchain.total_blockchain_logs}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {stats.blockchain.pending_logs}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* SEBI Verification Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                SEBI Verification Stats
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Active Advisors
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {stats.sebi_verification.active_advisors.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Suspended
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    {stats.sebi_verification.suspended_advisors}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Verification Success Rate
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <LinearProgress
                        variant="determinate"
                        value={stats.sebi_verification.verification_success_rate}
                        sx={{ flexGrow: 1 }}
                      />
                      <Typography variant="body2">
                        {stats.sebi_verification.verification_success_rate}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardStats;