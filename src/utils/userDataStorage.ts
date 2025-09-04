import { ExpenseEntry, ExpenseCategory, FinancialGoal, Bill, Investment } from '../types';

export class UserDataStorage {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  getKey(key: string): string {
    return `${this.userId}_${key}`;
  }

  // Expenses
  getExpenses(): ExpenseEntry[] {
    try {
      const saved = localStorage.getItem(this.getKey('expenses'));
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading expenses:', error);
      return [];
    }
  }

  setExpenses(expenses: ExpenseEntry[]): void {
    try {
      localStorage.setItem(this.getKey('expenses'), JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  }

  // Income
  getIncome(): ExpenseEntry[] {
    try {
      const saved = localStorage.getItem(this.getKey('income'));
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading income:', error);
      return [];
    }
  }

  setIncome(income: ExpenseEntry[]): void {
    try {
      localStorage.setItem(this.getKey('income'), JSON.stringify(income));
    } catch (error) {
      console.error('Error saving income:', error);
    }
  }

  // Categories
  getCategories(): ExpenseCategory[] {
    try {
      const saved = localStorage.getItem(this.getKey('categories'));
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }

  setCategories(categories: ExpenseCategory[]): void {
    try {
      localStorage.setItem(this.getKey('categories'), JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }

  // Financial Goals
  getGoals(): FinancialGoal[] {
    try {
      const saved = localStorage.getItem(this.getKey('financialGoals'));
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading goals:', error);
      return [];
    }
  }

  setGoals(goals: FinancialGoal[]): void {
    try {
      localStorage.setItem(this.getKey('financialGoals'), JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  }

  // Bills
  getBills(): Bill[] {
    try {
      const saved = localStorage.getItem(this.getKey('bills'));
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading bills:', error);
    }
    return [];
  }

  setBills(bills: Bill[]): void {
    try {
      localStorage.setItem(this.getKey('bills'), JSON.stringify(bills));
    } catch (error) {
      console.error('Error saving bills:', error);
    }
  }

  // Investments
  getInvestments(): Investment[] {
    try {
      const saved = localStorage.getItem(this.getKey('investments'));
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading investments:', error);
      return [];
    }
  }

  setInvestments(investments: Investment[]): void {
    try {
      localStorage.setItem(this.getKey('investments'), JSON.stringify(investments));
    } catch (error) {
      console.error('Error saving investments:', error);
    }
  }

  // Clear all user data
  clearAllData(): void {
    try {
      localStorage.removeItem(this.getKey('expenses'));
      localStorage.removeItem(this.getKey('income'));
      localStorage.removeItem(this.getKey('categories'));
      localStorage.removeItem(this.getKey('financialGoals'));
      localStorage.removeItem(this.getKey('bills'));
      localStorage.removeItem(this.getKey('investments'));
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  // Get storage usage info
  getStorageInfo(): { used: number; available: number } {
    try {
      const used = JSON.stringify(localStorage).length;
      const available = 5 * 1024 * 1024; // 5MB typical localStorage limit
      return { used, available };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { used: 0, available: 0 };
    }
  }
}
