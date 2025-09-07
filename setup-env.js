#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables for Google OAuth...\n');

// Check if .env file already exists
const envPath = path.join(__dirname, '.env');
const envLocalPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath) || fs.existsSync(envLocalPath)) {
  console.log('⚠️  Environment file already exists. Please check your existing .env or .env.local file.');
  process.exit(0);
}

// Create .env.local file
const envContent = `# Google OAuth Configuration
# Replace with your actual Google Client ID from Google Cloud Console
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here

# Google API Key for Drive API
# Replace with your actual Google API Key from Google Cloud Console
REACT_APP_GOOGLE_API_KEY=your_google_api_key_here
`;

try {
  fs.writeFileSync(envLocalPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('\n📝 Next steps:');
  console.log('1. Go to Google Cloud Console (https://console.cloud.google.com/)');
  console.log('2. Create a new project or select existing one');
  console.log('3. Enable Google Drive API');
  console.log('4. Create OAuth 2.0 credentials (Web application)');
  console.log('5. Add authorized redirect URIs:');
  console.log('   - http://localhost:3000 (for development)');
  console.log('   - https://yourdomain.com (for production)');
  console.log('6. Create an API key');
  console.log('7. Replace the placeholder values in .env.local with your actual credentials');
  console.log('8. Restart your development server');
  console.log('\n🔗 For detailed instructions, see GOOGLE_OAUTH_SETUP.md');
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  process.exit(1);
}
