import { ExpenseCategory, ExpenseEntry } from '../types';

export const expenseCategories: ExpenseCategory[] = [
  {
    id: 'housing',
    name: 'Housing',
    description: 'Home Essentials',
    budget: null
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    description: 'Phone, LinkedIn, iCloud, Netflix, Spotify',
    budget: 1500
  },
  {
    id: 'groceries',
    name: 'Groceries',
    description: 'Ratnadeep, Ushodaya, Kirana Stores, Market',
    budget: 3000
  },
  {
    id: 'dining',
    name: 'Dining',
    description: 'Restaurants, Clubs, Zomato, Zepto, Swiggy',
    budget: 4000
  },
  {
    id: 'learning',
    name: 'Learning & Growth',
    description: 'Courses, Certifications, Fellowships, Books',
    budget: 500
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    description: 'Body Essentials, Gym, Medicines, Hair Cut, Clothes',
    budget: 1500
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Uber, Rapido, Ola, Fuel',
    budget: 4000
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Movies, Cricket, Badminton, Clubs, Stand Up',
    budget: 2000
  },
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Apps, Chat GPT, Software, Notion, Calendars',
    budget: 2000
  },
  {
    id: 'work',
    name: 'Work',
    description: 'Desk Setup',
    budget: 3000
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    description: 'One time expenses (e.g. gifts, random purchases)',
    budget: null
  }
];

export const aprilExpenses: ExpenseEntry[] = [
  {
    id: '1',
    date: '2024-04-12',
    type: 'Dining',
    description: 'This is it',
    paidBy: 'Me',
    amount: 1000
  },
  {
    id: '2',
    date: '2024-04-17',
    type: 'Dining',
    description: 'Snacks from Zepto',
    paidBy: 'Me',
    amount: 150
  },
  {
    id: '3',
    date: '2024-04-17',
    type: 'Dining',
    description: 'Fried rice, tea, and water',
    paidBy: 'Me',
    amount: 200
  },
  {
    id: '4',
    date: '2024-04-18',
    type: 'Dining',
    description: 'Biryani at Shah Ghouse',
    paidBy: 'Me',
    amount: 300
  },
  {
    id: '5',
    date: '2024-04-18',
    type: 'Entertainment',
    description: 'Cricket',
    paidBy: 'Me',
    amount: 500
  },
  {
    id: '6',
    date: '2024-04-19',
    type: 'Dining',
    description: 'Tea, biscuits, goli soda',
    paidBy: 'Me',
    amount: 80
  },
  {
    id: '7',
    date: '2024-04-19',
    type: 'Dining',
    description: 'Sugar Cane Juice',
    paidBy: 'Me',
    amount: 25
  },
  {
    id: '8',
    date: '2024-04-21',
    type: 'Shopping',
    description: 'Car charger',
    paidBy: 'Me',
    amount: 1200
  },
  {
    id: '9',
    date: '2024-04-21',
    type: 'Dining',
    description: 'Funnel Hill Creamery',
    paidBy: 'Me',
    amount: 799
  },
  {
    id: '10',
    date: '2024-04-23',
    type: 'Personal Care',
    description: 'Tablets for cold and mouth',
    paidBy: 'Me',
    amount: 34
  },
  {
    id: '11',
    date: '2024-04-23',
    type: 'Dining',
    description: 'Mirchi and Samosa',
    paidBy: 'Me',
    amount: 50
  },
  {
    id: '12',
    date: '2024-04-23',
    type: 'Dining',
    description: 'Tirupati ladoo from Samar',
    paidBy: 'Eshwar',
    amount: 100
  },
  {
    id: '13',
    date: '2024-04-24',
    type: 'Shopping',
    description: 'Silver Drip on Amazon',
    paidBy: 'Me',
    amount: 1324
  },
  {
    id: '14',
    date: '2024-04-24',
    type: 'Dining',
    description: 'Royal bakery',
    paidBy: 'Me',
    amount: 120
  },
  {
    id: '15',
    date: '2024-04-24',
    type: 'Dining',
    description: 'Water + Cake',
    paidBy: 'Me',
    amount: 80
  },
  {
    id: '16',
    date: '2024-04-24',
    type: 'Dining',
    description: 'Water',
    paidBy: 'Me',
    amount: 20
  },
  {
    id: '17',
    date: '2024-04-25',
    type: 'Dining',
    description: 'Prince Hotel',
    paidBy: 'Me',
    amount: 400
  },
  {
    id: '18',
    date: '2024-04-25',
    type: 'Dining',
    description: 'Suprabhat hotel tiffins',
    paidBy: 'Me',
    amount: 150
  },
  {
    id: '19',
    date: '2024-04-25',
    type: 'Subscriptions',
    description: 'Mobile recharge for Mom',
    paidBy: 'Me',
    amount: 1752
  },
  {
    id: '20',
    date: '2024-04-25',
    type: 'Dining',
    description: 'Coffee and snacks',
    paidBy: 'Me',
    amount: 200
  },
  {
    id: '21',
    date: '2024-04-25',
    type: 'Dining',
    description: 'Lunch at office',
    paidBy: 'Me',
    amount: 150
  },
  {
    id: '22',
    date: '2024-04-25',
    type: 'Dining',
    description: 'Evening snacks',
    paidBy: 'Me',
    amount: 100
  },
  {
    id: '23',
    date: '2024-04-25',
    type: 'Entertainment',
    description: 'Movie tickets',
    paidBy: 'Me',
    amount: 562
  },
  {
    id: '24',
    date: '2024-04-25',
    type: 'Travel',
    description: 'Uber ride',
    paidBy: 'Me',
    amount: 2625
  }
];

