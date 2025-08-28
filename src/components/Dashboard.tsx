import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ExpenseEntry, ExpenseCategory, BudgetStatus } from '../types';
import RefreshIcon from '@mui/icons-material/Refresh';

interface DashboardProps {
  expenses: ExpenseEntry[];
  categories: ExpenseCategory[];
  selectedMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
  onRefresh?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, categories, selectedMonth, setSelectedMonth, onRefresh }) => {

  // Debug logging for data analysis
  console.log('Dashboard received expenses:', expenses.length);
  console.log('Selected month:', selectedMonth);
  console.log('All expenses dates:', expenses.map(exp => exp.date).slice(0, 10));

  // Simple expense filtering by month (clean data format)
  const filteredExpenses = useMemo(() => {
    console.log('=== FILTERING EXPENSES ===');
    console.log('Total expenses to filter:', expenses.length);
    console.log('Selected month:', selectedMonth);
    
    const filtered = expenses.filter(expense => {
      // Simple YYYY-MM-DD format parsing
      const expenseYearMonth = expense.date.substring(0, 7); // Get YYYY-MM part
      const matches = expenseYearMonth === selectedMonth;
      
      console.log(`Expense: ${expense.date} -> ${expenseYearMonth}, matches ${selectedMonth}: ${matches}`);
      
      return matches;
    });
    
    console.log('Filtered expenses count:', filtered.length);
    console.log('Filtered expenses:', filtered.map(exp => `${exp.date}: ${exp.type} - ₹${exp.amount}`));
    
    return filtered;
  }, [expenses, selectedMonth]);

  // Calculate monthly expenses by category with detailed logging
  const monthlyExpenses = useMemo(() => {
    console.log('=== CALCULATING MONTHLY EXPENSES ===');
    
    const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
      const category = expense.type;
      acc[category] = (acc[category] || 0) + expense.amount;
      console.log(`Adding ${expense.type}: ₹${expense.amount} (total now: ₹${acc[category]})`);
      return acc;
    }, {} as Record<string, number>);

    const result = Object.entries(expensesByCategory)
      .map(([category, amount]) => ({
        category,
        amount
      }))
      .sort((a, b) => b.amount - a.amount);

    console.log('Monthly expenses by category:', result);
    return result;
  }, [filteredExpenses]);

  // Calculate total expenses with verification
  const totalExpenses = useMemo(() => {
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    console.log('Total expenses calculated:', total);
    console.log('Individual amounts:', filteredExpenses.map(exp => exp.amount));
    return total;
  }, [filteredExpenses]);

  // Calculate budget status with detailed logging
  const budgetStatus = useMemo(() => {
    console.log('=== CALCULATING BUDGET STATUS ===');
    console.log('Categories with budgets:', categories.filter(cat => cat.budget !== null).map(cat => cat.name));
    
    const status = categories
      .filter(category => category.budget !== null)
      .map(category => {
        const spent = monthlyExpenses.find(exp => exp.category === category.name)?.amount || 0;
        const budget = category.budget!;
        const remaining = budget - spent;
        const percentage = (spent / budget) * 100;

        console.log(`Category: ${category.name}, Budget: ${budget}, Spent: ${spent}, Percentage: ${percentage}%`);

        return {
          category: category.name,
          budget,
          spent,
          remaining,
          percentage
        };
      });
    
    console.log('Budget status result:', status);
    return status;
  }, [monthlyExpenses, categories]);

  const months = [
    { value: '2024-01', label: 'January 2024' },
    { value: '2024-02', label: 'February 2024' },
    { value: '2024-03', label: 'March 2024' },
    { value: '2024-04', label: 'April 2024' },
    { value: '2024-05', label: 'May 2024' },
    { value: '2024-06', label: 'June 2024' },
    { value: '2024-07', label: 'July 2024' },
    { value: '2024-08', label: 'August 2024' },
    { value: '2024-09', label: 'September 2024' },
    { value: '2024-10', label: 'October 2024' },
    { value: '2024-11', label: 'November 2024' },
    { value: '2024-12', label: 'December 2024' },
  ];

  console.log('=== DASHBOARD RENDER SUMMARY ===');
  console.log('Total expenses:', expenses.length);
  console.log('Filtered for', selectedMonth, ':', filteredExpenses.length);
  console.log('Categories with data:', monthlyExpenses.length);
  console.log('Total amount:', totalExpenses);

  return (
    <Box sx={{ width: '100%', py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Enhanced Debug Info */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#fff3e0' }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Debug Info:</strong> Total expenses: {expenses.length} | 
          Filtered for {selectedMonth}: {filteredExpenses.length} | 
          Categories with data: {monthlyExpenses.length} | 
          Total amount: ₹{totalExpenses.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>August Expenses:</strong> {filteredExpenses.map(exp => `${exp.type}: ₹${exp.amount}`).join(', ')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Expected Categories:</strong> Dining, Groceries, Personal Care, Subscriptions, Miscellaneous
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Expected Total:</strong> ₹42,831.46 (Dining: ₹6,426.02, Groceries: ₹1,188, Personal Care: ₹2,618, Subscriptions: ₹75, Miscellaneous: ₹32,524.44)
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            fontWeight: 700,
            color: '#1a237e',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Harsha's Expenses
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton onClick={onRefresh}>
            <RefreshIcon sx={{ color: '#1a237e' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Month Selection */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Month</InputLabel>
          <Select
            value={selectedMonth}
            label="Select Month"
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#1a237e',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1a237e',
                },
              },
            }}
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Expenses ({selectedMonth.split('-')[1] === '08' ? 'August' : 'Selected Month'})
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
              ₹{totalExpenses.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Budget
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
              ₹21,500
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Number of Transactions
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
              {filteredExpenses.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Charts and Budget Status */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
        {/* Monthly Expenses Chart */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
            Monthly Expenses by Category
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <RechartsTooltip 
                formatter={(value) => [`₹${value}`, 'Amount']}
                labelStyle={{ color: '#1a237e' }}
              />
              <Bar dataKey="amount" fill="#1a237e" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Budget Status */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
            Budget Status
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Category</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#1a237e' }}>Budget</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#1a237e' }}>Spent</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#1a237e' }}>Remaining</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {budgetStatus.map((status) => (
                  <TableRow key={status.category}>
                    <TableCell sx={{ fontWeight: 500 }}>{status.category}</TableCell>
                    <TableCell align="right">₹{status.budget.toLocaleString()}</TableCell>
                    <TableCell align="right">₹{status.spent.toLocaleString()}</TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ 
                        color: status.remaining >= 0 ? '#2e7d32' : '#d32f2f',
                        fontWeight: 600
                      }}
                    >
                      ₹{status.remaining.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(status.percentage, 100)} 
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: status.percentage > 100 ? '#d32f2f' : '#1a237e',
                                borderRadius: 4,
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ minWidth: 45, fontWeight: 600 }}>
                          {status.percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
