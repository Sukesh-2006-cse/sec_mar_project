import React, { useState } from 'react';
import Head from 'next/head';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Chip,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  Shield as ShieldIcon,
  Blockchain as BlockchainIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import MultiInputAnalysis from '../src/components/analysis/MultiInputAnalysis';
import DashboardStats from '../src/components/dashboard/DashboardStats';
import AnalysisHistory from '../src/components/analysis/AnalysisHistory';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('analyze');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);

  const menuItems = [
    {
      id: 'analyze',
      label: 'Fraud Analysis',
      icon: <SecurityIcon />,
      component: <MultiInputAnalysis onAnalysisComplete={() => setAnalysisCount(prev => prev + 1)} />
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      component: <DashboardStats />
    },
    {
      id: 'history',
      label: 'History',
      icon: <HistoryIcon />,
      component: <AnalysisHistory />
    }
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const renderCurrentComponent = () => {
    const currentItem = menuItems.find(item => item.id === selectedTab);
    return currentItem ? currentItem.component : null;
  };

  return (
    <>
      <Head>
        <title>TrustX - AI + Blockchain Investment Fraud Detection</title>
        <meta name="description" content="Detect fraud with AI, secure truth with blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <ShieldIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              TrustX
            </Typography>
            
            <Chip
              label="Detect fraud with AI, secure truth with blockchain"
              variant="outlined"
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.5)',
                display: { xs: 'none', md: 'flex' }
              }}
            />
            
            <Badge badgeContent={analysisCount} color="secondary" sx={{ ml: 2 }}>
              <AssessmentIcon />
            </Badge>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          {/* Side Navigation */}
          <Drawer
            variant="temporary"
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
            }}
          >
            <List>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.id}
                  selected={selectedTab === item.id}
                  onClick={() => {
                    setSelectedTab(item.id);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Drawer>

          {/* Desktop Navigation */}
          <Box
            component="nav"
            sx={{
              width: 240,
              flexShrink: 0,
              display: { xs: 'none', sm: 'block' },
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            <List>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.id}
                  selected={selectedTab === item.id}
                  onClick={() => setSelectedTab(item.id)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Container maxWidth="xl">
              {selectedTab === 'analyze' && (
                <>
                  {/* Hero Section */}
                  <Box textAlign="center" mb={4}>
                    <Typography variant="h3" component="h1" gutterBottom>
                      Investment Fraud Detection Platform
                    </Typography>
                    <Typography variant="h6" color="text.secondary" mb={2}>
                      Protect yourself from investment frauds with AI-powered analysis and blockchain verification
                    </Typography>
                    
                    {/* Key Features */}
                    <Grid container spacing={2} justifyContent="center" mb={4}>
                      <Grid item>
                        <Chip
                          icon={<SecurityIcon />}
                          label="AI Fraud Detection"
                          color="primary"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          icon={<BlockchainIcon />}
                          label="Blockchain Verified"
                          color="secondary"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          icon={<AssessmentIcon />}
                          label="SEBI Integrated"
                          color="success"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          icon={<WarningIcon />}
                          label="Real-time Alerts"
                          color="warning"
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}

              {/* Render Selected Component */}
              {renderCurrentComponent()}
            </Container>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: 'grey.100',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2023 TrustX - AI + Blockchain Powered Investor Protection Network.
            Built in alignment with SEBI's Safe Space initiative.
          </Typography>
        </Box>
      </Box>
    </>
  );
}