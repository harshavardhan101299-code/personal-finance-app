import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ExpenseTracker from './components/ExpenseTracker';
import BudgetManager from './components/BudgetManager';
import DataUpload from './components/DataUpload';
import { ExpenseEntry, ExpenseCategory } from './types';
import { expenseCategories, allExpenses } from './data/sampleData';

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
  const [selectedMonth, setSelectedMonth] = useState("2024-08");
  
  // Load expenses from localStorage on app start, or use sample data if empty
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : allExpenses;
  });
  
  const [categories, setCategories] = useState<ExpenseCategory[]>(expenseCategories);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Listen for localStorage changes from quick-add page
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'expenses' && e.newValue) {
        try {
          const newExpenses = JSON.parse(e.newValue);
          setExpenses(newExpenses);
        } catch (error) {
          console.error('Error parsing expenses from localStorage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for localStorage changes on focus (for same-tab updates)
    const handleFocus = () => {
      const saved = localStorage.getItem('expenses');
      if (saved) {
        try {
          const newExpenses = JSON.parse(saved);
          setExpenses(prevExpenses => {
            // Only update if the data is actually different
            if (JSON.stringify(prevExpenses) !== saved) {
              return newExpenses;
            }
            return prevExpenses;
          });
        } catch (error) {
          console.error('Error parsing expenses from localStorage:', error);
        }
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleDataUpload = (uploadedExpenses: ExpenseEntry[], uploadedCategories: ExpenseCategory[]) => {
    setExpenses(uploadedExpenses);
    
    // Merge uploaded categories with existing budget categories
    const mergedCategories = [...expenseCategories]; // Start with original categories that have budgets
    
    // Add new categories from uploaded data, but preserve existing budgets
    uploadedCategories.forEach(uploadedCat => {
      const existingCat = mergedCategories.find(cat => cat.name.toLowerCase() === uploadedCat.name.toLowerCase());
      if (!existingCat) {
        // Add new category with null budget
        mergedCategories.push(uploadedCat);
      }
      // If category exists, keep the existing budget
    });
    
    setCategories(mergedCategories);
    // Switch to Dashboard tab to show the uploaded data
    setCurrentTab(0);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 0:
        return <Dashboard expenses={expenses} categories={categories} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />;
      case 1:
        return <ExpenseTracker expenses={expenses} setExpenses={setExpenses} categories={categories} />;
      case 2:
        return <BudgetManager expenses={expenses} categories={categories} setCategories={setCategories} selectedMonth={selectedMonth} />;
      case 3:
        return <DataUpload onDataUpload={handleDataUpload} existingExpenses={expenses} />;
      default:
        return <Dashboard expenses={expenses} categories={categories} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />;
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
