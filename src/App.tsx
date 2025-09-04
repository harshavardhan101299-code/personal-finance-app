import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ExpenseTracker from './components/ExpenseTracker';
import IncomeTracker from './components/IncomeTracker';
import BudgetManager from './components/BudgetManager';
import FinancialGoals from './components/FinancialGoals';
import BillManager from './components/BillManager';
import DataUpload from './components/DataUpload';
import Login from './components/Login';
import { ExpenseEntry, ExpenseCategory, FinancialGoal, Bill, Investment, IncomeCategory } from './types';
import { expenseCategories, allIncome, allInvestments, incomeCategories } from './data/sampleData';
import { logDataValidation } from './utils/dataValidation';
import { UserDataStorage } from './utils/userDataStorage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E3A8A', // Deep Blue - Brand Color
      light: '#3B82F6',
      dark: '#1E40AF',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F97316', // Bright Orange - Accent Color
      light: '#FB923C',
      dark: '#EA580C',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F9FAFB', // Very Light Gray
      paper: '#ffffff',
    },
    text: {
      primary: '#1E3A8A', // Deep Blue for headings
      secondary: '#6B7280', // Neutral Gray for supporting text
    },
    success: {
      main: '#10B981', // Green for positive/income
      light: '#34D399',
      dark: '#059669',
    },
    error: {
      main: '#EF4444', // Red for negative/expenses (use sparingly)
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B', // Amber for warnings
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#3B82F6', // Blue for info
      light: '#60A5FA',
      dark: '#2563EB',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: '#1E3A8A',
      fontWeight: 600,
    },
    h2: {
      color: '#1E3A8A',
      fontWeight: 600,
    },
    h3: {
      color: '#1E3A8A',
      fontWeight: 600,
    },
    h4: {
      color: '#1E3A8A',
      fontWeight: 600,
    },
    h5: {
      color: '#1E3A8A',
      fontWeight: 600,
    },
    h6: {
      color: '#1E3A8A',
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E3A8A',
          boxShadow: '0 4px 20px rgba(30, 58, 138, 0.15)',
        },
      },
    },
  },
});

