// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

// Google OAuth scopes
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive.file'
].join(' ');

// Google OAuth endpoints
export const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
export const GOOGLE_USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v2/userinfo';

// Redirect URI (should match what's configured in Google Console)
export const REDIRECT_URI = process.env.NODE_ENV === 'production' 
  ? 'https://personal-finance-app-seven-gamma.vercel.app'
  : window.location.origin;
