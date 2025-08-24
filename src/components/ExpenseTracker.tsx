import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { ExpenseEntry, ExpenseCategory } from '../types';

interface ExpenseTrackerProps {
  expenses: ExpenseEntry[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseEntry[]>>;
  categories: ExpenseCategory[];
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ expenses, setExpenses, categories }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseEntry | null>(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: '',
    description: '',
    paidBy: 'Me',
    amount: ''
  });

  const handleOpenDialog = (expense?: ExpenseEntry) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        date: expense.date,
        type: expense.type,
        description: expense.description,
        paidBy: expense.paidBy,
        amount: expense.amount.toString()
      });
    } else {
      setEditingExpense(null);
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        type: '',
        description: '',
        paidBy: 'Me',
        amount: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingExpense(null);
  };

  const handleSubmit = () => {
    if (!formData.type || !formData.description || !formData.amount) {
      return;
    }

    const newExpense: ExpenseEntry = {
      id: editingExpense?.id || Date.now().toString(),
      date: formData.date,
      type: formData.type,
      description: formData.description,
      paidBy: formData.paidBy,
      amount: parseFloat(formData.amount)
    };

    if (editingExpense) {
      setExpenses(expenses.map(exp => exp.id === editingExpense.id ? newExpense : exp));
    } else {
      setExpenses([...expenses, newExpense]);
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Box sx={{ width: '100%', py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ fontWeight: 700, color: '#1a237e' }}
        >
          Expense Tracker
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: '#1a237e',
            '&:hover': {
              backgroundColor: '#000051',
            },
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600
          }}
        >
          Add Expense
        </Button>
      </Box>

      {/* Summary */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#1a237e' }}>
          Summary
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Chip 
            label={`Total Expenses: ₹${totalAmount.toLocaleString()}`} 
            color="primary"
            sx={{ 
              backgroundColor: '#1a237e',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              px: 2,
              py: 1
            }}
          />
          <Chip 
            label={`Total Transactions: ${expenses.length}`} 
            color="secondary"
            sx={{ 
              backgroundColor: '#ff6f00',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              px: 2,
              py: 1
            }}
          />
        </Box>
      </Paper>

      {/* Expenses Table */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
          All Expenses
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Paid By</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#1a237e' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {format(new Date(expense.date), 'dd-MMM')}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={expense.type} 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#1a237e',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{expense.description}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{expense.paidBy}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#1a237e' }}>
                    ₹{expense.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog(expense)}
                      sx={{ 
                        color: '#1a237e',
                        '&:hover': { backgroundColor: 'rgba(26, 35, 126, 0.1)' }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(expense.id)}
                      sx={{ 
                        color: '#f44336',
                        '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Expense Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(26, 35, 126, 0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#1a237e', 
          color: 'white',
          fontWeight: 600
        }}>
          {editingExpense ? 'Edit Expense' : 'Add New Expense'}
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
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
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.type}
                label="Category"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
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

            <FormControl fullWidth>
              <InputLabel>Paid By</InputLabel>
              <Select
                value={formData.paidBy}
                label="Paid By"
                onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
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
                <MenuItem value="Me">Me</MenuItem>
                <MenuItem value="Eshwar">Eshwar</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Amount (₹)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              fullWidth
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: '#546e7a',
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{
              backgroundColor: '#1a237e',
              '&:hover': {
                backgroundColor: '#000051',
              },
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            {editingExpense ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpenseTracker;
