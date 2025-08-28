import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ExpenseTracker from './components/ExpenseTracker';
import BudgetManager from './components/BudgetManager';
import DataUpload from './components/DataUpload';
import { ExpenseEntry, ExpenseCategory } from './types';
import { expenseCategories, allExpenses } from './data/sampleData';
import { logDataValidation } from './utils/dataValidation';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Navy blue
      light: '#534bae',
      dark: '#000051',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6f00', // Orange accent
      light: '#ffa040',
      dark: '#c43e00',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a237e',
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: '#1a237e',
      fontWeight: 600,
    },
    h2: {
      color: '#1a237e',
      fontWeight: 600,
    },
    h3: {
      color: '#1a237e',
      fontWeight: 600,
    },
    h4: {
      color: '#1a237e',
      fontWeight: 600,
    },
    h5: {
      color: '#1a237e',
      fontWeight: 600,
    },
    h6: {
      color: '#1a237e',
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(26, 35, 126, 0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(26, 35, 126, 0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a237e',
          boxShadow: '0 2px 8px rgba(26, 35, 126, 0.2)',
        },
      },
    },
  },
});

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('2025-08');
  
  // Robust expense management with localStorage sync
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(() => {
    try {
      const saved = localStorage.getItem('expenses');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Loaded expenses from localStorage:', parsed.length);
        // Validate loaded data
        logDataValidation(parsed, expenseCategories);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading expenses from localStorage:', error);
    }
    console.log('Using default expenses:', allExpenses.length);
    // Validate default data
    logDataValidation(allExpenses, expenseCategories);
    return allExpenses;
  });
  
  const [categories, setCategories] = useState<ExpenseCategory[]>(expenseCategories);

  // Robust expense update function
  const updateExpenses = useCallback((newExpenses: ExpenseEntry[]) => {
    console.log('Updating expenses:', newExpenses.length);
    
    // Validate data before updating
    const validation = logDataValidation(newExpenses, categories);
    if (!validation.expenses.isValid) {
      console.error('Data validation failed, but continuing with update');
    }
    
    setExpenses(newExpenses);
    try {
      localStorage.setItem('expenses', JSON.stringify(newExpenses));
      console.log('Saved to localStorage successfully');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [categories]);

  // Add single expense function
  const addExpense = useCallback((expense: ExpenseEntry) => {
    console.log('Adding expense:', expense);
    updateExpenses([...expenses, expense]);
  }, [expenses, updateExpenses]);

  // Update expense function
  const updateExpense = useCallback((updatedExpense: ExpenseEntry) => {
    console.log('Updating expense:', updatedExpense);
    const newExpenses = expenses.map(exp => 
      exp.id === updatedExpense.id ? updatedExpense : exp
    );
    updateExpenses(newExpenses);
  }, [expenses, updateExpenses]);

  // Delete expense function
  const deleteExpense = useCallback((expenseId: string) => {
    console.log('Deleting expense:', expenseId);
    const newExpenses = expenses.filter(exp => exp.id !== expenseId);
    updateExpenses(newExpenses);
  }, [expenses, updateExpenses]);

  // Refresh function for Dashboard
  const refreshData = useCallback(() => {
    console.log('Manual refresh triggered');
    try {
      const saved = localStorage.getItem('expenses');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Refreshed expenses:', parsed.length);
        setExpenses(parsed);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, []);

  // Auto-refresh every 3 seconds to catch quick-add updates
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem('expenses');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.length !== expenses.length) {
            console.log('Auto-refresh: detected change in localStorage');
            setExpenses(parsed);
          }
        }
      } catch (error) {
        console.error('Error in auto-refresh:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [expenses.length]);

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'expenses' && e.newValue) {
        try {
          const newExpenses = JSON.parse(e.newValue);
          console.log('Storage event: updating expenses:', newExpenses.length);
          setExpenses(newExpenses);
        } catch (error) {
          console.error('Error parsing storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDataUpload = (uploadedExpenses: ExpenseEntry[], uploadedCategories: ExpenseCategory[]) => {
    console.log('Data upload: merging expenses');
    const mergedExpenses = [...expenses, ...uploadedExpenses];
    updateExpenses(mergedExpenses);
    
    // Merge categories
    const mergedCategories = [...expenseCategories];
    uploadedCategories.forEach(uploadedCat => {
      const existingCat = mergedCategories.find(cat => cat.name.toLowerCase() === uploadedCat.name.toLowerCase());
      if (!existingCat) {
        mergedCategories.push(uploadedCat);
      }
    });
    
    setCategories(mergedCategories);
    setCurrentTab(0); // Switch to Dashboard
  };

  const renderContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <Dashboard 
            expenses={expenses} 
            categories={categories} 
            selectedMonth={selectedMonth} 
            setSelectedMonth={setSelectedMonth} 
            onRefresh={refreshData}
          />
        );
      case 1:
        return (
          <ExpenseTracker 
            expenses={expenses} 
            setExpenses={setExpenses} 
            categories={categories} 
          />
        );
      case 2:
        return (
          <BudgetManager 
            expenses={expenses} 
            categories={categories} 
            setCategories={setCategories} 
            selectedMonth={selectedMonth} 
          />
        );
      case 3:
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
          />
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
        <Box sx={{ pt: 2, pb: 4 }}>
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
