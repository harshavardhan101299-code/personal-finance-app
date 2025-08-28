import { ExpenseEntry, ExpenseCategory } from '../types';

export interface DataValidationResult {
  isValid: boolean;
  issues: string[];
  summary: {
    totalExpenses: number;
    totalAmount: number;
    categories: string[];
    dateRanges: {
      earliest: string;
      latest: string;
    };
  };
}

export const validateExpenseData = (expenses: ExpenseEntry[]): DataValidationResult => {
  const issues: string[] = [];
  const categories = new Set<string>();
  const dates: string[] = [];
  let totalAmount = 0;

  // Validate each expense
  expenses.forEach((expense, index) => {
    // Check required fields
    if (!expense.id) issues.push(`Expense ${index + 1}: Missing ID`);
    if (!expense.date) issues.push(`Expense ${index + 1}: Missing date`);
    if (!expense.type) issues.push(`Expense ${index + 1}: Missing type`);
    if (!expense.description) issues.push(`Expense ${index + 1}: Missing description`);
    if (typeof expense.amount !== 'number') issues.push(`Expense ${index + 1}: Invalid amount`);
    if (!expense.paidBy) issues.push(`Expense ${index + 1}: Missing paidBy`);

    // Check date format
    if (expense.date && !/^\d{4}-\d{2}-\d{2}$/.test(expense.date)) {
      issues.push(`Expense ${index + 1}: Invalid date format (${expense.date})`);
    }

    // Check amount validity
    if (expense.amount < 0) {
      issues.push(`Expense ${index + 1}: Negative amount (${expense.amount})`);
    }

    // Collect data for summary
    if (expense.type) categories.add(expense.type);
    if (expense.date) dates.push(expense.date);
    if (typeof expense.amount === 'number') totalAmount += expense.amount;
  });

  // Check for duplicate IDs
  const ids = expenses.map(exp => exp.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    issues.push(`Duplicate IDs found: ${duplicateIds.join(', ')}`);
  }

  // Sort dates for range calculation
  dates.sort();
  const dateRanges = {
    earliest: dates[0] || '',
    latest: dates[dates.length - 1] || ''
  };

  return {
    isValid: issues.length === 0,
    issues,
    summary: {
      totalExpenses: expenses.length,
      totalAmount,
      categories: Array.from(categories),
      dateRanges
    }
  };
};

export const validateCategoryData = (categories: ExpenseCategory[]): DataValidationResult => {
  const issues: string[] = [];
  const categoryNames = new Set<string>();

  categories.forEach((category, index) => {
    // Check required fields
    if (!category.id) issues.push(`Category ${index + 1}: Missing ID`);
    if (!category.name) issues.push(`Category ${index + 1}: Missing name`);
    if (!category.description) issues.push(`Category ${index + 1}: Missing description`);
    if (category.budget !== null && typeof category.budget !== 'number') {
      issues.push(`Category ${index + 1}: Invalid budget type`);
    }

    // Check for duplicate names
    if (category.name) {
      if (categoryNames.has(category.name)) {
        issues.push(`Duplicate category name: ${category.name}`);
      }
      categoryNames.add(category.name);
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
    summary: {
      totalExpenses: categories.length,
      totalAmount: categories.reduce((sum, cat) => sum + (cat.budget || 0), 0),
      categories: Array.from(categoryNames),
      dateRanges: { earliest: '', latest: '' }
    }
  };
};

export const logDataValidation = (expenses: ExpenseEntry[], categories: ExpenseCategory[]) => {
  console.log('=== DATA VALIDATION ===');
  
  const expenseValidation = validateExpenseData(expenses);
  const categoryValidation = validateCategoryData(categories);

  console.log('Expense Data Validation:', expenseValidation);
  console.log('Category Data Validation:', categoryValidation);

  if (!expenseValidation.isValid) {
    console.error('Expense data issues:', expenseValidation.issues);
  }

  if (!categoryValidation.isValid) {
    console.error('Category data issues:', categoryValidation.issues);
  }

  return {
    expenses: expenseValidation,
    categories: categoryValidation
  };
};
