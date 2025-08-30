import { ExpenseEntry, ExpenseCategory, Investment } from '../types';

// Clean monthly data from pivot table screenshots (2025)
export const aprilExpenses: ExpenseEntry[] = [
  { id: 'apr-1', date: '2025-04-01', type: 'Dining', description: 'April Dining Expenses', paidBy: 'Me', amount: 4776 },
  { id: 'apr-2', date: '2025-04-01', type: 'Entertainment', description: 'April Entertainment', paidBy: 'Me', amount: 1062 },
  { id: 'apr-3', date: '2025-04-01', type: 'Personal Care', description: 'April Personal Care', paidBy: 'Me', amount: 34 },
  { id: 'apr-4', date: '2025-04-01', type: 'Shopping', description: 'April Shopping', paidBy: 'Me', amount: 2524 },
  { id: 'apr-5', date: '2025-04-01', type: 'Subscriptions', description: 'April Subscriptions', paidBy: 'Me', amount: 1752 },
  { id: 'apr-6', date: '2025-04-01', type: 'Travel', description: 'April Travel', paidBy: 'Me', amount: 2625 },
];

export const mayExpenses: ExpenseEntry[] = [
  { id: 'may-1', date: '2025-05-01', type: 'Dining', description: 'May Dining Expenses', paidBy: 'Me', amount: 8635 },
  { id: 'may-2', date: '2025-05-01', type: 'Entertainment', description: 'May Entertainment', paidBy: 'Me', amount: 3838 },
  { id: 'may-3', date: '2025-05-01', type: 'Groceries', description: 'May Groceries', paidBy: 'Me', amount: 1246 },
  { id: 'may-4', date: '2025-05-01', type: 'Medical', description: 'May Medical', paidBy: 'Me', amount: 12 },
  { id: 'may-5', date: '2025-05-01', type: 'Miscellaneous', description: 'May Miscellaneous', paidBy: 'Me', amount: 2586 },
  { id: 'may-6', date: '2025-05-01', type: 'Personal Care', description: 'May Personal Care', paidBy: 'Me', amount: 45 },
  { id: 'may-7', date: '2025-05-01', type: 'Shopping', description: 'May Shopping', paidBy: 'Me', amount: 2000 },
  { id: 'may-8', date: '2025-05-01', type: 'Subscriptions', description: 'May Subscriptions', paidBy: 'Me', amount: 746 },
  { id: 'may-9', date: '2025-05-01', type: 'Travel', description: 'May Travel', paidBy: 'Me', amount: 6860 },
  { id: 'may-10', date: '2025-05-01', type: 'Work', description: 'May Work Expenses', paidBy: 'Me', amount: 22350 },
];

export const juneExpenses: ExpenseEntry[] = [
  { id: 'jun-1', date: '2025-06-01', type: 'Dining', description: 'June Dining Expenses', paidBy: 'Me', amount: 3778 },
  { id: 'jun-2', date: '2025-06-01', type: 'Entertainment', description: 'June Entertainment', paidBy: 'Me', amount: 95 },
  { id: 'jun-3', date: '2025-06-01', type: 'Groceries', description: 'June Groceries', paidBy: 'Me', amount: 3571 },
  { id: 'jun-4', date: '2025-06-01', type: 'Miscellaneous', description: 'June Miscellaneous', paidBy: 'Me', amount: 24505 },
  { id: 'jun-5', date: '2025-06-01', type: 'Personal Care', description: 'June Personal Care', paidBy: 'Me', amount: 1079.25 },
  { id: 'jun-6', date: '2025-06-01', type: 'Subscriptions', description: 'June Subscriptions', paidBy: 'Me', amount: 936 },
  { id: 'jun-7', date: '2025-06-01', type: 'Travel', description: 'June Travel', paidBy: 'Me', amount: 4424 },
  { id: 'jun-8', date: '2025-06-01', type: 'Work', description: 'June Work Expenses', paidBy: 'Me', amount: 3000 },
];

export const julyExpenses: ExpenseEntry[] = [
  { id: 'jul-1', date: '2025-07-01', type: 'Dining', description: 'July Dining Expenses', paidBy: 'Me', amount: 5713 },
  { id: 'jul-2', date: '2025-07-01', type: 'Groceries', description: 'July Groceries', paidBy: 'Me', amount: 2802 },
  { id: 'jul-3', date: '2025-07-01', type: 'Miscellaneous', description: 'July Miscellaneous', paidBy: 'Me', amount: 65172 },
  { id: 'jul-4', date: '2025-07-01', type: 'Personal Care', description: 'July Personal Care', paidBy: 'Me', amount: 301 },
  { id: 'jul-5', date: '2025-07-01', type: 'Subscriptions', description: 'July Subscriptions', paidBy: 'Me', amount: 5241 },
  { id: 'jul-6', date: '2025-07-01', type: 'Travel', description: 'July Travel', paidBy: 'Me', amount: 1500 },
  { id: 'jul-7', date: '2025-07-01', type: 'Work', description: 'July Work Expenses', paidBy: 'Me', amount: 3000 },
];

