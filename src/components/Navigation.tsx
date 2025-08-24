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
  CloudUpload as UploadIcon
} from '@mui/icons-material';

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
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 0, 
              mr: { xs: 2, md: 4 },
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              color: 'white'
            }}
          >
            💰 Harsha's Expenses
          </Typography>
          <Tabs 
            value={currentTab} 
            onChange={handleChange} 
            sx={{ 
              flexGrow: 1,
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
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
                backgroundColor: '#ff6f00',
                height: 3,
              }
            }}
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
              label="Expense Tracker" 
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 1
                }
              }}
            />
            <Tab 
              icon={<BudgetIcon />} 
              label="Budget Manager" 
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 1
                }
              }}
            />
            <Tab 
              icon={<UploadIcon />} 
              label="Data Upload" 
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 1
                }
              }}
            />
          </Tabs>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
