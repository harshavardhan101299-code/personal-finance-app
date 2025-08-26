export interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  budget: number | null; // null for categories like Housing and Miscellaneous
}

export interface ExpenseEntry {
  id: string;
  date: string;
  type: string;
  description: string;
  paidBy: string;
  amount: number;
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

// New interfaces for data upload
export interface UploadedData {
  expenses: ExpenseEntry[];
  categories: ExpenseCategory[];
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
  [key: string]: string | undefined; // Allow any string key
}
