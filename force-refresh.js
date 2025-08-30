// Force refresh localStorage data
if (typeof window !== 'undefined') {
  // Clear all financial data
  localStorage.removeItem('expenses');
  localStorage.removeItem('income');
  localStorage.removeItem('investments');
  localStorage.removeItem('financialGoals');
  localStorage.removeItem('bills');
  
  console.log('Force cleared all localStorage data');
  
  // Reload the page to ensure fresh data is loaded
  window.location.reload();
} else {
  console.log('Force refresh script completed');
}
