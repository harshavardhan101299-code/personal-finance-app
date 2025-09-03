export interface ExpenseCategory {
  id?: string;
  name: string;
  description?: string;
  budget: number | null; // null for categories like Housing and Miscellaneous
  color?: string; // Optional color for UI display
  icon?: string; // Material-UI icon name
}

export interface IncomeCategory {
  id?: string;
  name: string;
  description?: string;
  color?: string; // Optional color for UI display
  icon?: string; // Material-UI icon name
}

export interface ExpenseEntry {
  id: string;
  date: string;
  type: string;
  description: string;
  paidBy: string;
  amount: number;
  tags?: string[]; // For better categorization
  receipt?: string; // URL to receipt image
  recurring?: boolean; // For recurring expenses
  isIncome?: boolean; // Flag to distinguish between income and expenses
}

export interface MonthlyExpense {
  category: string;
  amount: number;
}

export interface BudgetStatus {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
}

// New interfaces for enhanced features
export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'savings' | 'investment' | 'purchase' | 'debt-payoff';
  description?: string;
  color?: string;
  icon?: string;
}

export interface Investment {
  id: string;
  name: string;
  type: 'stocks' | 'mutual-funds' | 'bonds' | 'crypto' | 'real-estate' | 'other';
  amount: number;
  currentValue: number;
  purchaseDate: string;
  description?: string;
  platform?: string; // Where it's held
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  reminderDays?: number; // Days before due date to remind
}

export interface AnalyticsData {
  monthlyTrends: {
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }[];
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  spendingPatterns: {
    dayOfWeek: string;
    averageAmount: number;
  }[];
}

// Enhanced data upload interfaces
export interface UploadedData {
  expenses: ExpenseEntry[];
  categories: ExpenseCategory[];
  goals?: FinancialGoal[];
  investments?: Investment[];
  bills?: Bill[];
  message: string;
  success: boolean;
}

export interface MonthlyData {
  [month: string]: ExpenseEntry[];
}

export interface CSVRow {
  Date?: string;
  date?: string;
  Type?: string;
  type?: string;
  Description?: string;
  description?: string;
  Amount?: string;
  amount?: string;
  Category?: string;
  category?: string;
  PaidBy?: string;
  paidBy?: string;
  [key: string]: string | undefined; // Allow any string key
}

// New interface for enhanced dashboard metrics
export interface DashboardMetrics {
  totalExpenses: number;
  totalIncome: number;
  netSavings: number;
  budgetUtilization: number;
  topSpendingCategories: Array<{category: string; amount: number}>;
  recentTransactions: ExpenseEntry[];
  upcomingBills: Bill[];
  goalProgress: FinancialGoal[];
}
