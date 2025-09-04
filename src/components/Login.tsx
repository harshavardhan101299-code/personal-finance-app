import React from 'react';
import { Box, Card, CardContent, Typography, Button, Container } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { GoogleAuthService } from '../services/googleAuthService';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await GoogleAuthService.initiateAuth();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F9FAFB',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1E3A8A', fontWeight: 600 }}>
              Personal Finance App
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Sign in to manage your personal finances securely
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{
                backgroundColor: '#4285F4',
                '&:hover': {
                  backgroundColor: '#3367D6',
                },
                py: 1.5,
                px: 3,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(66, 133, 244, 0.3)',
                mb: 2,
              }}
            >
              Sign in with Google
            </Button>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              or
            </Typography>

            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                const demoUser = {
                  id: `demo_${Date.now()}`,
                  email: 'demo@example.com',
                  name: 'Demo User',
                  picture: 'https://via.placeholder.com/150'
                };
                login(demoUser);
              }}
              sx={{
                borderColor: '#1E3A8A',
                color: '#1E3A8A',
                '&:hover': {
                  borderColor: '#1E40AF',
                  backgroundColor: 'rgba(30, 58, 138, 0.04)',
                },
                py: 1.5,
                px: 3,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              Try Demo Mode
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
              Your financial data is stored locally and securely
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