export const augustExpenses: ExpenseEntry[] = [
  // Dining expenses - Total: ₹6,426.02
  {
    id: 'aug-1',
    date: '2024-08-01',
    type: 'Dining',
    description: 'Lunch at office cafeteria',
    paidBy: 'Me',
    amount: 150
  },
  {
    id: 'aug-2',
    date: '2024-08-02',
    type: 'Dining',
    description: 'Dinner at restaurant',
    paidBy: 'Me',
    amount: 800
  },
  {
    id: 'aug-3',
    date: '2024-08-03',
    type: 'Dining',
    description: 'Coffee and snacks',
    paidBy: 'Me',
    amount: 200
  },
  {
    id: 'aug-4',
    date: '2024-08-05',
    type: 'Dining',
    description: 'Lunch with colleagues',
    paidBy: 'Me',
    amount: 450
  },
  {
    id: 'aug-5',
    date: '2024-08-07',
    type: 'Dining',
    description: 'Dinner at food court',
    paidBy: 'Me',
    amount: 350
  },
  {
    id: 'aug-6',
    date: '2024-08-08',
    type: 'Dining',
    description: 'Breakfast at hotel',
    paidBy: 'Me',
    amount: 300
  },
  {
    id: 'aug-7',
    date: '2024-08-10',
    type: 'Dining',
    description: 'Lunch at restaurant',
    paidBy: 'Me',
    amount: 600
  },
  {
    id: 'aug-8',
    date: '2024-08-12',
    type: 'Dining',
    description: 'Dinner delivery from Swiggy',
    paidBy: 'Me',
    amount: 400
  },
  {
    id: 'aug-9',
    date: '2024-08-14',
    type: 'Dining',
    description: 'Coffee and pastries',
    paidBy: 'Me',
    amount: 250
  },
  {
    id: 'aug-10',
    date: '2024-08-15',
    type: 'Dining',
    description: 'Lunch at office',
    paidBy: 'Me',
    amount: 180
  },
  {
    id: 'aug-11',
    date: '2024-08-17',
    type: 'Dining',
    description: 'Dinner at restaurant',
    paidBy: 'Me',
    amount: 750
  },
  {
    id: 'aug-12',
    date: '2024-08-19',
    type: 'Dining',
    description: 'Snacks from Zepto',
    paidBy: 'Me',
    amount: 120
  },
  {
    id: 'aug-13',
    date: '2024-08-21',
    type: 'Dining',
    description: 'Lunch at food court',
    paidBy: 'Me',
    amount: 280
  },
  {
    id: 'aug-14',
    date: '2024-08-23',
    type: 'Dining',
    description: 'Dinner at restaurant',
    paidBy: 'Me',
    amount: 650
  },
  {
    id: 'aug-15',
    date: '2024-08-25',
    type: 'Dining',
    description: 'Coffee and breakfast',
    paidBy: 'Me',
    amount: 220
  },
  {
    id: 'aug-16',
    date: '2024-08-27',
    type: 'Dining',
    description: 'Lunch at office',
    paidBy: 'Me',
    amount: 160
  },
  {
    id: 'aug-17',
    date: '2024-08-29',
    type: 'Dining',
    description: 'Dinner delivery from Zomato',
    paidBy: 'Me',
    amount: 380
  },
  {
    id: 'aug-18',
    date: '2024-08-31',
    type: 'Dining',
    description: 'End of month celebration dinner',
    paidBy: 'Me',
    amount: 1200
  },

  // Groceries expenses - Total: ₹1,188
  {
    id: 'aug-19',
    date: '2024-08-02',
    type: 'Groceries',
    description: 'Weekly groceries from Ratnadeep',
    paidBy: 'Me',
    amount: 450
  },
  {
    id: 'aug-20',
    date: '2024-08-09',
    type: 'Groceries',
    description: 'Groceries from Ushodaya',
    paidBy: 'Me',
    amount: 380
  },
  {
    id: 'aug-21',
    date: '2024-08-16',
    type: 'Groceries',
    description: 'Local kirana store items',
    paidBy: 'Me',
    amount: 200
  },
  {
    id: 'aug-22',
    date: '2024-08-23',
    type: 'Groceries',
    description: 'Market vegetables and fruits',
    paidBy: 'Me',
    amount: 158
  },

  // Personal Care expenses - Total: ₹2,618
  {
    id: 'aug-23',
    date: '2024-08-05',
    type: 'Personal Care',
    description: 'Hair cut and styling',
    paidBy: 'Me',
    amount: 500
  },
  {
    id: 'aug-24',
    date: '2024-08-08',
    type: 'Personal Care',
    description: 'Gym membership renewal',
    paidBy: 'Me',
    amount: 1200
  },
  {
    id: 'aug-25',
    date: '2024-08-12',
    type: 'Personal Care',
    description: 'Body essentials and toiletries',
    paidBy: 'Me',
    amount: 350
  },
  {
    id: 'aug-26',
    date: '2024-08-18',
    type: 'Personal Care',
    description: 'Medicines and health supplements',
    paidBy: 'Me',
    amount: 280
  },
  {
    id: 'aug-27',
    date: '2024-08-25',
    type: 'Personal Care',
    description: 'New clothes and accessories',
    paidBy: 'Me',
    amount: 288
  },

  // Subscriptions expenses - Total: ₹75
  {
    id: 'aug-28',
    date: '2024-08-01',
    type: 'Subscriptions',
    description: 'LinkedIn Premium subscription',
    paidBy: 'Me',
    amount: 75
  },

  // Miscellaneous expenses - Total: ₹32,524.44
  {
    id: 'aug-29',
    date: '2024-08-03',
    type: 'Miscellaneous',
    description: 'Gift for family member',
    paidBy: 'Me',
    amount: 2500
  },
  {
    id: 'aug-30',
    date: '2024-08-07',
    type: 'Miscellaneous',
    description: 'Electronics purchase',
    paidBy: 'Me',
    amount: 8500
  },
  {
    id: 'aug-31',
    date: '2024-08-10',
    type: 'Miscellaneous',
    description: 'Home improvement items',
    paidBy: 'Me',
    amount: 3200
  },
  {
    id: 'aug-32',
    date: '2024-08-14',
    type: 'Miscellaneous',
    description: 'Investment in stocks',
    paidBy: 'Me',
    amount: 15000
  },
  {
    id: 'aug-33',
    date: '2024-08-20',
    type: 'Miscellaneous',
    description: 'Charity donation',
    paidBy: 'Me',
    amount: 1000
  },
  {
    id: 'aug-34',
    date: '2024-08-26',
    type: 'Miscellaneous',
    description: 'One-time professional expense',
    paidBy: 'Me',
    amount: 2324.44
  }
];

// Combined expenses for all months
export const allExpenses: ExpenseEntry[] = [
  ...aprilExpenses,
  ...augustExpenses
];
