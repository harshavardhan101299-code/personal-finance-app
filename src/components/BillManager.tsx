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
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { format, parseISO, isAfter, addDays, isBefore } from 'date-fns';
import { Bill } from '../types';

interface BillManagerProps {
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

const BillManager: React.FC<BillManagerProps> = ({ bills, setBills }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: '',
    recurring: false,
    frequency: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    reminderDays: '3'
  });

  const handleOpenDialog = (bill?: Bill) => {
    if (bill) {
      setEditingBill(bill);
      setFormData({
        name: bill.name,
        amount: bill.amount.toString(),
        dueDate: bill.dueDate,
        category: bill.category,
        recurring: bill.recurring,
        frequency: bill.frequency || 'monthly',
        reminderDays: bill.reminderDays?.toString() || '3'
      });
    } else {
      setEditingBill(null);
      setFormData({
        name: '',
        amount: '',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        category: '',
        recurring: false,
        frequency: 'monthly',
        reminderDays: '3'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBill(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.amount || !formData.dueDate || !formData.category) {
      return;
    }

    const dueDate = parseISO(formData.dueDate);
    const status = isBefore(dueDate, new Date()) ? 'overdue' : 'pending';

    const newBill: Bill = {
      id: editingBill?.id || Date.now().toString(),
      name: formData.name,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      category: formData.category,
      recurring: formData.recurring,
      frequency: formData.recurring ? formData.frequency : undefined,
      status,
      reminderDays: parseInt(formData.reminderDays)
    };

    if (editingBill) {
      setBills(bills.map(bill => bill.id === editingBill.id ? newBill : bill));
    } else {
      setBills([...bills, newBill]);
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id));
  };

  const handleMarkAsPaid = (id: string) => {
    setBills(bills.map(bill => 
      bill.id === id 
        ? { ...bill, status: 'paid', paidDate: format(new Date(), 'yyyy-MM-dd') }
        : bill
    ));
  };

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'paid') return '#2e7d32';
    if (status === 'overdue' || isAfter(new Date(), parseISO(dueDate))) return '#d32f2f';
    return '#ff9800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircleIcon />;
      case 'overdue': return <WarningIcon />;
      default: return <ScheduleIcon />;
    }
  };

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalBills = bills.length;
    const paidBills = bills.filter(bill => bill.status === 'paid').length;
    const pendingBills = bills.filter(bill => bill.status === 'pending').length;
    const overdueBills = bills.filter(bill => bill.status === 'overdue').length;
    
    const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
    const paidAmount = bills
      .filter(bill => bill.status === 'paid')
      .reduce((sum, bill) => sum + bill.amount, 0);
    const pendingAmount = bills
      .filter(bill => bill.status === 'pending')
      .reduce((sum, bill) => sum + bill.amount, 0);
    const overdueAmount = bills
      .filter(bill => bill.status === 'overdue')
      .reduce((sum, bill) => sum + bill.amount, 0);

    return {
      totalBills,
      paidBills,
      pendingBills,
      overdueBills,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount
    };
  }, [bills]);

  // Group bills by status
  const billsByStatus = useMemo(() => {
    return bills.reduce((acc, bill) => {
      if (!acc[bill.status]) {
        acc[bill.status] = [];
      }
      acc[bill.status].push(bill);
      return acc;
    }, {} as Record<string, Bill[]>);
  }, [bills]);

  // Get upcoming bills (next 7 days)
  const upcomingBills = useMemo(() => {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    
    return bills.filter(bill => {
      const dueDate = parseISO(bill.dueDate);
      return bill.status === 'pending' && dueDate <= nextWeek && dueDate >= today;
    }).sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime());
  }, [bills]);

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
          Bill Manager
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
          Add Bill
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <ReceiptIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Total Bills
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {summaryMetrics.totalBills}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Paid Bills
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {summaryMetrics.paidBills}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              ₹{summaryMetrics.paidAmount.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <ScheduleIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Pending Bills
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {summaryMetrics.pendingBills}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              ₹{summaryMetrics.pendingAmount.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <WarningIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Overdue Bills
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {summaryMetrics.overdueBills}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              ₹{summaryMetrics.overdueAmount.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Upcoming Bills */}
      {upcomingBills.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
            Upcoming Bills (Next 7 Days)
          </Typography>
          <List>
            {upcomingBills.map((bill, index) => (
              <React.Fragment key={bill.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: getStatusColor(bill.status, bill.dueDate),
                      width: 40,
                      height: 40
                    }}>
                      {getStatusIcon(bill.status)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {bill.name}
                        </Typography>
                        <Chip 
                          label={bill.category} 
                          size="small" 
                          sx={{ backgroundColor: '#1a237e', color: 'white' }}
                        />
                        {bill.recurring && (
                          <Chip 
                            label="Recurring" 
                            size="small" 
                            sx={{ backgroundColor: '#7b1fa2', color: 'white' }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Due: {format(parseISO(bill.dueDate), 'MMM dd, yyyy')} • 
                        Amount: ₹{bill.amount.toLocaleString()}
                      </Typography>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleMarkAsPaid(bill.id)}
                      sx={{ borderColor: '#2e7d32', color: '#2e7d32' }}
                    >
                      Mark Paid
                    </Button>
                    <IconButton 
                      onClick={() => handleOpenDialog(bill)}
                      sx={{ color: '#1a237e' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < upcomingBills.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Bills by Status */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {Object.entries(billsByStatus).map(([status, statusBills]) => (
          <Paper key={status} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ 
                bgcolor: getStatusColor(status, ''),
                mr: 2,
                width: 40,
                height: 40
              }}>
                {getStatusIcon(status)}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e', textTransform: 'capitalize' }}>
                {status} Bills
              </Typography>
              <Chip 
                label={`${statusBills.length} bills`}
                sx={{ ml: 'auto', backgroundColor: getStatusColor(status, ''), color: 'white' }}
              />
            </Box>

            <List>
              {statusBills.map((bill, index) => (
                <React.Fragment key={bill.id}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: getStatusColor(bill.status, bill.dueDate),
                        width: 48,
                        height: 48
                      }}>
                        {getStatusIcon(bill.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {bill.name}
                          </Typography>
                          <Chip 
                            label={bill.category} 
                            size="small" 
                            sx={{ backgroundColor: '#1a237e', color: 'white' }}
                          />
                          {bill.recurring && (
                            <Chip 
                              label={`${bill.frequency}`} 
                              size="small" 
                              sx={{ backgroundColor: '#7b1fa2', color: 'white' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Due: {format(parseISO(bill.dueDate), 'MMM dd, yyyy')} • 
                            Amount: ₹{bill.amount.toLocaleString()}
                          </Typography>
                          {bill.status === 'paid' && bill.paidDate && (
                            <Typography variant="body2" color="text.secondary">
                              Paid: {format(parseISO(bill.paidDate), 'MMM dd, yyyy')}
                            </Typography>
                          )}
                          {bill.reminderDays && (
                            <Typography variant="body2" color="text.secondary">
                              Reminder: {bill.reminderDays} days before due
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {bill.status !== 'paid' && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleMarkAsPaid(bill.id)}
                          sx={{ borderColor: '#2e7d32', color: '#2e7d32' }}
                        >
                          Mark Paid
                        </Button>
                      )}
                      <IconButton 
                        onClick={() => handleOpenDialog(bill)}
                        sx={{ color: '#1a237e' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(bill.id)}
                        sx={{ color: '#d32f2f' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < statusBills.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        ))}
      </Box>

      {/* Add/Edit Bill Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBill ? 'Edit Bill' : 'Add New Bill'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Bill Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="Amount (₹)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.recurring}
                  onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                />
              }
              label="Recurring Bill"
            />

            {formData.recurring && (
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={formData.frequency}
                  label="Frequency"
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'monthly' | 'quarterly' | 'yearly' })}
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            )}

            <TextField
              label="Reminder Days Before Due"
              type="number"
              value={formData.reminderDays}
              onChange={(e) => setFormData({ ...formData, reminderDays: e.target.value })}
              fullWidth
              inputProps={{ min: 1, max: 30 }}
              helperText="Number of days before due date to send reminder"
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
            {editingBill ? 'Update' : 'Add'} Bill
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillManager;