function App() {
  const { user, isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('2025-08');
  
  // User-specific data storage
  const userStorage = user ? new UserDataStorage(user.id) : null;
  
  // Robust expense management with user-specific localStorage sync
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(() => {
    if (!userStorage) return [];
    
    try {
      const saved = userStorage.getExpenses();
      console.log('Loaded user expenses from localStorage:', saved.length);
      
      // Validate loaded data
      logDataValidation(saved, expenseCategories);
      return saved;
    } catch (error) {
      console.error('Error loading user expenses from localStorage:', error);
      return [];
    }
  });
  
  const [categories, setCategories] = useState<ExpenseCategory[]>(() => {
    if (!userStorage) return expenseCategories;
    const saved = userStorage.getCategories();
    return saved.length > 0 ? saved : expenseCategories;
  });
  const [incomeCategoriesList] = useState<IncomeCategory[]>(incomeCategories);

  // Financial Goals state management
  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    if (!userStorage) return [];
    return userStorage.getGoals();
  });

  // Bills state management
  const [bills, setBills] = useState<Bill[]>(() => {
    if (!userStorage) return [];
    return userStorage.getBills();
  });

  // Income state management
  const [income, setIncome] = useState<ExpenseEntry[]>(() => {
    if (!userStorage) return [];
    return userStorage.getIncome();
  });

  // Investment state management
  const [investments, setInvestments] = useState<Investment[]>(() => {
    if (!userStorage) return [];
    return userStorage.getInvestments();
  });

  // Robust expense update function
  const updateExpenses = useCallback((newExpenses: ExpenseEntry[]) => {
    console.log('Updating expenses:', newExpenses.length);
    
    // Validate data before updating
    const validation = logDataValidation(newExpenses, categories);
    if (!validation.expenses.isValid) {
      console.error('Data validation failed, but continuing with update');
    }
    
    setExpenses(newExpenses);
    if (userStorage) {
      try {
        userStorage.setExpenses(newExpenses);
        console.log('Saved to user localStorage successfully');
      } catch (error) {
        console.error('Error saving to user localStorage:', error);
      }
    }
  }, [categories, userStorage]);



  // Save goals to user localStorage when they change
  useEffect(() => {
    if (userStorage) {
      try {
        userStorage.setGoals(goals);
      } catch (error) {
        console.error('Error saving goals to user localStorage:', error);
      }
    }
  }, [goals, userStorage]);

  // Save bills to user localStorage when they change
  useEffect(() => {
    if (userStorage) {
      try {
        userStorage.setBills(bills);
      } catch (error) {
        console.error('Error saving bills to user localStorage:', error);
      }
    }
  }, [bills, userStorage]);

  // Save income to user localStorage when it changes
  useEffect(() => {
    if (userStorage) {
      try {
        userStorage.setIncome(income);
      } catch (error) {
        console.error('Error saving income to user localStorage:', error);
      }
    }
  }, [income, userStorage]);

  // Save investments to user localStorage when they change
  useEffect(() => {
    if (userStorage) {
      try {
        userStorage.setInvestments(investments);
      } catch (error) {
        console.error('Error saving investments to user localStorage:', error);
      }
    }
  }, [investments, userStorage]);

  // Refresh function for Dashboard
  const refreshData = useCallback(() => {
    console.log('Manual refresh triggered');
    if (userStorage) {
      try {
        const saved = userStorage.getExpenses();
        console.log('Refreshed user expenses:', saved.length);
        setExpenses(saved);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  }, [userStorage]);

  // Auto-refresh every 3 seconds to catch quick-add updates
  useEffect(() => {
    if (!userStorage) return;
    
    const interval = setInterval(() => {
      try {
        const saved = userStorage.getExpenses();
        // Only update if we have more expenses (new additions) or if the data is different
        const currentIds = new Set(expenses.map((exp: ExpenseEntry) => exp.id));
        
        // Check if there are new expenses (additions)
        const hasNewExpenses = saved.some((exp: ExpenseEntry) => !currentIds.has(exp.id));
        
        if (hasNewExpenses) {
          console.log('Auto-refresh: detected new expenses in user localStorage');
          setExpenses(saved);
        }
      } catch (error) {
        console.error('Error in auto-refresh:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [expenses, userStorage]);

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    if (!userStorage) return;
    
    const handleStorageChange = (e: StorageEvent) => {
      const userExpensesKey = userStorage.getKey('expenses');
      if (e.key === userExpensesKey && e.newValue) {
        try {
          const newExpenses = JSON.parse(e.newValue);
          console.log('Storage event: updating user expenses:', newExpenses.length);
          setExpenses(newExpenses);
        } catch (error) {
          console.error('Error parsing storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userStorage]);

  const handleDataUpload = (uploadedExpenses: ExpenseEntry[], uploadedCategories: ExpenseCategory[]) => {
    console.log('Data upload: merging expenses');
    const mergedExpenses = [...expenses, ...uploadedExpenses];
    updateExpenses(mergedExpenses);
    
    // Merge categories
    const mergedCategories = [...categories];
    uploadedCategories.forEach(uploadedCat => {
      const existingCat = mergedCategories.find(cat => cat.name.toLowerCase() === uploadedCat.name.toLowerCase());
      if (!existingCat) {
        mergedCategories.push(uploadedCat);
      }
    });
    
    setCategories(mergedCategories);
    if (userStorage) {
      userStorage.setCategories(mergedCategories);
    }
    setCurrentTab(0); // Switch to Dashboard
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return <Login onLogin={() => {}} />;
    }

    switch (currentTab) {
      case 0:
        return (
          <Dashboard 
            expenses={expenses} 
            categories={categories} 
            selectedMonth={selectedMonth} 
            setSelectedMonth={setSelectedMonth} 
            onRefresh={refreshData}
            goals={goals}
            bills={bills}
            incomeData={income}
            investments={investments}
            incomeCategories={incomeCategoriesList}
          />
        );
      case 1:
        return (
          <ExpenseTracker 
            expenses={expenses} 
            setExpenses={updateExpenses} 
            categories={categories} 
          />
        );
      case 2:
        return (
          <IncomeTracker 
            income={income} 
            setIncome={setIncome} 
            categories={incomeCategoriesList} 
          />
        );
      case 3:
        return (
          <BudgetManager 
            expenses={expenses} 
            categories={categories} 
            setCategories={setCategories} 
            selectedMonth={selectedMonth} 
          />
        );
      case 4:
        return (
          <FinancialGoals 
            goals={goals} 
            setGoals={setGoals} 
          />
        );
      case 5:
        return (
          <BillManager 
            bills={bills} 
            setBills={setBills} 
          />
        );
      case 6:
        return (
          <DataUpload 
            onDataUpload={handleDataUpload} 
            existingExpenses={expenses} 
          />
        );
      default:
        return (
          <Dashboard 
            expenses={expenses} 
            categories={categories} 
            selectedMonth={selectedMonth} 
            setSelectedMonth={setSelectedMonth} 
            onRefresh={refreshData}
            goals={goals}
            bills={bills}
            incomeData={income}
            investments={investments}
            incomeCategories={incomeCategoriesList}
          />
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
        {isAuthenticated && (
          <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
        )}
        <Box sx={{ pt: 2, pb: 4 }}>
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const AppWrapper: React.FC = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWrapper;
