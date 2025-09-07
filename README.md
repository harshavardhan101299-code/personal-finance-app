# Harsha's Personal Finance App

A comprehensive personal finance management application built with React, TypeScript, and Material-UI. This app helps you track expenses, manage budgets, set financial goals, and stay on top of your bills.

## ✨ Features

### 🎯 Core Features
- **Expense Tracking**: Add, edit, and categorize expenses with detailed descriptions
- **Budget Management**: Set budgets for different categories and track spending progress
- **Financial Goals**: Set savings targets, investment goals, and track progress
- **Bill Management**: Track bills, due dates, and payment status with reminders
- **Data Import/Export**: Upload CSV files and export your financial data

### 📊 Enhanced Dashboard
- **Real-time Analytics**: Visual charts showing spending patterns and trends
- **Income vs Expenses**: Track your net savings and budget utilization
- **Recent Transactions**: Quick view of your latest financial activities
- **Upcoming Bills**: Never miss a payment with upcoming bill reminders
- **Goals Progress**: Monitor your financial goals and achievements

### 🚀 Smart Features
- **Auto-categorization**: Intelligent expense categorization based on descriptions
- **Quick Add**: Fast expense entry with smart suggestions and quick actions
- **Cross-tab Sync**: Real-time synchronization across multiple browser tabs
- **Cloud Sync**: Google Drive integration for data backup and cross-device access
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Material-UI
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date manipulation
- **Storage**: LocalStorage for data persistence
- **Styling**: CSS Grid, Flexbox, and Material-UI theming

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-finance-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up Google OAuth for cloud sync (optional):
```bash
npm run setup-env
```
Follow the instructions to configure your Google Client ID and API Key.

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Quick Add Feature
Access the quick add form at `/quick-add.html` for fast expense entry with:
- Smart auto-categorization
- Quick amount buttons
- Description suggestions
- Mobile-friendly interface

## 📱 App Structure

### Navigation Tabs
1. **Dashboard**: Overview with charts and key metrics
2. **Expenses**: Detailed expense tracking and management
3. **Income**: Income tracking and management
4. **Budget**: Budget setting and monitoring
5. **Goals**: Financial goals and progress tracking
6. **Bills**: Bill management and payment tracking
7. **Upload**: Data import functionality
8. **Cloud Sync**: Google Drive integration for data backup

### Key Components
- `Dashboard.tsx`: Main dashboard with analytics and metrics
- `ExpenseTracker.tsx`: Expense management interface
- `BudgetManager.tsx`: Budget planning and monitoring
- `FinancialGoals.tsx`: Goal setting and progress tracking
- `BillManager.tsx`: Bill management and reminders
- `DataUpload.tsx`: CSV import functionality

## 📊 Data Structure

### Expense Entry
```typescript
interface ExpenseEntry {
  id: string;
  date: string;
  type: string;
  description: string;
  paidBy: string;
  amount: number;
  tags?: string[];
  receipt?: string;
  recurring?: boolean;
}
```

### Financial Goal
```typescript
interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'savings' | 'investment' | 'purchase' | 'debt-payoff';
  description?: string;
  color?: string;
  icon?: string;
}
```

### Bill
```typescript
interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  reminderDays?: number;
}
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Navy Blue (#1a237e)
- **Secondary**: Orange (#ff6f00)
- **Success**: Green (#2e7d32)
- **Warning**: Orange (#ff9800)
- **Error**: Red (#d32f2f)

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements
- Optimized for both desktop and mobile use

## 📈 Analytics & Reporting

### Dashboard Metrics
- Total income and expenses
- Net savings calculation
- Budget utilization percentage
- Top spending categories
- Recent transaction history

### Visualizations
- Pie charts for expense categories
- Bar charts for spending trends
- Progress bars for budget and goals
- Color-coded status indicators

## 🔧 Customization

### Adding New Categories
Edit `src/data/sampleData.ts` to add new expense categories:
```typescript
export const expenseCategories: ExpenseCategory[] = [
  {
    name: "New Category",
    budget: 1000,
    description: "Description of the category"
  }
];
```

### Modifying Auto-categorization
Update the category rules in `public/quick-add.html`:
```javascript
const categoryRules = {
  'keyword': 'Category Name',
  // Add more rules here
};
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on git push

## 🔒 Data Privacy

- All data is stored locally in your browser's localStorage
- Optional cloud sync to Google Drive (your private folder)
- No data is sent to external servers except for cloud backup
- Your financial information stays private and secure
- Export your data anytime for backup

## ☁️ Cloud Sync Setup

For Google Drive integration, see the detailed setup guide:
- [Cloud Sync Setup Guide](CLOUD_SYNC_SETUP.md)
- [Google OAuth Setup Guide](GOOGLE_OAUTH_SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by modern personal finance apps
- Built with best practices from the React ecosystem
- Enhanced with insights from comprehensive finance app development guides

---

**Built with ❤️ for better financial management**

<!-- Updated for Google OAuth production deployment - Environment variables configured -->
