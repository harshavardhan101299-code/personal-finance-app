import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  IconButton,
  LinearProgress
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Savings as SavingsIcon,
  AccountBalanceWallet as InvestmentIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ExpenseEntry, ExpenseCategory, FinancialGoal, Bill, Investment, IncomeCategory } from '../types';

interface MonthlyReportProps {
  open: boolean;
  onClose: () => void;
  selectedMonth: string;
  expenses: ExpenseEntry[];
  income: ExpenseEntry[];
  investments: Investment[];
  categories: ExpenseCategory[];
  incomeCategories: IncomeCategory[];
  goals: FinancialGoal[];
  bills: Bill[];
}

interface MonthlyMetrics {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  totalInvestments: number;
  expensesByCategory: Array<{ category: string; amount: number; percentage: number }>;
  incomeByCategory: Array<{ category: string; amount: number; percentage: number }>;
  topExpenses: ExpenseEntry[];
  topIncome: ExpenseEntry[];
  budgetStatus: Array<{ category: string; budget: number; spent: number; remaining: number; percentage: number }>;
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({
  open,
  onClose,
  selectedMonth,
  expenses,
  income,
  investments,
  categories,
  incomeCategories,
  goals,
  bills
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Calculate monthly metrics
  const monthlyMetrics: MonthlyMetrics = React.useMemo(() => {
    const monthStart = `${selectedMonth}-01`;
    const monthEnd = `${selectedMonth}-31`;

    // Filter data for selected month
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = exp.date;
      return expDate >= monthStart && expDate <= monthEnd && exp.type !== 'Income';
    });

    const monthlyIncome = income.filter(inc => {
      const incDate = inc.date;
      return incDate >= monthStart && incDate <= monthEnd;
    });

    const monthlyInvestments = investments.filter(inv => {
      const invDate = inv.purchaseDate;
      return invDate >= monthStart && invDate <= monthEnd;
    });

    // Calculate totals
    const totalIncome = monthlyIncome.reduce((sum, inc) => sum + Math.abs(inc.amount), 0);
    const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + Math.abs(exp.amount), 0);
    const netSavings = totalIncome - totalExpenses;
    const totalInvestments = monthlyInvestments.reduce((sum, inv) => sum + inv.amount, 0);

    // Expenses by category
    const expensesByCategory = monthlyExpenses.reduce((acc, exp) => {
      const category = exp.type;
      acc[category] = (acc[category] || 0) + Math.abs(exp.amount);
      return acc;
    }, {} as Record<string, number>);

    const expensesByCategoryArray = Object.entries(expensesByCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    // Income by category
    const incomeByCategory = monthlyIncome.reduce((acc, inc) => {
      const category = inc.type;
      acc[category] = (acc[category] || 0) + Math.abs(inc.amount);
      return acc;
    }, {} as Record<string, number>);

    const incomeByCategoryArray = Object.entries(incomeByCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    // Top transactions
    const topExpenses = [...monthlyExpenses]
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
      .slice(0, 10);

    const topIncome = [...monthlyIncome]
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
      .slice(0, 10);

    // Budget status
    const budgetStatus = categories
      .filter(cat => cat.budget !== null)
      .map(category => {
        const spent = expensesByCategory[category.name] || 0;
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

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      totalInvestments,
      expensesByCategory: expensesByCategoryArray,
      incomeByCategory: incomeByCategoryArray,
      topExpenses,
      topIncome,
      budgetStatus
    };
  }, [selectedMonth, expenses, income, investments, categories]);

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return format(date, 'MMMM yyyy');
  };

  const generatePDF = async () => {
    if (!reportRef.current) return;

    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      const fileName = `monthly-report-${selectedMonth}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 3, 
        backgroundColor: '#2c3e50', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Monthly Financial Report
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
            {formatMonth(selectedMonth)}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box ref={reportRef} sx={{ p: 4, backgroundColor: 'white' }}>
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 4, pb: 3, borderBottom: '2px solid #ecf0f1' }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 700, 
              color: '#2c3e50',
              mb: 2
            }}>
              {formatMonth(selectedMonth)} Financial Summary
            </Typography>
            <Typography variant="h6" sx={{ color: '#7f8c8d' }}>
              Generated on {format(new Date(), 'MMMM dd, yyyy')}
            </Typography>
          </Box>

          {/* Key Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <AccountBalanceIcon sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Total Income
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₹{monthlyMetrics.totalIncome.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <TrendingDownIcon sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Total Expenses
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₹{monthlyMetrics.totalExpenses.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <SavingsIcon sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Net Savings
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₹{monthlyMetrics.netSavings.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <InvestmentIcon sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Investments
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₹{monthlyMetrics.totalInvestments.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Breakdown */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Income Breakdown */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                  Income Breakdown
                </Typography>
                {monthlyMetrics.incomeByCategory.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>%</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {monthlyMetrics.incomeByCategory.map((item) => (
                          <TableRow key={item.category}>
                            <TableCell>{item.category}</TableCell>
                            <TableCell align="right">₹{item.amount.toLocaleString()}</TableCell>
                            <TableCell align="right">{item.percentage.toFixed(1)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography sx={{ color: '#7f8c8d', textAlign: 'center', py: 2 }}>
                    No income data for this month
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Expense Breakdown */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                  Expense Breakdown
                </Typography>
                {monthlyMetrics.expensesByCategory.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>%</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {monthlyMetrics.expensesByCategory.map((item) => (
                          <TableRow key={item.category}>
                            <TableCell>{item.category}</TableCell>
                            <TableCell align="right">₹{item.amount.toLocaleString()}</TableCell>
                            <TableCell align="right">{item.percentage.toFixed(1)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography sx={{ color: '#7f8c8d', textAlign: 'center', py: 2 }}>
                    No expense data for this month
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Budget Status */}
          {monthlyMetrics.budgetStatus.length > 0 && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#2c3e50' }}>
                Budget Status
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Budget</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Spent</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Remaining</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {monthlyMetrics.budgetStatus.map((status) => (
                      <TableRow key={status.category}>
                        <TableCell sx={{ fontWeight: 500 }}>{status.category}</TableCell>
                        <TableCell align="right">₹{status.budget.toLocaleString()}</TableCell>
                        <TableCell align="right">₹{status.spent.toLocaleString()}</TableCell>
                        <TableCell 
                          align="right" 
                          sx={{ 
                            color: status.remaining >= 0 ? '#27ae60' : '#e74c3c',
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
                                  backgroundColor: '#ecf0f1',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: status.percentage > 100 ? '#e74c3c' : '#3498db',
                                    borderRadius: 4,
                                  }
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ minWidth: 40, fontWeight: 600 }}>
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
          )}

          {/* Top Transactions */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Top Income */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                  Top Income Sources
                </Typography>
                {monthlyMetrics.topIncome.length > 0 ? (
                  <Box>
                    {monthlyMetrics.topIncome.slice(0, 5).map((item, index) => (
                      <Box key={item.id} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 1,
                        borderBottom: index < 4 ? '1px solid #ecf0f1' : 'none'
                      }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.description}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                            {item.type} • {format(parseISO(item.date), 'MMM dd')}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#27ae60' }}>
                          +₹{Math.abs(item.amount).toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ color: '#7f8c8d', textAlign: 'center', py: 2 }}>
                    No income transactions this month
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Top Expenses */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                  Top Expenses
                </Typography>
                {monthlyMetrics.topExpenses.length > 0 ? (
                  <Box>
                    {monthlyMetrics.topExpenses.slice(0, 5).map((item, index) => (
                      <Box key={item.id} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 1,
                        borderBottom: index < 4 ? '1px solid #ecf0f1' : 'none'
                      }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.description}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                            {item.type} • {format(parseISO(item.date), 'MMM dd')}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#e74c3c' }}>
                          -₹{Math.abs(item.amount).toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ color: '#7f8c8d', textAlign: 'center', py: 2 }}>
                    No expense transactions this month
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Financial Summary */}
          <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
              Financial Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#7f8c8d' }}>Savings Rate</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#27ae60' }}>
                    {monthlyMetrics.totalIncome > 0 
                      ? ((monthlyMetrics.netSavings / monthlyMetrics.totalIncome) * 100).toFixed(1)
                      : '0'}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#7f8c8d' }}>Investment Rate</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#9b59b6' }}>
                    {monthlyMetrics.totalIncome > 0 
                      ? ((monthlyMetrics.totalInvestments / monthlyMetrics.totalIncome) * 100).toFixed(1)
                      : '0'}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#7f8c8d' }}>Expense Ratio</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#e74c3c' }}>
                    {monthlyMetrics.totalIncome > 0 
                      ? ((monthlyMetrics.totalExpenses / monthlyMetrics.totalIncome) * 100).toFixed(1)
                      : '0'}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#7f8c8d' }}>Net Worth Impact</Typography>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    color: monthlyMetrics.netSavings >= 0 ? '#27ae60' : '#e74c3c'
                  }}>
                    {monthlyMetrics.netSavings >= 0 ? '+' : ''}₹{monthlyMetrics.netSavings.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Close
        </Button>
        <Button
          onClick={generatePDF}
          variant="contained"
          startIcon={<PdfIcon />}
          disabled={isGeneratingPdf}
          sx={{
            backgroundColor: '#e74c3c',
            '&:hover': { backgroundColor: '#c0392b' }
          }}
        >
          {isGeneratingPdf ? 'Generating PDF...' : 'Export as PDF'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MonthlyReport;
