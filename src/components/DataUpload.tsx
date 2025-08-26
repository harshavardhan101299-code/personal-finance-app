import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { Upload as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import { ExpenseEntry, ExpenseCategory, UploadedData, CSVRow } from '../types';

interface DataUploadProps {
  onDataUpload: (expenses: ExpenseEntry[], categories: ExpenseCategory[]) => void;
  existingExpenses: ExpenseEntry[];
}

const DataUpload: React.FC<DataUploadProps> = ({ onDataUpload, existingExpenses }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadedData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [detectedColumns, setDetectedColumns] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const parseDate = (dateStr: string): string => {
    // Handle "D-Mon" format like "2-Jul"
    const monthMap: { [key: string]: string } = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };

    // Try to parse "D-Mon" format first
    const dMonMatch = dateStr.match(/^(\d{1,2})-([A-Za-z]{3})$/);
    if (dMonMatch) {
      const day = dMonMatch[1].padStart(2, '0');
      const month = monthMap[dMonMatch[2]];
      if (month) {
        // Use 2024 as the year since that's what the dashboard expects
        return `2024-${month}-${day}`;
      }
    }

    // Try standard date parsing
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }

    // If all else fails, return the original string
    return dateStr;
  };

  const parseCSV = (csvText: string): { rows: CSVRow[], columns: string[] } => {
    const lines = csvText.split('\n');
    console.log('CSV Lines:', lines.length);
    console.log('First line:', lines[0]);
    console.log('Second line (headers):', lines[1]);
    
    // Try different delimiters
    let delimiter = ',';
    if (lines[1] && lines[1].includes('\t')) delimiter = '\t';
    if (lines[1] && lines[1].includes(';')) delimiter = ';';
    
    console.log('Using delimiter:', delimiter);
    
    // Headers are on row 2 (index 1)
    const headerRowIndex = 1;
    const headers = lines[headerRowIndex].split(delimiter).map(h => h.trim().replace(/"/g, ''));
    console.log('Headers:', headers);
    
    // Find the column indices for our required fields
    // Handle potential duplicate column names by finding the first occurrence
    const dateIndex = headers.findIndex(h => h.toLowerCase() === 'date');
    const typeIndex = headers.findIndex(h => h.toLowerCase() === 'type');
    const descriptionIndex = headers.findIndex(h => h.toLowerCase() === 'description');
    const amountIndex = headers.findIndex(h => h.toLowerCase() === 'amount');
    
    console.log('Column indices:', {
      date: dateIndex,
      type: typeIndex,
      description: descriptionIndex,
      amount: amountIndex
    });
    console.log('All headers:', headers);
    
    // Check if we have all required columns
    if (dateIndex === -1 || typeIndex === -1 || descriptionIndex === -1 || amountIndex === -1) {
      console.log('Missing required columns. Found:', { dateIndex, typeIndex, descriptionIndex, amountIndex });
      console.log('Available headers:', headers);
      return { rows: [], columns: headers };
    }
    
    const rows: CSVRow[] = [];

    // Start processing from row 3 (index 2) since headers are on row 2
    for (let i = 2; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(delimiter).map(v => v.trim().replace(/"/g, ''));
        console.log(`Row ${i + 1}:`, values);
        
        // Skip rows that don't have enough columns
        if (values.length <= Math.max(dateIndex, typeIndex, descriptionIndex, amountIndex)) {
          console.log(`Skipping short row ${i + 1}:`, values);
          continue;
        }
        
        // Skip rows where the date value doesn't look like a date
        const dateValue = values[dateIndex] || '';
        if (!dateValue.match(/^\d{1,2}-[A-Za-z]{3}$/)) {
          console.log(`Skipping non-date row ${i + 1}:`, dateValue);
          continue;
        }
        
        // Create expense entry using only the required columns
        const expense: CSVRow = {
          Date: values[dateIndex] || '',
          Type: values[typeIndex] || '',
          Description: values[descriptionIndex] || '',
          Amount: values[amountIndex] || ''
        };
        
        console.log(`Row ${i + 1} extracted values:`, {
          dateValue: values[dateIndex],
          typeValue: values[typeIndex],
          descriptionValue: values[descriptionIndex],
          amountValue: values[amountIndex]
        });
        
        // Validate that amount is numeric before processing
        const amountValue = values[amountIndex] || '';
        if (!amountValue.match(/^\d+$/)) {
          console.log(`Row ${i + 1} has non-numeric amount: "${amountValue}" - skipping`);
          continue;
        }
        
        console.log(`Created expense row ${i + 1}:`, {
          Date: expense.Date,
          Type: expense.Type,
          Description: expense.Description,
          Amount: expense.Amount
        });
        rows.push(expense);
      }
    }

    console.log('Total parsed expense rows:', rows.length);
    return { rows, columns: headers };
  };

  const processCSVData = (csvRows: CSVRow[]): UploadedData => {
    const expenses: ExpenseEntry[] = [];
    const categorySet = new Set<string>();
    let success = true;
    let message = '';
    let categories: ExpenseCategory[] = [];

    try {
      csvRows.forEach((row, index) => {
        console.log(`Processing row ${index + 1}:`, row);
        
        // Check if we have the required fields
        const hasDate = row.Date;
        const hasType = row.Type;
        const hasDescription = row.Description;
        const hasAmount = row.Amount;
        
        console.log(`Row ${index + 1} validation:`, {
          Date: hasDate,
          Type: hasType,
          Description: hasDescription,
          Amount: hasAmount
        });
        
        if (!hasDate || !hasType || !hasDescription || !hasAmount) {
          message += `Row ${index + 2}: Missing required fields (Date: ${!!hasDate}, Type: ${!!hasType}, Description: ${!!hasDescription}, Amount: ${!!hasAmount})\n`;
          success = false;
          return;
        }

        // Parse amount
        const amountStr = hasAmount.toString();
        // Remove commas and any non-numeric characters except decimal point and minus
        const cleanAmount = amountStr.replace(/[^\d.-]/g, '');
        const amount = parseFloat(cleanAmount);
        if (isNaN(amount)) {
          console.log(`Row ${index + 2} amount parsing failed:`, {
            original: amountStr,
            cleaned: cleanAmount,
            parsed: amount
          });
          message += `Row ${index + 2}: Invalid amount format "${amountStr}"\n`;
          success = false;
          return;
        }

        // Parse date
        const dateStr = hasDate.toString();
        const parsedDate = parseDate(dateStr);
        console.log(`Date parsing: "${dateStr}" -> "${parsedDate}"`);
        
        if (!parsedDate || parsedDate === dateStr) {
          message += `Row ${index + 2}: Invalid date format "${dateStr}"\n`;
          success = false;
          return;
        }

        // Add category to set
        const typeStr = hasType.toString();
        categorySet.add(typeStr);

        // Create expense entry
        const expenseEntry = {
          id: `uploaded-${index}`,
          date: parsedDate,
          type: typeStr,
          description: hasDescription.toString(),
          paidBy: 'Me', // Default value for uploaded data
          amount: amount
        };
        
        console.log(`Created expense entry:`, expenseEntry);
        expenses.push(expenseEntry);
      });

      // Create categories from the data
      categories = Array.from(categorySet).map((category, index) => ({
        id: `category-${index}`,
        name: category,
        description: `${category} expenses`,
        budget: null
      }));

      if (success) {
        message = `Successfully uploaded ${expenses.length} expenses with ${categories.length} categories`;
      }

    } catch (error) {
      success = false;
      message = `Error processing CSV: ${error}`;
    }

    return {
      expenses,
      categories,
      message,
      success
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);
    setUploading(true);
    setUploadResult(null);
    setDetectedColumns([]);

    try {
      console.log('Starting file upload for:', file.name);
      const text = await file.text();
      console.log('File content preview:', text.substring(0, 500));
      
      const { rows, columns } = parseCSV(text);
      console.log('Parsed CSV data:', { rows, columns });
      
      setDetectedColumns(columns);
      
      if (rows.length === 0) {
        setUploadResult({
          expenses: [],
          categories: [],
          message: 'No data rows found in CSV file. Please check the file format.',
          success: false
        });
        return;
      }
      
      const result = processCSVData(rows);
      console.log('Processing result:', result);
      
      if (result.success) {
        // Merge with existing expenses
        const mergedExpenses = [...existingExpenses, ...result.expenses];
        console.log('Merged expenses:', mergedExpenses.length, 'total');
        
        // Update the uploaded files list
        setUploadedFiles(prev => [...prev, file]);
        
        // Call the upload handler with merged data
        onDataUpload(mergedExpenses, result.categories);
        
        setUploadResult({
          ...result,
          message: `Successfully uploaded ${result.expenses.length} expenses. Total expenses now: ${mergedExpenses.length}`
        });
      } else {
        setUploadResult(result);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        expenses: [],
        categories: [],
        message: `Error reading file: ${error}`,
        success: false
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `Date,Type,Description,Amount
2024-04-12,Dining,This is it,1000
2024-04-17,Dining,Snacks from Zepto,150
2024-04-18,Travel,Uber ride,2625`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a237e', mb: 4 }}>
        Data Upload
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
          Upload Your Google Sheets Data
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
          Export your Google Sheets data as CSV and upload it here. The CSV should have columns: Date, Type, Description, Amount. The 'Paid By' column is optional and will default to 'Me' if not provided.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
            disabled={uploading}
            sx={{
              backgroundColor: '#1a237e',
              '&:hover': { backgroundColor: '#0d47a1' }
            }}
          >
            {uploading ? 'Uploading...' : 'Choose CSV File'}
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={handleFileUpload}
            />
          </Button>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadTemplate}
            sx={{
              borderColor: '#1a237e',
              color: '#1a237e',
              '&:hover': { 
                borderColor: '#0d47a1',
                backgroundColor: 'rgba(26, 35, 126, 0.04)'
              }
            }}
          >
            Download Template
          </Button>
        </Box>

        {uploading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <CircularProgress size={20} />
            <Typography>Processing your data...</Typography>
          </Box>
        )}

        {uploadResult && (
          <Alert 
            severity={uploadResult.success ? 'success' : 'error'}
            sx={{ mb: 3 }}
          >
            {uploadResult.message}
          </Alert>
        )}

        {file && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
                Selected File: {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Size: {(file.size / 1024).toFixed(2)} KB
              </Typography>
              {detectedColumns.length > 0 && (
                <>
                  <Typography variant="subtitle2" sx={{ color: '#1a237e', mb: 1 }}>
                    Detected Columns:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {detectedColumns.map((column, index) => (
                      <Chip 
                        key={index} 
                        label={column} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          borderColor: '#1a237e',
                          color: '#1a237e'
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Expected columns: Date, Type, Description, Amount
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        )}
        {uploadedFiles.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
                Uploaded Files ({uploadedFiles.length})
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {uploadedFiles.map((file, index) => (
                  <Typography key={index} variant="body2" color="text.secondary">
                    {index + 1}. {file.name}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
          Upload Multiple Months
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
          To upload all your historical data (April-August 2024):
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText 
              primary="1. Export each month separately"
              secondary="From Google Sheets, export April, May, June, July, and August as separate CSV files"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="2. Upload one by one"
              secondary="Upload each month's CSV file. The app will merge all data together."
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="3. Verify data"
              secondary="Check the Dashboard tab to see all your historical data across months."
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="4. Add future expenses"
              secondary="Use the Expense Tracker tab to add new expenses going forward."
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default DataUpload;