export const augustExpenses: ExpenseEntry[] = [
  { id: 'aug-1', date: '2025-08-01', type: 'Dining', description: 'August Dining Expenses', paidBy: 'Me', amount: 6624.02 },
  { id: 'aug-2', date: '2025-08-01', type: 'Groceries', description: 'August Groceries', paidBy: 'Me', amount: 1449 },
  { id: 'aug-3', date: '2025-08-01', type: 'Learning & Growth', description: 'August Learning & Growth', paidBy: 'Me', amount: 542 },
  { id: 'aug-4', date: '2025-08-01', type: 'Miscellaneous', description: 'August Miscellaneous', paidBy: 'Me', amount: 32524.44 },
  { id: 'aug-5', date: '2025-08-01', type: 'Personal Care', description: 'August Personal Care', paidBy: 'Me', amount: 2618 },
  { id: 'aug-6', date: '2025-08-01', type: 'Subscriptions', description: 'August Subscriptions', paidBy: 'Me', amount: 606 },
  { id: 'aug-7', date: '2025-08-01', type: 'Work', description: 'August Work Expenses', paidBy: 'Me', amount: 3000 },
];

// Income data for 2025
export const aprilIncome: ExpenseEntry[] = [
  { id: 'apr-income-1', date: '2025-04-01', type: 'Income', description: 'April Income', paidBy: 'Me', amount: 0 },
];

export const mayIncome: ExpenseEntry[] = [
  { id: 'may-income-1', date: '2025-05-01', type: 'Income', description: 'May Income', paidBy: 'Me', amount: 0 },
];

export const juneIncome: ExpenseEntry[] = [
  { id: 'jun-income-1', date: '2025-06-01', type: 'Income', description: 'June Income', paidBy: 'Me', amount: 121773 },
];

export const julyIncome: ExpenseEntry[] = [
  { id: 'jul-income-1', date: '2025-07-01', type: 'Income', description: 'July Income', paidBy: 'Me', amount: 76568 },
];

export const augustIncome: ExpenseEntry[] = [
  { id: 'aug-income-1', date: '2025-08-01', type: 'Income', description: 'August Income', paidBy: 'Me', amount: 76568 },
];

// Investment data for 2025
export const aprilInvestments: Investment[] = [
  { id: 'apr-inv-1', name: 'April Investments', type: 'mutual-funds', amount: 0, currentValue: 0, purchaseDate: '2025-04-01', description: 'April Investment Allocation' },
];

export const mayInvestments: Investment[] = [
  { id: 'may-inv-1', name: 'May Investments', type: 'mutual-funds', amount: 0, currentValue: 0, purchaseDate: '2025-05-01', description: 'May Investment Allocation' },
];

export const juneInvestments: Investment[] = [
  { id: 'jun-inv-1', name: 'June Investments', type: 'mutual-funds', amount: 35000, currentValue: 35000, purchaseDate: '2025-06-01', description: 'June Investment Allocation' },
];

export const julyInvestments: Investment[] = [
  { id: 'jul-inv-1', name: 'July Investments', type: 'mutual-funds', amount: 45000, currentValue: 45000, purchaseDate: '2025-07-01', description: 'July Investment Allocation' },
];

export const augustInvestments: Investment[] = [
  { id: 'aug-inv-1', name: 'August Investments', type: 'mutual-funds', amount: 30000, currentValue: 30000, purchaseDate: '2025-08-01', description: 'August Investment Allocation' },
];

// Combine all months
export const allExpenses: ExpenseEntry[] = [
  ...aprilExpenses,
  ...mayExpenses,
  ...juneExpenses,
  ...julyExpenses,
  ...augustExpenses,
];

export const allIncome: ExpenseEntry[] = [
  ...aprilIncome,
  ...mayIncome,
  ...juneIncome,
  ...julyIncome,
  ...augustIncome,
];

export const allInvestments: Investment[] = [
  ...aprilInvestments,
  ...mayInvestments,
  ...juneInvestments,
  ...julyInvestments,
  ...augustInvestments,
];

// Updated categories based on all months
export const expenseCategories: ExpenseCategory[] = [
  { name: 'Dining', budget: 4000, color: '#FF6B6B' },
  { name: 'Groceries', budget: 3000, color: '#4ECDC4' },
  { name: 'Personal Care', budget: 1500, color: '#45B7D1' },
  { name: 'Subscriptions', budget: 1500, color: '#96CEB4' },
  { name: 'Entertainment', budget: 2000, color: '#FFEAA7' },
  { name: 'Shopping', budget: 2000, color: '#DDA0DD' },
  { name: 'Travel', budget: 4000, color: '#98D8C8' },
  { name: 'Work', budget: 3000, color: '#F7DC6F' },
  { name: 'Medical', budget: 1000, color: '#BB8FCE' },
  { name: 'Miscellaneous', budget: 5000, color: '#85C1E9' },
  { name: 'Learning & Growth', budget: 500, color: '#F8C471' },
  { name: 'Income', budget: null, color: '#2ECC71' },
];
