# Personal Finance Web App

A modern, responsive personal finance web application built with React, TypeScript, and Material-UI. This app helps you track expenses, manage budgets, and visualize your financial data with beautiful charts and analytics.

## Features

### 📊 Dashboard
- **Overview Cards**: Total expenses, budget, and transaction count
- **Interactive Charts**: Bar chart showing expenses by category and pie chart for expense distribution
- **Budget Status Table**: Real-time progress tracking for each budget category
- **Visual Progress Bars**: Color-coded progress indicators (green for under budget, red for over budget)

### 💰 Expense Tracker
- **Add/Edit Expenses**: Simple form to add new expenses or edit existing ones
- **Categorized Expenses**: Organize expenses by predefined categories
- **Transaction Table**: View all expenses in a clean, sortable table format
- **Real-time Updates**: See totals update immediately when adding/editing expenses

### 🎯 Budget Manager
- **Category Management**: View and edit expense categories and their descriptions
- **Budget Setting**: Set monthly budgets for each category
- **Progress Tracking**: Visual progress bars showing budget utilization
- **Summary Cards**: Quick overview of total budget, spent amount, and remaining budget

## Data Structure

The app is based on your existing Google Sheets structure with the following categories:

- **Housing**: Home Essentials (no budget set)
- **Subscriptions**: Phone, LinkedIn, iCloud, Netflix, Spotify (₹1,500 budget)
- **Groceries**: Ratnadeep, Ushodaya, Kirana Stores, Market (₹3,000 budget)
- **Dining**: Restaurants, Clubs, Zomato, Zepto, Swiggy (₹4,000 budget)
- **Learning & Growth**: Courses, Certifications, Fellowships, Books (₹500 budget)
- **Personal Care**: Body Essentials, Gym, Medicines, Hair Cut, Clothes (₹1,500 budget)
- **Travel**: Uber, Rapido, Ola, Fuel (₹4,000 budget)
- **Entertainment**: Movies, Cricket, Badminton, Clubs, Stand Up (₹2,000 budget)
- **Productivity**: Apps, Chat GPT, Software, Notion, Calendars (₹2,000 budget)
- **Work**: Desk Setup (₹3,000 budget)
- **Miscellaneous**: One-time expenses (no budget set)

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd personal-finance-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (not recommended)

## Usage

### Dashboard
- View your overall financial summary at a glance
- Analyze spending patterns with interactive charts
- Monitor budget progress across all categories

### Adding Expenses
1. Navigate to the "Expense Tracker" tab
2. Click "Add Expense" button
3. Fill in the details:
   - **Date**: Select the expense date
   - **Category**: Choose from predefined categories
   - **Description**: Enter a detailed description
   - **Paid By**: Select who paid (Me, Eshwar, Other)
   - **Amount**: Enter the amount in Indian Rupees
4. Click "Add" to save the expense

### Managing Budgets
1. Go to the "Budget Manager" tab
2. Click the edit icon next to any category
3. Modify the category name, description, or budget amount
4. Click the save icon to update

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Material-UI (MUI)** - Beautiful, responsive UI components
- **Recharts** - Interactive charts and data visualization
- **date-fns** - Modern date utility library

## Data Persistence

Currently, the app uses sample data stored in memory. For production use, you would want to:

1. **Add a backend API** (Node.js/Express, Python/Django, etc.)
2. **Implement a database** (PostgreSQL, MongoDB, etc.)
3. **Add user authentication** for multi-user support
4. **Implement data export** to CSV/Excel formats

## Customization

### Adding New Categories
Edit `src/data/sampleData.ts` to add new expense categories:

```typescript
{
  id: 'new-category',
  name: 'New Category',
  description: 'Description of the category',
  budget: 1000 // Set to null for no budget
}
```

### Modifying the Theme
Update the theme in `src/App.tsx` to change colors and styling:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#your-color-here',
    },
    // ... other theme options
  },
});
```

## Future Enhancements

- [ ] **Data Import/Export**: Import from Google Sheets, export to Excel
- [ ] **Multiple Months**: Track expenses across different months
- [ ] **Investment Tracking**: Add investment portfolio management
- [ ] **Goal Setting**: Set financial goals and track progress
- [ ] **Notifications**: Budget alerts and reminders
- [ ] **Mobile App**: React Native version for mobile devices
- [ ] **Data Backup**: Cloud storage integration
- [ ] **Multi-currency**: Support for different currencies
- [ ] **Receipt Upload**: Photo upload and OCR for receipts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.

---

**Note**: This app is designed specifically for tracking personal finances in Indian Rupees (₹) and is based on your existing Google Sheets structure. The sample data includes your April 2024 expenses for demonstration purposes.
