import React, { useMemo, useState } from 'react';
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
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Container,
  Button
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { 
  Refresh as RefreshIcon, 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Schedule as ScheduleIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { format, parseISO, isAfter, addDays } from 'date-fns';
import { ExpenseEntry, ExpenseCategory, FinancialGoal, Bill, DashboardMetrics, Investment, IncomeCategory } from '../types';
import MonthlyReport from './MonthlyReport';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  expenses: ExpenseEntry[];
  categories: ExpenseCategory[];
  selectedMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
  onRefresh?: () => void;
  goals?: FinancialGoal[];
  bills?: Bill[];
  incomeData?: ExpenseEntry[];
  investments?: Investment[];
  incomeCategories?: IncomeCategory[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  expenses, 
  categories, 
  selectedMonth, 
  setSelectedMonth, 
  onRefresh,
  goals = [],
  bills = [],
  incomeData = [],
  investments = [],
  incomeCategories = []
}) => {
  const [reportOpen, setReportOpen] = useState(false);
  const { user } = useAuth();

  // Enhanced expense filtering with income/expense separation
  const filteredExpenses = useMemo(() => {
    const filtered = expenses.filter(expense => {
      const expenseYearMonth = expense.date.substring(0, 7);
      return expenseYearMonth === selectedMonth;
    });
    
    return filtered;
  }, [expenses, selectedMonth]);

  // Filter income data by selected month
  const filteredIncome = useMemo(() => {
    const filtered = incomeData.filter(income => {
      const incomeYearMonth = income.date.substring(0, 7);
      return incomeYearMonth === selectedMonth;
    });
    
    return filtered;
  }, [incomeData, selectedMonth]);

  // Separate income and expenses
  const { expenses: monthlyExpenses } = useMemo(() => {
    // Use the separate income data and treat all filtered expenses as expenses
    const expenses = filteredExpenses.filter(exp => exp.type !== 'Income');
    return { expenses };
  }, [filteredExpenses]);

  // Calculate enhanced metrics
  const metrics: DashboardMetrics = useMemo(() => {
    const totalIncome = filteredIncome.reduce((sum, exp) => sum + Math.abs(exp.amount), 0);
    const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + Math.abs(exp.amount), 0);
    const netSavings = totalIncome - totalExpenses;
    
    // Calculate budget utilization
    const totalBudget = categories
      .filter(cat => cat.budget !== null)
      .reduce((sum, cat) => sum + (cat.budget || 0), 0);
    const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
    
    // Top spending categories
    const categorySpending = monthlyExpenses.reduce((acc, exp) => {
      acc[exp.type] = (acc[exp.type] || 0) + Math.abs(exp.amount);
      return acc;
    }, {} as Record<string, number>);
    
    const topSpendingCategories = Object.entries(categorySpending)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    // Recent transactions (last 5)
    const recentTransactions = [...filteredExpenses]
              .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
      .slice(0, 5);
    
    // Upcoming bills (next 7 days)
    const upcomingBills = bills.filter(bill => {
      const dueDate = parseISO(bill.dueDate);
      const today = new Date();
      const nextWeek = addDays(today, 7);
      return bill.status === 'pending' && dueDate <= nextWeek && dueDate >= today;
    });
    
    return {
      totalExpenses,
      totalIncome,
      netSavings,
      budgetUtilization,
      topSpendingCategories,
      recentTransactions,
      upcomingBills,
      goalProgress: goals
    };
  }, [filteredExpenses, filteredIncome, monthlyExpenses, categories, bills, goals]);

  // Enhanced monthly expenses by category
  const monthlyExpensesByCategory = useMemo(() => {
    const expensesByCategory = monthlyExpenses.reduce((acc, expense) => {
      const category = expense.type;
      acc[category] = (acc[category] || 0) + Math.abs(expense.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(expensesByCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: metrics.totalExpenses > 0 ? (amount / metrics.totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthlyExpenses, metrics.totalExpenses]);

  // Calculate budget status with enhanced features
  const budgetStatus = useMemo(() => {
    const status = categories
      .filter(category => category.budget !== null)
      .map(category => {
        const spent = monthlyExpensesByCategory.find(exp => exp.category === category.name)?.amount || 0;
        const budget = category.budget!;
        const remaining = budget - spent;
        const percentage = (spent / budget) * 100;

        return {
          category: category.name,
          budget,
          spent,
          remaining,
          percentage
        };
      });
    
    return status;
  }, [monthlyExpensesByCategory, categories]);

  // Generate colors for charts - new color palette
  const COLORS = [
    '#1E3A8A', // Deep Blue - Primary
    '#F97316', // Bright Orange - Secondary
    '#10B981', // Green - Success/Income
    '#6B7280', // Gray - Neutral
    '#3B82F6', // Blue - Info
    '#F59E0B', // Amber - Warning
    '#8B5CF6', // Purple - Alternative
    '#06B6D4', // Cyan - Alternative
    '#84CC16', // Lime - Alternative
    '#F97316'  // Orange - Secondary (repeat for more categories)
  ];

  const months = [
    { value: '2025-01', label: 'January 2025' },
    { value: '2025-02', label: 'February 2025' },
    { value: '2025-03', label: 'March 2025' },
    { value: '2025-04', label: 'April 2025' },
    { value: '2025-05', label: 'May 2025' },
    { value: '2025-06', label: 'June 2025' },
    { value: '2025-07', label: 'July 2025' },
    { value: '2025-08', label: 'August 2025' },
    { value: '2025-09', label: 'September 2025' },
    { value: '2025-10', label: 'October 2025' },
    { value: '2025-11', label: 'November 2025' },
    { value: '2025-12', label: 'December 2025' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header with enhanced metrics */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        gap: 2
      }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            color: '#1E3A8A',
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Financial Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => setReportOpen(true)}
            sx={{
              backgroundColor: '#10B981',
              '&:hover': { backgroundColor: '#059669' },
              mr: 1
            }}
          >
            Export Report
          </Button>
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={onRefresh}
              sx={{ 
                bgcolor: '#F3F4F6',
                '&:hover': { bgcolor: '#E5E7EB' }
              }}
            >
              <RefreshIcon sx={{ color: '#1E3A8A' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Welcome Message */}
      {user && (
        <Box sx={{ 
          mb: 3, 
          p: 3, 
          backgroundColor: '#F0F9FF', 
          borderRadius: 3,
          border: '1px solid #BAE6FD',
          textAlign: 'center'
        }}>
          <Typography variant="h5" sx={{ 
            color: '#1E3A8A', 
            fontWeight: 600, 
            mb: 1 
          }}>
            Welcome back, {user.name}! 👋
          </Typography>
          <Typography variant="body1" sx={{ 
            color: '#6B7280' 
          }}>
            Your personal finance data is secure and private. No one else can see your financial information.
          </Typography>
        </Box>
      )}

      {/* Month Selection - Centered */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'center',
        width: '100%'
      }}>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel sx={{ color: '#1E3A8A' }}>Select Month</InputLabel>
          <Select
            value={selectedMonth}
            label="Select Month"
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#3B82F6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3B82F6',
                },
              },
              '& .MuiSelect-select': {
                color: '#1E3A8A',
                fontWeight: 500
              }
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

      {/* Enhanced Summary Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: 3, 
        mb: 4 
      }}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
          color: 'white',
          height: '100%',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(30, 58, 138, 0.3)'
          }
        }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <AccountBalanceIcon sx={{ fontSize: 40, mb: 2, color: 'white' }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
              Total Income
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#F9FAFB' }}>
              ₹{metrics.totalIncome.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
          color: 'white',
          height: '100%',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(249, 115, 22, 0.3)'
          }
        }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <TrendingDownIcon sx={{ fontSize: 40, mb: 2, color: 'white' }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
              Total Expenses
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#F9FAFB' }}>
              ₹{metrics.totalExpenses.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: 'white',
          height: '100%',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
          }
        }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <TrendingUpIcon sx={{ fontSize: 40, mb: 2, color: 'white' }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
              Net Savings
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#F9FAFB' }}>
              ₹{metrics.netSavings.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
          color: 'white',
          height: '100%',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(107, 114, 128, 0.3)'
          }
        }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
              Budget Used
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#F9FAFB', mb: 2 }}>
              {metrics.budgetUtilization.toFixed(1)}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(metrics.budgetUtilization, 100)}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#F9FAFB',
                  borderRadius: 4,
                }
              }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Main Content Grid - 3x1 Layout for first row */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
        gap: 3,
        mb: 3
      }}>
        {/* Expense Categories Chart */}
        <Paper sx={{ 
          p: 3, 
          height: 500,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB'
        }}>
          <Typography variant="h6" gutterBottom sx={{ 
            fontWeight: 600, 
            color: '#1E3A8A', 
            mb: 3,
            fontSize: '1.1rem'
          }}>
            Expense Categories
          </Typography>
          {monthlyExpensesByCategory.length > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', height: 400 }}>
              <Box sx={{ flex: 1, height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={monthlyExpensesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="amount"
                      paddingAngle={2}
                    >
                      {monthlyExpensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value, name, props) => [
                        `₹${value.toLocaleString()}`, 
                        props.payload.category
                      ]}
                      labelStyle={{ color: '#1E3A8A', fontWeight: 'bold' }}
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              {/* Legend */}
              <Box sx={{ 
                ml: 2, 
                minWidth: 120,
                maxHeight: 400,
                overflow: 'auto'
              }}>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: 600, 
                  color: '#1E3A8A', 
                  mb: 2,
                  fontSize: '0.9rem'
                }}>
                  Categories
                </Typography>
                {monthlyExpensesByCategory.map((entry, index) => (
                  <Box key={entry.category} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1,
                    p: 0.5,
                    borderRadius: 1,
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }}>
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: COLORS[index % COLORS.length],
                      mr: 1
                    }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 500, 
                        color: '#2c3e50',
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {entry.category}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: '#7f8c8d',
                        fontSize: '0.65rem'
                      }}>
                        ₹{entry.amount.toLocaleString()} ({entry.percentage.toFixed(1)}%)
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: 400,
              color: '#7f8c8d',
              fontSize: '1.1rem'
            }}>
              No expense data available
            </Box>
          )}
        </Paper>

        {/* Monthly Overview Chart */}
        <Paper sx={{ 
          p: 3, 
          height: 500,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB'
        }}>
          <Typography variant="h6" gutterBottom sx={{ 
            fontWeight: 600, 
            color: '#2c3e50', 
            mb: 3,
            fontSize: '1.1rem'
          }}>
            Monthly Overview
          </Typography>
          {monthlyExpensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={[
                { name: 'Income', amount: metrics.totalIncome, color: '#10B981' },
                { name: 'Expenses', amount: metrics.totalExpenses, color: '#F97316' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#1E3A8A', fontWeight: 600 }}
                />
                <YAxis 
                  tick={{ fill: '#1E3A8A', fontSize: 11 }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <RechartsTooltip 
                  formatter={(value, name, props) => [
                    `₹${value.toLocaleString()}`, 
                    props.payload.name
                  ]}
                  labelStyle={{ color: '#1E3A8A', fontWeight: 'bold' }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#1E3A8A"
                  radius={[4, 4, 0, 0]}
                  name="Amount"
                >
                  {[
                    { name: 'Income', amount: metrics.totalIncome, color: '#10B981' },
                    { name: 'Expenses', amount: metrics.totalExpenses, color: '#F97316' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: 400,
              color: '#6B7280',
              fontSize: '1.1rem'
            }}>
              No expense data available
            </Box>
          )}
        </Paper>

        {/* Recent Transactions */}
        <Paper sx={{ 
          p: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB'
        }}>
          <Typography variant="h6" gutterBottom sx={{ 
            fontWeight: 600, 
            color: '#1E3A8A', 
            mb: 2,
            fontSize: '1.1rem'
          }}>
            Recent Transactions
          </Typography>
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {metrics.recentTransactions.length > 0 ? (
              metrics.recentTransactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: transaction.amount > 0 ? '#10B981' : '#F97316',
                        width: 24,
                        height: 24
                      }}>
                        {transaction.amount > 0 ? '+' : '-'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={transaction.description}
                      secondary={`${transaction.type} • ${format(parseISO(transaction.date), 'MMM dd')}`}
                      primaryTypographyProps={{ 
                        fontSize: '0.8rem', 
                        fontWeight: 500,
                        color: '#1E3A8A'
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: '0.7rem',
                        color: '#6B7280'
                      }}
                    />
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600,
                                              color: transaction.amount > 0 ? '#10B981' : '#F97316',
                      fontSize: '0.8rem'
                    }}>
                      ₹{Math.abs(transaction.amount).toLocaleString()}
                    </Typography>
                  </ListItem>
                  {index < metrics.recentTransactions.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 3,
                color: '#7f8c8d'
              }}>
                No recent transactions
              </Box>
            )}
          </List>
        </Paper>
      </Box>

      {/* Budget Status Table - Full Width Below */}
      <Paper sx={{ 
        p: 3,
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #ecf0f1'
      }}>
        <Typography variant="h6" gutterBottom sx={{ 
          fontWeight: 600, 
          color: '#2c3e50', 
          mb: 3,
          fontSize: '1.1rem'
        }}>
          Budget Status
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                            <TableCell sx={{ fontWeight: 600, color: '#1E3A8A', fontSize: '0.75rem' }}>Category</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600, color: '#1E3A8A', fontSize: '0.75rem' }}>Budget</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600, color: '#1E3A8A', fontSize: '0.75rem' }}>Spent</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600, color: '#1E3A8A', fontSize: '0.75rem' }}>Remaining</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#1E3A8A', fontSize: '0.75rem' }}>Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgetStatus.map((status) => (
                                  <TableRow key={status.category} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                  <TableCell sx={{ fontWeight: 500, color: '#1E3A8A', fontSize: '0.7rem' }}>{status.category}</TableCell>
                  <TableCell align="right" sx={{ color: '#1E3A8A', fontSize: '0.7rem' }}>₹{status.budget.toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ color: '#1E3A8A', fontSize: '0.7rem' }}>₹{status.spent.toLocaleString()}</TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      color: status.remaining >= 0 ? '#10B981' : '#F97316',
                      fontWeight: 600,
                      fontSize: '0.7rem'
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
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#F3F4F6',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: status.percentage > 100 ? '#F97316' : '#1E3A8A',
                              borderRadius: 3,
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ 
                        minWidth: 35, 
                        fontWeight: 600,
                        color: '#2c3e50',
                        fontSize: '0.65rem'
                      }}>
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

      {/* Additional widgets for smaller screens or if needed */}
      {(metrics.upcomingBills.length > 0 || metrics.goalProgress.length > 0) && (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
          gap: 3,
          mt: 3
        }}>
          {/* Upcoming Bills */}
          {metrics.upcomingBills.length > 0 && (
            <Paper sx={{ 
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #ecf0f1'
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600, 
                color: '#2c3e50', 
                mb: 2,
                fontSize: '1.1rem'
              }}>
                Upcoming Bills
              </Typography>
              <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                {metrics.upcomingBills.map((bill, index) => (
                  <React.Fragment key={bill.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: isAfter(parseISO(bill.dueDate), new Date()) ? '#F59E0B' : '#F97316',
                          width: 32,
                          height: 32
                        }}>
                          <ScheduleIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={bill.name}
                        secondary={`Due: ${format(parseISO(bill.dueDate), 'MMM dd, yyyy')}`}
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem', 
                          fontWeight: 500,
                          color: '#1E3A8A'
                        }}
                        secondaryTypographyProps={{ 
                                                  fontSize: '0.8rem',
                        color: '#6B7280'
                        }}
                      />
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600,
                        color: '#1E3A8A'
                      }}>
                        ₹{bill.amount.toLocaleString()}
                      </Typography>
                    </ListItem>
                    {index < metrics.upcomingBills.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}

          {/* Financial Goals Progress */}
          {metrics.goalProgress.length > 0 && (
            <Paper sx={{ 
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #E5E7EB'
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600, 
                color: '#1E3A8A', 
                mb: 2,
                fontSize: '1.1rem'
              }}>
                Goals Progress
              </Typography>
              {metrics.goalProgress.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <Box key={goal.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 500,
                        color: '#1E3A8A'
                      }}>
                        {goal.name}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600,
                        color: '#1E3A8A'
                      }}>
                        {progress.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(progress, 100)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#F3F4F6',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: progress >= 100 ? '#10B981' : '#1E3A8A',
                          borderRadius: 3,
                        }
                      }}
                    />
                    <Typography variant="caption" sx={{ 
                                              color: '#6B7280',
                        display: 'block',
                        mt: 0.5
                    }}>
                      ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                    </Typography>
                  </Box>
                );
              })}
            </Paper>
          )}
        </Box>
      )}

      {/* Monthly Report Dialog */}
      <MonthlyReport
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        selectedMonth={selectedMonth}
        expenses={expenses}
        income={incomeData}
        investments={investments}
        categories={categories}
        incomeCategories={incomeCategories}
        goals={goals}
        bills={bills}
      />
    </Container>
  );
};

export default Dashboard;
