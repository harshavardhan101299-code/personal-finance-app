import { ExpenseEntry, ExpenseCategory, FinancialGoal, Bill, Investment } from '../types';
import { CloudStorageService, CloudData } from '../services/cloudStorageService';

export class UserDataStorage {
  private userId: string;
  private cloudSyncEnabled: boolean = false;

  constructor(userId: string) {
    this.userId = userId;
    this.checkCloudSyncAvailability();
  }

  private async checkCloudSyncAvailability(): Promise<void> {
    this.cloudSyncEnabled = CloudStorageService.isAvailable();
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

  // Cloud sync methods
  async syncToCloud(): Promise<boolean> {
    if (!this.cloudSyncEnabled) {
      console.log('Cloud sync not available');
      return false;
    }

    try {
      const cloudData: CloudData = {
        expenses: this.getExpenses(),
        income: this.getIncome(),
        categories: this.getCategories(),
        goals: this.getGoals(),
        bills: this.getBills(),
        investments: this.getInvestments(),
        lastSync: new Date().toISOString(),
        version: 1,
      };

      await CloudStorageService.uploadData(cloudData);
      console.log('Data synced to cloud successfully');
      return true;
    } catch (error) {
      console.error('Error syncing to cloud:', error);
      return false;
    }
  }

  async syncFromCloud(): Promise<boolean> {
    if (!this.cloudSyncEnabled) {
      console.log('Cloud sync not available');
      return false;
    }

    try {
      const cloudData = await CloudStorageService.downloadData();
      if (!cloudData) {
        console.log('No cloud data found');
        return false;
      }

      // Get current local data
      const localData: CloudData = {
        expenses: this.getExpenses(),
        income: this.getIncome(),
        categories: this.getCategories(),
        goals: this.getGoals(),
        bills: this.getBills(),
        investments: this.getInvestments(),
        lastSync: new Date().toISOString(),
        version: 1,
      };

      // Merge data (cloud takes precedence if newer)
      const mergedData = CloudStorageService.mergeData(localData, cloudData);

      // Update local storage with merged data
      this.setExpenses(mergedData.expenses);
      this.setIncome(mergedData.income);
      this.setCategories(mergedData.categories);
      this.setGoals(mergedData.goals);
      this.setBills(mergedData.bills);
      this.setInvestments(mergedData.investments);

      console.log('Data synced from cloud successfully');
      return true;
    } catch (error) {
      console.error('Error syncing from cloud:', error);
      return false;
    }
  }

  async fullSync(): Promise<boolean> {
    if (!this.cloudSyncEnabled) {
      console.log('Cloud sync not available');
      return false;
    }

    try {
      // First try to sync from cloud
      const syncedFromCloud = await this.syncFromCloud();
      
      // Then sync to cloud (this will upload the merged data)
      const syncedToCloud = await this.syncToCloud();
      
      return syncedFromCloud || syncedToCloud;
    } catch (error) {
      console.error('Error during full sync:', error);
      return false;
    }
  }

  isCloudSyncEnabled(): boolean {
    return this.cloudSyncEnabled;
  }

  // Override setter methods to auto-sync to cloud
  setExpensesWithSync(expenses: ExpenseEntry[]): void {
    this.setExpenses(expenses);
    if (this.cloudSyncEnabled) {
      this.syncToCloud().catch(error => 
        console.error('Auto-sync to cloud failed:', error)
      );
    }
  }

  setIncomeWithSync(income: ExpenseEntry[]): void {
    this.setIncome(income);
    if (this.cloudSyncEnabled) {
      this.syncToCloud().catch(error => 
        console.error('Auto-sync to cloud failed:', error)
      );
    }
  }

  setCategoriesWithSync(categories: ExpenseCategory[]): void {
    this.setCategories(categories);
    if (this.cloudSyncEnabled) {
      this.syncToCloud().catch(error => 
        console.error('Auto-sync to cloud failed:', error)
      );
    }
  }

  setGoalsWithSync(goals: FinancialGoal[]): void {
    this.setGoals(goals);
    if (this.cloudSyncEnabled) {
      this.syncToCloud().catch(error => 
        console.error('Auto-sync to cloud failed:', error)
      );
    }
  }

  setBillsWithSync(bills: Bill[]): void {
    this.setBills(bills);
    if (this.cloudSyncEnabled) {
      this.syncToCloud().catch(error => 
        console.error('Auto-sync to cloud failed:', error)
      );
    }
  }

  setInvestmentsWithSync(investments: Investment[]): void {
    this.setInvestments(investments);
    if (this.cloudSyncEnabled) {
      this.syncToCloud().catch(error => 
        console.error('Auto-sync to cloud failed:', error)
      );
    }
  }
}
