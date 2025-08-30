import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  LinearProgress,
  Chip,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  ShoppingCart as ShoppingCartIcon,
  CreditCard as CreditCardIcon,
  Savings as SavingsIcon
} from '@mui/icons-material';
import { format, parseISO, isAfter } from 'date-fns';
import { FinancialGoal } from '../types';

interface FinancialGoalsProps {
  goals: FinancialGoal[];
  setGoals: React.Dispatch<React.SetStateAction<FinancialGoal[]>>;
}

const FinancialGoals: React.FC<FinancialGoalsProps> = ({ goals, setGoals }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'savings' as 'savings' | 'investment' | 'purchase' | 'debt-payoff',
    description: ''
  });

  const handleOpenDialog = (goal?: FinancialGoal) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        targetDate: goal.targetDate,
        category: goal.category,
        description: goal.description || ''
      });
    } else {
      setEditingGoal(null);
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: format(new Date(), 'yyyy-MM-dd'),
        category: 'savings',
        description: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGoal(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.targetAmount || !formData.currentAmount || !formData.targetDate) {
      return;
    }

    const newGoal: FinancialGoal = {
      id: editingGoal?.id || Date.now().toString(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      targetDate: formData.targetDate,
      category: formData.category,
      description: formData.description,
      color: getCategoryColor(formData.category),
      icon: getCategoryIcon(formData.category)
    };

    if (editingGoal) {
      setGoals(goals.map(goal => goal.id === editingGoal.id ? newGoal : goal));
    } else {
      setGoals([...goals, newGoal]);
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'savings': return '#2e7d32';
      case 'investment': return '#1976d2';
      case 'purchase': return '#ed6c02';
      case 'debt-payoff': return '#d32f2f';
      default: return '#1a237e';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'savings': return 'Savings';
      case 'investment': return 'TrendingUp';
      case 'purchase': return 'ShoppingCart';
      case 'debt-payoff': return 'CreditCard';
      default: return 'AccountBalance';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'savings': return 'Savings';
      case 'investment': return 'Investment';
      case 'purchase': return 'Purchase';
      case 'debt-payoff': return 'Debt Payoff';
      default: return 'Other';
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Savings': return <SavingsIcon />;
      case 'TrendingUp': return <TrendingUpIcon />;
      case 'ShoppingCart': return <ShoppingCartIcon />;
      case 'CreditCard': return <CreditCardIcon />;
      default: return <AccountBalanceIcon />;
    }
  };

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const totalProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
    
    const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount);
    const activeGoals = goals.filter(goal => goal.currentAmount < goal.targetAmount);
    const overdueGoals = goals.filter(goal => 
      goal.currentAmount < goal.targetAmount && isAfter(new Date(), parseISO(goal.targetDate))
    );

    return {
      totalTarget,
      totalCurrent,
      totalProgress,
      completedGoals: completedGoals.length,
      activeGoals: activeGoals.length,
      overdueGoals: overdueGoals.length
    };
  }, [goals]);

  // Group goals by category
  const goalsByCategory = useMemo(() => {
    return goals.reduce((acc, goal) => {
      if (!acc[goal.category]) {
        acc[goal.category] = [];
      }
      acc[goal.category].push(goal);
      return acc;
    }, {} as Record<string, FinancialGoal[]>);
  }, [goals]);

  return (
    <Box sx={{ width: '100%', py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: '#1a237e',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Financial Goals
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
          }}
        >
          Add Goal
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <AccountBalanceIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Total Target
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              ₹{summaryMetrics.totalTarget.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Current Amount
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              ₹{summaryMetrics.totalCurrent.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Overall Progress
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {summaryMetrics.totalProgress.toFixed(1)}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(summaryMetrics.totalProgress, 100)}
              sx={{ 
                mt: 1, 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white',
                  borderRadius: 4,
                }
              }}
            />
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #7b1fa2 0%, #512da8 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Active Goals
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {summaryMetrics.activeGoals}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {summaryMetrics.completedGoals} completed
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Goals by Category */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {Object.entries(goalsByCategory).map(([category, categoryGoals]) => (
          <Paper key={category} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ 
                bgcolor: getCategoryColor(category),
                mr: 2,
                width: 40,
                height: 40
              }}>
                {getIconComponent(getCategoryIcon(category))}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                {getCategoryLabel(category)}
              </Typography>
              <Chip 
                label={`${categoryGoals.length} goals`}
                sx={{ ml: 'auto', backgroundColor: getCategoryColor(category), color: 'white' }}
              />
            </Box>

            <List>
              {categoryGoals.map((goal, index) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const isCompleted = goal.currentAmount >= goal.targetAmount;
                const isOverdue = !isCompleted && isAfter(new Date(), parseISO(goal.targetDate));
                
                return (
                  <React.Fragment key={goal.id}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: isCompleted ? '#2e7d32' : isOverdue ? '#d32f2f' : getCategoryColor(goal.category),
                          width: 48,
                          height: 48
                        }}>
                          {getIconComponent(goal.icon || 'AccountBalance')}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {goal.name}
                            </Typography>
                            {isCompleted && (
                              <Chip label="Completed" size="small" sx={{ backgroundColor: '#2e7d32', color: 'white' }} />
                            )}
                            {isOverdue && (
                              <Chip label="Overdue" size="small" sx={{ backgroundColor: '#d32f2f', color: 'white' }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {goal.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Target: ₹{goal.targetAmount.toLocaleString()} • 
                              Current: ₹{goal.currentAmount.toLocaleString()} • 
                              Due: {format(parseISO(goal.targetDate), 'MMM dd, yyyy')}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Box sx={{ flexGrow: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={Math.min(progress, 100)}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: isCompleted ? '#2e7d32' : isOverdue ? '#d32f2f' : getCategoryColor(goal.category),
                                      borderRadius: 4,
                                    }
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 45 }}>
                                {progress.toFixed(1)}%
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          onClick={() => handleOpenDialog(goal)}
                          sx={{ color: '#1a237e' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(goal.id)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < categoryGoals.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          </Paper>
        ))}
      </Box>

      {/* Add/Edit Goal Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGoal ? 'Edit Financial Goal' : 'Add New Financial Goal'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Goal Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'savings' | 'investment' | 'purchase' | 'debt-payoff' })}
              >
                <MenuItem value="savings">Savings</MenuItem>
                <MenuItem value="investment">Investment</MenuItem>
                <MenuItem value="purchase">Purchase</MenuItem>
                <MenuItem value="debt-payoff">Debt Payoff</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Target Amount (₹)"
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              label="Current Amount (₹)"
              type="number"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              label="Target Date"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ backgroundColor: '#1a237e' }}
          >
            {editingGoal ? 'Update' : 'Add'} Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinancialGoals;
