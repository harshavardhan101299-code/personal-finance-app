import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ExpenseEntry, ExpenseCategory, BudgetStatus } from '../types';

interface DashboardProps {
  expenses: ExpenseEntry[];
  categories: ExpenseCategory[];
  selectedMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, categories, selectedMonth, setSelectedMonth }) => {

  // Filter expenses by selected month
  const filteredExpenses = useMemo(() => {
    console.log('Filtering expenses for month:', selectedMonth);
    console.log('All expenses:', expenses);
    console.log('Expenses length:', expenses.length);
    
    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const expenseYear = expenseDate.getFullYear();
      const expenseMonth = (expenseDate.getMonth() + 1).toString().padStart(2, '0');
      const expenseYearMonth = `${expenseYear}-${expenseMonth}`;
      
      console.log(`Expense: ${expense.date} -> ${expenseYearMonth}, matches ${selectedMonth}: ${expenseYearMonth === selectedMonth}`);
      
      return expenseYearMonth === selectedMonth;
    });
    
    console.log('Filtered expenses:', filtered);
    return filtered;
  }, [expenses, selectedMonth]);

  // Calculate monthly expenses by category for selected month
  const monthlyExpenses = useMemo(() => {
    const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(expensesByCategory)
      .map(([category, amount]) => ({
        category,
        amount
      }))
      .sort((a, b) => b.amount - a.amount); // Sort by amount descending
  }, [filteredExpenses]);

  // Calculate total expenses for selected month
  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  // Calculate budget status for selected month
  const budgetStatus = useMemo(() => {
    console.log('Calculating budget status for categories:', categories);
    console.log('Monthly expenses:', monthlyExpenses);
    
    const status = categories
      .filter(category => category.budget !== null)
      .map(category => {
        const spent = monthlyExpenses.find(exp => exp.category === category.name)?.amount || 0;
        const budget = category.budget!;
        const remaining = budget - spent;
        const percentage = (spent / budget) * 100;

        console.log(`Category: ${category.name}, Budget: ${budget}, Spent: ${spent}, Match: ${monthlyExpenses.find(exp => exp.category === category.name) ? 'YES' : 'NO'}`);

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

  console.log('Monthly Expenses Data:', monthlyExpenses); // Debug log

  return (
    <Box sx={{ width: '100%', py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        align="center" 
        sx={{ 
          mb: 4,
          fontWeight: 700,
          color: '#1a237e',
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
        }}
      >
        Harsha's Expenses
      </Typography>

      {/* Month Selection */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
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
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom sx={{ fontSize: '1rem', fontWeight: 500 }}>
              Total Expenses ({months.find(m => m.value === selectedMonth)?.label.split(' ')[0] || 'Selected Month'})
            </Typography>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: '#1a237e' }}>
              ₹{totalExpenses.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom sx={{ fontSize: '1rem', fontWeight: 500 }}>
              Total Budget
            </Typography>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: '#1a237e' }}>
              ₹{categories
                .filter(cat => cat.budget !== null)
                .reduce((sum, cat) => sum + (cat.budget || 0), 0)
                .toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom sx={{ fontSize: '1rem', fontWeight: 500 }}>
              Number of Transactions
            </Typography>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: '#1a237e' }}>
              {filteredExpenses.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Vertical Bar Chart */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
          Monthly Expenses by Category
        </Typography>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart 
            data={monthlyExpenses}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="category"
              stroke="#546e7a"
              tick={{ fontSize: 12, fill: '#1a237e' }}
            />
            <YAxis 
              tickFormatter={(value) => `₹${value.toLocaleString()}`}
              stroke="#546e7a"
            />
            <Tooltip 
              formatter={(value) => [`₹${value}`, 'Amount']}
              labelStyle={{ color: '#1a237e' }}
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: 8
              }}
            />
            <Bar 
              dataKey="amount" 
              fill="#1a237e"
            />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Budget Status */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
          Budget Status
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#1a237e' }}>Budget</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#1a237e' }}>Spent</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#1a237e' }}>Remaining</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgetStatus.map((status) => (
                <TableRow key={status.category} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                  <TableCell sx={{ fontWeight: 500 }}>{status.category}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500 }}>₹{status.budget.toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500 }}>₹{status.spent.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Typography
                      color={status.remaining >= 0 ? 'success.main' : 'error.main'}
                      sx={{ fontWeight: 600 }}
                    >
                      ₹{status.remaining.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(status.percentage, 100)}
                          color={status.percentage > 100 ? 'error' : 'primary'}
                          sx={{ 
                            height: 10, 
                            borderRadius: 5,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 45 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {status.percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
