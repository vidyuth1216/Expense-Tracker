export type ExpenseCategory = 'Housing' | 'Food' | 'Transport' | 'Shopping' | 'Health' | 'Entertainment' | 'Other'

export type CategoryOption = {
  id: string
  name: ExpenseCategory
}

export type Expense = {
  id: string
  date: string
  description: string
  categoryId: string
  category: ExpenseCategory
  amount: number
  paymentMethod: string
}

export type ExpenseInput = Omit<Expense, 'id' | 'category'> & { categoryId: string; category?: ExpenseCategory }

export const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount)

export type Income = {
  id: string
  date: string
  source: string
  amount: number
  description: string
}

export type IncomeInput = Omit<Income, 'id'>
