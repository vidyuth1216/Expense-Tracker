import type { Expense, Income } from '../types/finance'

export const expenses: Expense[] = [
  { id: 'expense-1', date: '2024-09-18', description: 'Whole Foods Market', category: 'Food', amount: 86.42, paymentMethod: 'Visa •••• 4242' },
  { id: 'expense-2', date: '2024-09-17', description: 'Monthly apartment rent', category: 'Housing', amount: 1450, paymentMethod: 'Bank transfer' },
  { id: 'expense-3', date: '2024-09-15', description: 'Uber ride', category: 'Transport', amount: 24.8, paymentMethod: 'Visa •••• 4242' },
  { id: 'expense-4', date: '2024-09-12', description: 'New running shoes', category: 'Shopping', amount: 119.99, paymentMethod: 'Apple Pay' },
  { id: 'expense-5', date: '2024-09-09', description: 'Netflix subscription', category: 'Entertainment', amount: 15.49, paymentMethod: 'Visa •••• 4242' },
]

export const incomes: Income[] = [
  { id: 'income-1', date: '2024-09-01', source: 'Salary', amount: 5400, description: 'Monthly salary' },
  { id: 'income-2', date: '2024-09-05', source: 'Freelance', amount: 850, description: 'Website project' },
  { id: 'income-3', date: '2024-09-10', source: 'Business', amount: 125.4, description: 'Dividend payout' },
]

export const expenseBreakdown = [
  { label: 'Housing', value: 46, color: '#c9f36a' },
  { label: 'Food', value: 22, color: '#4ecdc4' },
  { label: 'Transport', value: 12, color: '#ffb86b' },
  { label: 'Shopping', value: 11, color: '#ff7a90' },
  { label: 'Other', value: 9, color: '#9693c9' },
]

export const monthlySpending = [
  { month: 'Apr', amount: 2680 },
  { month: 'May', amount: 3140 },
  { month: 'Jun', amount: 2860 },
  { month: 'Jul', amount: 3420 },
  { month: 'Aug', amount: 2980 },
  { month: 'Sep', amount: 1697 },
]
