// Clear localStorage to remove old data with paidBy fields
if (typeof window !== 'undefined') {
  localStorage.removeItem('expenses');
  console.log('Cleared expenses from localStorage');
}
