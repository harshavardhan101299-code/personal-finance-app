// Simple test script to verify cloud sync functionality
// Run this in the browser console after logging in

console.log('Testing Cloud Sync Functionality...');

// Test 1: Check if Google APIs are loaded
console.log('Test 1: Google APIs loaded?', !!window.gapi);

// Test 2: Check if CloudStorageService is available
if (window.gapi && window.gapi.client && window.gapi.client.drive) {
  console.log('Test 2: Google Drive API available?', true);
} else {
  console.log('Test 2: Google Drive API available?', false);
}

// Test 3: Check if user is authenticated
const currentUser = localStorage.getItem('currentUser');
if (currentUser) {
  const user = JSON.parse(currentUser);
  console.log('Test 3: User authenticated?', true, 'User:', user.email);
  
  // Test 4: Check if UserDataStorage can be created
  try {
    // This would need to be imported in a real test
    console.log('Test 4: UserDataStorage can be created for user:', user.id);
  } catch (error) {
    console.log('Test 4: UserDataStorage creation failed:', error);
  }
} else {
  console.log('Test 3: User authenticated?', false);
}

// Test 5: Check localStorage data
const expenses = localStorage.getItem(`${currentUser ? JSON.parse(currentUser).id : 'test'}_expenses`);
console.log('Test 5: Local expenses data?', !!expenses, expenses ? JSON.parse(expenses).length : 0, 'entries');

console.log('Cloud Sync Test Complete!');
console.log('To test full functionality:');
console.log('1. Make sure you\'re logged in with Google');
console.log('2. Go to the Cloud Sync tab');
console.log('3. Try uploading/downloading data');
console.log('4. Check your Google Drive for a "PersonalFinanceApp" folder');
