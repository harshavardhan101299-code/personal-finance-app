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
