import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Container
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  AccountBalance as BudgetIcon,
  CloudUpload as UploadIcon,
  Flag as GoalsIcon,
  Payment as BillsIcon,
  TrendingUp as IncomeIcon,
  CloudSync as CloudSyncIcon
} from '@mui/icons-material';
import UserProfile from './UserProfile';

interface NavigationProps {
  currentTab: number;
  onTabChange: (tab: number) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0, mr: { xs: 2, md: 4 } }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box 
                component="span"
                sx={{ 
                  fontSize: { xs: '1.8rem', sm: '2rem' },
                  color: '#FFD700',
                  fontWeight: 'bold',
                  fontFamily: 'serif',
                  textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
                  display: 'inline-block',
                  transform: 'scale(1.2)',
                  lineHeight: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    textShadow: '0 0 12px rgba(255, 215, 0, 0.8)',
                    transform: 'scale(1.25)'
                  }
                }}
              >
                ₹
              </Box>
              Harsha's Finance
            </Typography>
          </Box>
          <Tabs 
            value={currentTab} 
            onChange={handleChange} 
            sx={{ 
              flexGrow: 1,
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 500,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                minHeight: 64,
                '&.Mui-selected': {
                  color: 'white',
                  fontWeight: 600,
                },
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#F97316',
                height: 3,
              }
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              icon={<DashboardIcon />} 
              label="Dashboard" 
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 1
                }
              }}
            />
            <Tab 
              icon={<ReceiptIcon />} 
              label="Expenses" 
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 1
                }
              }}
            />
            <Tab 
              icon={<IncomeIcon />} 
              label="Income" 
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 1
                }
              }}
            />
            <Tab 
              icon={<BudgetIcon />} 
              label="Budget" 
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 1
                }
              }}
            />
            <Tab 
              icon={<GoalsIcon />} 
              label="Goals" 
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 1
                }
              }}
            />
            <Tab 
              icon={<BillsIcon />} 
              label="Bills" 
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 1
                }
              }}
            />
            <Tab 
              icon={<UploadIcon />} 
              label="Upload" 
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 1
                }
              }}
            />
            <Tab 
              icon={<CloudSyncIcon />} 
              label="Cloud Sync" 
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 1
                }
              }}
            />
          </Tabs>
          
          <Box sx={{ ml: 2 }}>
            <UserProfile />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
