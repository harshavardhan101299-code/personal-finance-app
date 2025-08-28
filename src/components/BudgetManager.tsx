import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  LinearProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { ExpenseCategory, ExpenseEntry } from '../types';

interface BudgetManagerProps {
  expenses: ExpenseEntry[];
  categories: ExpenseCategory[];
  setCategories: React.Dispatch<React.SetStateAction<ExpenseCategory[]>>;
  selectedMonth: string;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({ expenses, categories, setCategories, selectedMonth }) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    budget: ''
  });

  const handleEdit = (category: ExpenseCategory) => {
    setEditingCategory(category.id || null);
    setEditForm({
      name: category.name,
      description: category.description || '',
      budget: category.budget
    });
  };

  const handleSave = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat,
            name: editForm.name,
            description: editForm.description,
            budget: editForm.budget ? parseFloat(editForm.budget) : null
          }
        : cat
    ));
    setEditingCategory(null);
  };

  const handleCancel = () => {
    setEditingCategory(null);
  };

  // Filter expenses for the selected month
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const expenseYear = expenseDate.getFullYear();
      const expenseMonth = (expenseDate.getMonth() + 1).toString().padStart(2, '0');
      const expenseYearMonth = `${expenseYear}-${expenseMonth}`;
      
      return expenseYearMonth === selectedMonth;
    });
  }, [expenses, selectedMonth]);

  // Calculate current month expenses by category (only for selected month)
  const currentMonthExpenses = filteredExpenses.reduce((acc, expense) => {
    acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalBudget = categories
    .filter(cat => cat.budget !== null)
    .reduce((sum, cat) => sum + (cat.budget || 0), 0);

  const totalSpent = Object.values(currentMonthExpenses).reduce((sum, amount) => sum + amount, 0);

  // Get month name for display
  const getMonthName = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <Box sx={{ width: '100%', py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ fontWeight: 700, color: '#1a237e', mb: 4 }}
      >
        Budget Manager
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3, 
        mb: 4, 
        justifyContent: 'center' 
      }}>
        <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)'
 } }}>

          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom sx={{ fontSize: '1rem', fontWeight: 500 }}>
              Total Monthly Budget
            </Typography>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: '#1a237e' }}>
              ₹{totalBudget.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)'
 } }}>

          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom sx={{ fontSize: '1rem', fontWeight: 500 }}>
              Total Spent ({getMonthName(selectedMonth)})
            </Typography>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: '#1a237e' }}>
              ₹{totalSpent.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)'
 } }}>

          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom sx={{ fontSize: '1rem', fontWeight: 500 }}>
              Remaining Budget
            </Typography>
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                fontWeight: 700,
                color: totalBudget - totalSpent >= 0 ? '#4caf50' : '#f44336'
              }}
            >
              ₹{(totalBudget - totalSpent).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Budget Categories Table */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
          Budget Categories
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#1a237e' }}>Monthly Budget</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#1a237e' }}>Spent ({getMonthName(selectedMonth)})</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#1a237e' }}>Remaining</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Progress</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => {
                const spent = currentMonthExpenses[category.name] || 0;
                const remaining = (category.budget || 0) - spent;
                const percentage = category.budget ? (spent / category.budget) * 100 : 0;
                const isEditing = editingCategory === category.id;

                return (
                  <TableRow key={category.id} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          size="small"
                          fullWidth
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
                        />
                      ) : (
                        <Typography variant="body1" fontWeight="600" color="#1a237e">
                          {category.name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          size="small"
                          fullWidth
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
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {category.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {isEditing ? (
                        <TextField
                          value={editForm.budget}
                          onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                          size="small"
                          type="number"
                          InputProps={{
                            startAdornment: <span>₹</span>
                          }}
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
                        />
                      ) : (
                        <Typography sx={{ fontWeight: 600 }}>
                          {category.budget ? `₹${category.budget.toLocaleString()}` : '-'}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600 }}>
                        ₹{spent.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color={remaining >= 0 ? 'success.main' : 'error.main'}
                        sx={{ fontWeight: 600 }}
                      >
                        {category.budget ? `₹${remaining.toLocaleString()}` : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {category.budget ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(percentage, 100)}
                              color={percentage > 100 ? 'error' : 'primary'}
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
                              {percentage.toFixed(1)}%
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No budget set
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Box>
                          <IconButton 
                            size="small" 
                            onClick={() => handleSave(category.id || '')}
                            sx={{ 
                              color: '#4caf50',
                              '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' }
                            }}
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={handleCancel}
                            sx={{ 
                              color: '#f44336',
                              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                            }}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(category)}
                          sx={{ 
                            color: '#1a237e',
                            '&:hover': { backgroundColor: 'rgba(26, 35, 126, 0.1)' }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Budget Status Summary */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
          Budget Status Summary
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3, 
          justifyContent: 'center' 
        }}>
          {categories
            .filter(category => category.budget !== null)
            .map((category) => {
              const spent = currentMonthExpenses[category.name] || 0;
              const percentage = (spent / (category.budget || 1)) * 100;
              
              return (
                <Card key={category.id} variant="outlined" sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-2px)' }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      ₹{spent.toLocaleString()} / ₹{(category.budget || 0).toLocaleString()}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(percentage, 100)}
                      color={percentage > 100 ? 'error' : 'primary'}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        mb: 1
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {percentage.toFixed(1)}% used
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
        </Box>
      </Paper>
    </Box>
  );
};

export default BudgetManager;
