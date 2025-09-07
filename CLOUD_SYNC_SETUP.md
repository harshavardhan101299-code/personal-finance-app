# Cloud Sync Setup Guide

This guide will help you set up Google Drive cloud sync for your Personal Finance App.

## Quick Setup

1. **Run the setup script:**
   ```bash
   npm run setup-env
   ```

2. **Follow the instructions** provided by the script to configure your Google OAuth credentials.

## Manual Setup

If you prefer to set up manually:

### 1. Create Environment File

Create a `.env.local` file in your project root with the following content:

```env
# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_GOOGLE_API_KEY=your_google_api_key_here
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Drive API
   - Google+ API (or Google Identity)

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: "Personal Finance App"
   - User support email: Your email
   - Developer contact information: Your email

4. Create OAuth client ID:
   - Application type: Web application
   - Name: "Personal Finance App Web Client"
   - Authorized redirect URIs:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)

5. Copy the Client ID and replace `your_google_client_id_here` in your `.env.local` file

### 4. Create API Key

1. In "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API key"
3. Copy the API key and replace `your_google_api_key_here` in your `.env.local` file

### 5. Restart Development Server

After configuring your environment variables:

```bash
npm start
```

## How Cloud Sync Works

- **Automatic Detection**: The app automatically detects if cloud sync is available after Google login
- **Token Storage**: Access tokens are stored securely in localStorage
- **Reinitialization**: If cloud sync appears disabled, the app will attempt to reinitialize from stored tokens
- **Manual Retry**: Use the "Retry" button in the Cloud Sync page if initialization fails

## Troubleshooting

### Cloud Sync Shows as "Disabled"

1. **Check Environment Variables**: Ensure your `.env.local` file has the correct Google Client ID and API Key
2. **Restart Server**: Restart your development server after adding environment variables
3. **Check Console**: Open browser developer tools and check for error messages
4. **Retry Button**: Click the "Retry" button in the Cloud Sync page
5. **Re-login**: Try logging out and logging back in with Google

### Common Issues

1. **"Invalid redirect URI"**: Make sure your redirect URIs in Google Console match exactly
2. **"Client ID not configured"**: Verify your `.env.local` file exists and has the correct variable names
3. **"Drive API not available"**: Ensure Google Drive API is enabled in your Google Cloud project

### Debug Information

The app logs detailed information to the browser console. Check the console for:
- Cloud sync availability checks
- Google API initialization status
- Token storage and retrieval
- Drive API connection status

## Security Notes

- Never commit your `.env.local` file to version control
- The Client ID is safe to expose in client-side code
- Access tokens are stored in localStorage and are user-specific
- All data is stored in a private folder in your Google Drive
- No financial data is sent to external servers except Google Drive

## Features

- **Upload to Cloud**: Sync your local data to Google Drive
- **Download from Cloud**: Retrieve data from Google Drive
- **Full Sync**: Two-way sync that merges local and cloud data
- **Automatic Backup**: Data is automatically backed up when you make changes
- **Cross-Device Access**: Access your data from any device when logged in

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure Google Drive API is enabled in your project
4. Check that your redirect URIs are configured correctly
5. Make sure you've granted Drive permissions during login
