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
import { format, parseISO } from 'date-fns';
import { ExpenseEntry, IncomeCategory } from '../types';

interface IncomeTrackerProps {
  income: ExpenseEntry[];
  setIncome: (income: ExpenseEntry[]) => void;
  categories: IncomeCategory[];
}

const IncomeTracker: React.FC<IncomeTrackerProps> = ({ income, setIncome, categories }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIncome, setEditingIncome] = useState<ExpenseEntry | null>(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: '',
    description: '',
    receivedFrom: 'Company',
    amount: ''
  });

  const handleOpenDialog = (incomeEntry?: ExpenseEntry) => {
    if (incomeEntry) {
      setEditingIncome(incomeEntry);
      setFormData({
        date: incomeEntry.date,
        type: incomeEntry.type,
        description: incomeEntry.description,
        receivedFrom: incomeEntry.paidBy,
        amount: incomeEntry.amount.toString()
      });
    } else {
      setEditingIncome(null);
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        type: '',
        description: '',
        receivedFrom: 'Company',
        amount: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIncome(null);
  };

  const handleSubmit = () => {
    if (!formData.type || !formData.description || !formData.amount) {
      return;
    }

    const newIncome: ExpenseEntry = {
      id: editingIncome?.id || `income-${Date.now()}`,
      date: formData.date,
      type: formData.type,
      description: formData.description,
      paidBy: formData.receivedFrom,
      amount: parseFloat(formData.amount),
      isIncome: true
    };

    if (editingIncome) {
      const updatedIncome = income.map(inc => inc.id === editingIncome.id ? newIncome : inc);
      setIncome(updatedIncome);
    } else {
      const updatedIncome = [...income, newIncome];
      setIncome(updatedIncome);
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    const updatedIncome = income.filter(inc => inc.id !== id);
    setIncome(updatedIncome);
  };

  const totalAmount = income.reduce((sum, incomeEntry) => sum + incomeEntry.amount, 0);

  return (
    <Box sx={{
      minWidth: 250, width: '100%', py: 4, px: { xs: 2, sm: 3, md: 4 }
    }}>
      <Box sx={{
        minWidth: 250, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            minWidth: 250, fontWeight: 700, color: '#2ECC71'
          }}
        >
          Income Tracker
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            minWidth: 250,
            backgroundColor: '#2ECC71',
            '&:hover': {
              backgroundColor: '#27AE60',
            },
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600
          }}
        >
          Add Income
        </Button>
      </Box>

      {/* Summary */}
      <Paper sx={{
        minWidth: 250, p: 4, mb: 4
      }}>
        <Typography variant="h6" gutterBottom sx={{
          minWidth: 250, fontWeight: 600, mb: 2, color: '#2ECC71'
        }}>
          Summary
        </Typography>
        <Box sx={{
          minWidth: 250, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center'
        }}>
          <Chip 
            label={`Total Income: ₹${totalAmount.toLocaleString()}`} 
            color="primary"
            sx={{
              minWidth: 250, 
              backgroundColor: '#2ECC71',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              px: 2,
              py: 1
            }}
          />
          <Chip 
            label={`Total Transactions: ${income.length}`} 
            color="secondary"
            sx={{
              minWidth: 250, 
              backgroundColor: '#9B59B6',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              px: 2,
              py: 1
            }}
          />
        </Box>
      </Paper>

      {/* Income Table */}
      <Paper sx={{
        minWidth: 250, p: 4
      }}>
        <Typography variant="h6" gutterBottom sx={{
          minWidth: 250, fontWeight: 600, mb: 3, color: '#2ECC71'
        }}>
          All Income
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{
                minWidth: 250, backgroundColor: '#f5f5f5'
              }}>
                <TableCell sx={{
                  minWidth: 250, fontWeight: 600, color: '#2ECC71'
                }}>Date</TableCell>
                <TableCell sx={{
                  minWidth: 250, fontWeight: 600, color: '#2ECC71'
                }}>Category</TableCell>
                <TableCell sx={{
                  minWidth: 250, fontWeight: 600, color: '#2ECC71'
                }}>Description</TableCell>
                <TableCell sx={{
                  minWidth: 250, fontWeight: 600, color: '#2ECC71'
                }}>Received From</TableCell>
                <TableCell align="right" sx={{
                  minWidth: 250, fontWeight: 600, color: '#2ECC71'
                }}>Amount</TableCell>
                <TableCell sx={{
                  minWidth: 250, fontWeight: 600, color: '#2ECC71'
                }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {income.map((incomeEntry) => (
                <TableRow key={incomeEntry.id} sx={{
                  minWidth: 250, '&:hover': { backgroundColor: '#f8f9fa' }
                }}>
                  <TableCell sx={{
                    minWidth: 250, fontWeight: 500
                  }}>
                    {format(parseISO(incomeEntry.date), 'dd-MMM')}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={incomeEntry.type} 
                      size="small" 
                      sx={{
                        minWidth: 250, 
                        backgroundColor: '#2ECC71',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{
                    minWidth: 250, fontWeight: 500
                  }}>{incomeEntry.description}</TableCell>
                  <TableCell sx={{
                    minWidth: 250, fontWeight: 500
                  }}>{incomeEntry.paidBy}</TableCell>
                  <TableCell align="right" sx={{
                    minWidth: 250, fontWeight: 600, color: '#2ECC71'
                  }}>
                    ₹{incomeEntry.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog(incomeEntry)}
                      sx={{
                        minWidth: 250, 
                        color: '#2ECC71',
                        '&:hover': { backgroundColor: 'rgba(46, 204, 113, 0.1)' }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(incomeEntry.id)}
                      sx={{
                        minWidth: 250, 
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

      {/* Add/Edit Income Dialog */}
      <Dialog maxWidth="sm" fullWidth 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(46, 204, 113, 0.2)'
          }
        }}
      >
        <DialogTitle sx={{
          minWidth: 250, 
          backgroundColor: '#2ECC71', 
          color: 'white',
          fontWeight: 600
        }}>
          {editingIncome ? 'Edit Income' : 'Add New Income'}
        </DialogTitle>
        <DialogContent sx={{
          minWidth: 250, p: 4
        }}>
          <Box sx={{
            minWidth: 250, display: 'flex', flexDirection: 'column', gap: 3
          }}>
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2ECC71',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2ECC71',
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
                  minWidth: 250,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#2ECC71',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2ECC71',
                    },
                  },
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.name} value={category.name}>
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
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2ECC71',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2ECC71',
                  },
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Received From</InputLabel>
              <Select
                value={formData.receivedFrom}
                label="Received From"
                onChange={(e) => setFormData({ ...formData, receivedFrom: e.target.value })}
                sx={{
                  minWidth: 250,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#2ECC71',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2ECC71',
                    },
                  },
                }}
              >
                <MenuItem value="Company">Company</MenuItem>
                <MenuItem value="Gradvine">Gradvine</MenuItem>
                <MenuItem value="Family">Family</MenuItem>
                <MenuItem value="Raithu Bandu">Raithu Bandu</MenuItem>
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
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2ECC71',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2ECC71',
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{
          minWidth: 250, p: 3, gap: 2
        }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{
              minWidth: 250, 
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
              minWidth: 250,
              backgroundColor: '#2ECC71',
              '&:hover': {
                backgroundColor: '#27AE60',
              },
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            {editingIncome ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncomeTracker;
