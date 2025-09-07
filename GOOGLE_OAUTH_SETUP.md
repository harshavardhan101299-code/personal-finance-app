# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Personal Finance App.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top
3. Click "New Project"
4. Enter a project name (e.g., "Personal Finance App")
5. Click "Create"

### 2. Enable Google+ API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on it and click "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - User Type: External
   - App name: "Personal Finance App"
   - User support email: Your email
   - Developer contact information: Your email
   - Save and continue

4. Back to creating OAuth client ID:
   - Application type: Web application
   - Name: "Personal Finance App Web Client"
   - Authorized redirect URIs:
     - For development: `http://localhost:3000`
     - For production: `https://yourdomain.com`
   - Click "Create"

### 4. Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Google Client ID:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_actual_client_id_here
```

3. Replace `your_actual_client_id_here` with the Client ID from step 3

### 5. Test the Integration

1. Start your development server: `npm start`
2. Click "Sign in with Google" on the login page
3. You should be redirected to Google's OAuth consent screen
4. After authorization, you'll be redirected back to your app

## Security Notes

- Never commit your `.env.local` file to version control
- The Client ID is safe to expose in client-side code
- All user data is stored locally in the browser
- No financial data is sent to Google or any external servers

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Make sure the redirect URI in Google Console matches exactly
   - Check for trailing slashes or protocol mismatches

2. **"Client ID not configured" error**
   - Verify your `.env.local` file exists
   - Make sure the variable name is exactly `REACT_APP_GOOGLE_CLIENT_ID`
   - Restart your development server after adding the environment variable

3. **"OAuth consent screen not configured" error**
   - Complete the OAuth consent screen setup in Google Console
   - Make sure you've added your email as a test user

## Cloud Storage Setup

The app now supports cloud storage using Google Drive API. To enable this feature:

### 1. Enable Google Drive API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Library"
4. Search for "Google Drive API" and enable it

### 2. Add Google API Key
1. Go to "APIs & Services" > "Credentials"
2. Create an API key (or use existing one)
3. Add the API key to your `.env` file:
   ```
   REACT_APP_GOOGLE_API_KEY=your_api_key_here
   ```

### 3. Update OAuth Scopes
The app now requests additional permissions for Google Drive access. When users log in, they'll be asked to grant permission to:
- View and manage their Google Drive files (for cloud sync)

### How Cloud Sync Works
- **Automatic Sync**: Data is automatically synced to Google Drive when you make changes
- **Cross-Device Access**: Your data is accessible from any device/browser when logged in
- **Manual Sync**: Use the "Cloud Sync" tab to manually upload/download data
- **Data Safety**: Your data is stored in a private folder in your Google Drive

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure the Google+ API and Google Drive API are enabled in your project
4. Check that your redirect URIs are configured correctly
5. Make sure you've granted Drive permissions during login
