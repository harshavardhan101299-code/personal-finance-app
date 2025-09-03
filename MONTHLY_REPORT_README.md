# Monthly Report Export Feature

## Overview
The Personal Finance App now includes a comprehensive monthly report export feature that allows users to generate detailed financial summaries for any selected month.

## Features

### 1. Screenshot-Friendly Popup Report
- **Access**: Click the "Export Report" button in the Dashboard header
- **Content**: Displays a comprehensive monthly financial summary including:
  - Key metrics (Income, Expenses, Net Savings, Investments)
  - Income and expense breakdowns by category
  - Budget status with progress bars
  - Top income sources and expenses
  - Financial ratios (Savings Rate, Investment Rate, Expense Ratio)
- **Use Case**: Perfect for taking screenshots to paste into Google Docs, presentations, or sharing with financial advisors

### 2. PDF Export
- **Format**: High-quality PDF with professional layout
- **File Naming**: Automatically named as `monthly-report-YYYY-MM.pdf`
- **Quality**: High-resolution export suitable for printing and archiving
- **Multi-page Support**: Automatically handles content that spans multiple pages

## How to Use

### Step 1: Navigate to Dashboard
1. Open the Personal Finance App
2. Go to the Dashboard tab (first tab)

### Step 2: Select Month
1. Use the month selector dropdown to choose the month for your report
2. Available months: January 2025 through December 2025

### Step 3: Generate Report
1. Click the green "Export Report" button in the top-right corner of the Dashboard
2. A popup will appear with the monthly report

### Step 4: Choose Export Option
1. **For Screenshots**: Simply view the report in the popup and take a screenshot
2. **For PDF**: Click the "Export as PDF" button at the bottom of the popup

## Report Contents

### Key Metrics Cards
- **Total Income**: Sum of all income for the selected month
- **Total Expenses**: Sum of all expenses for the selected month
- **Net Savings**: Income minus expenses
- **Investments**: Total investment amount for the month

### Detailed Breakdowns
- **Income Breakdown**: Income categorized by source with amounts and percentages
- **Expense Breakdown**: Expenses categorized by type with amounts and percentages
- **Budget Status**: Progress bars showing budget utilization for each category

### Transaction Details
- **Top Income Sources**: Top 5 income transactions by amount
- **Top Expenses**: Top 5 expense transactions by amount

### Financial Summary
- **Savings Rate**: Percentage of income saved
- **Investment Rate**: Percentage of income invested
- **Expense Ratio**: Percentage of income spent
- **Net Worth Impact**: Monthly change in net worth

## Technical Details

### Dependencies
- `jspdf`: For PDF generation
- `html2canvas`: For converting HTML to canvas for PDF export
- `@mui/material`: For UI components
- `date-fns`: For date formatting

### File Structure
```
src/
├── components/
│   ├── Dashboard.tsx (updated with export button)
│   └── MonthlyReport.tsx (new component)
└── types/
    └── index.ts (existing types)
```

### Data Sources
The report automatically pulls data from:
- Expenses (from ExpenseTracker)
- Income (from IncomeTracker)
- Investments (from stored data)
- Budget categories (from BudgetManager)
- Financial goals (from FinancialGoals)
- Bills (from BillManager)

## Browser Compatibility
- Chrome/Edge: Full support for both popup and PDF export
- Firefox: Full support for both popup and PDF export
- Safari: Full support for both popup and PDF export

## Troubleshooting

### PDF Export Issues
- Ensure the browser allows popups
- Check that the report content is fully loaded before exporting
- For large reports, the PDF generation may take a few seconds

### Data Display Issues
- Verify that the selected month has data
- Check that all data sources are properly connected
- Refresh the dashboard if data appears outdated

## Future Enhancements
- Custom date range selection
- Email report functionality
- Scheduled report generation
- Custom report templates
- Export to Excel/CSV formats
- Chart and graph inclusion in PDFs

## Support
If you encounter any issues with the monthly report export feature, please check:
1. Browser console for error messages
2. Data availability for the selected month
3. Browser popup blocker settings
4. Available disk space for PDF downloads
