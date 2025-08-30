// Clear localStorage to remove old data with paidBy fields
if (typeof window !== 'undefined') {
  localStorage.removeItem('expenses');
  localStorage.removeItem('income');
  localStorage.removeItem('investments');
  console.log('Cleared expenses, income, and investments from localStorage');
}
