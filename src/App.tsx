import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ExpenseTracker from './components/ExpenseTracker';
import IncomeTracker from './components/IncomeTracker';
import BudgetManager from './components/BudgetManager';
import FinancialGoals from './components/FinancialGoals';
import BillManager from './components/BillManager';
import DataUpload from './components/DataUpload';
import { ExpenseEntry, ExpenseCategory, FinancialGoal, Bill, Investment, IncomeCategory } from './types';
import { expenseCategories, allExpenses, allIncome, allInvestments, incomeCategories } from './data/sampleData';
import { logDataValidation } from './utils/dataValidation';

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
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('2025-08');
  
  // Robust expense management with localStorage sync
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(() => {
    try {
      const saved = localStorage.getItem('expenses');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Loaded expenses from localStorage:', parsed.length);
        
        // Check if we have the default data structure
        const hasDefaultData = parsed.some((exp: ExpenseEntry) => exp.id.startsWith('apr-') || exp.id.startsWith('may-') || exp.id.startsWith('jun-') || exp.id.startsWith('jul-') || exp.id.startsWith('aug-'));
        
        if (!hasDefaultData) {
          // If no default data, merge with default data
          const mergedExpenses = [...allExpenses, ...parsed];
          console.log('Merged default data with localStorage data:', mergedExpenses.length);
          localStorage.setItem('expenses', JSON.stringify(mergedExpenses));
          logDataValidation(mergedExpenses, expenseCategories);
          return mergedExpenses;
        }
        
        // Validate loaded data
        logDataValidation(parsed, expenseCategories);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading expenses from localStorage:', error);
    }
    
    console.log('Using default expenses:', allExpenses.length);
    // Validate default data and save to localStorage
    logDataValidation(allExpenses, expenseCategories);
    localStorage.setItem('expenses', JSON.stringify(allExpenses));
    return allExpenses;
  });
  
  const [categories, setCategories] = useState<ExpenseCategory[]>(expenseCategories);
  const [incomeCategoriesList] = useState<IncomeCategory[]>(incomeCategories);

  // Financial Goals state management
  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    try {
      const saved = localStorage.getItem('financialGoals');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading goals from localStorage:', error);
    }
    return [];
  });

  // Bills state management
  const [bills, setBills] = useState<Bill[]>(() => {
    try {
      const saved = localStorage.getItem('bills');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading bills from localStorage:', error);
    }
    return [];
  });

  // Income state management
  const [income, setIncome] = useState<ExpenseEntry[]>(() => {
    try {
      const saved = localStorage.getItem('income');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Loaded income from localStorage:', parsed.length);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading income from localStorage:', error);
    }
    
    console.log('Using default income:', allIncome.length);
    localStorage.setItem('income', JSON.stringify(allIncome));
    return allIncome;
  });

  // Investment state management
  const [investments, setInvestments] = useState<Investment[]>(() => {
    try {
      const saved = localStorage.getItem('investments');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Loaded investments from localStorage:', parsed.length);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading investments from localStorage:', error);
    }
    
    console.log('Using default investments:', allInvestments.length);
    localStorage.setItem('investments', JSON.stringify(allInvestments));
    return allInvestments;
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
    try {
      localStorage.setItem('expenses', JSON.stringify(newExpenses));
      console.log('Saved to localStorage successfully');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [categories]);



  // Save goals to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('financialGoals', JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals to localStorage:', error);
    }
  }, [goals]);

  // Save bills to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('bills', JSON.stringify(bills));
    } catch (error) {
      console.error('Error saving bills to localStorage:', error);
    }
  }, [bills]);

  // Save income to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('income', JSON.stringify(income));
    } catch (error) {
      console.error('Error saving income to localStorage:', error);
    }
  }, [income]);

  // Save investments to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('investments', JSON.stringify(investments));
    } catch (error) {
      console.error('Error saving investments to localStorage:', error);
    }
  }, [investments]);

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
          // Only update if we have more expenses (new additions) or if the data is different
          const currentIds = new Set(expenses.map((exp: ExpenseEntry) => exp.id));
          
          // Check if there are new expenses (additions)
          const hasNewExpenses = parsed.some((exp: ExpenseEntry) => !currentIds.has(exp.id));
          
          if (hasNewExpenses) {
            console.log('Auto-refresh: detected new expenses in localStorage');
            setExpenses(parsed);
          }
        }
      } catch (error) {
        console.error('Error in auto-refresh:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [expenses]);

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
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
        <Box sx={{ pt: 2, pb: 4 }}>
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
