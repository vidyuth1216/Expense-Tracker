export type ExpenseCategory = string

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
  createdAt?: string
  updatedAt?: string
}

export type IncomeInput = Omit<Income, 'id'>

export type DashboardExpenseBreakdown = {
  categoryId: string
  category: string
  amount: number
  percentage: number
}

export type DashboardData = {
  month: string
  totalIncome: number
  totalExpenses: number
  remainingBalance: number
  savingsRate: number
  expenseBreakdown: DashboardExpenseBreakdown[]
  sixMonthHistory: { month: string; amount: number }[]
  recentExpenses: Expense[]
}

export type Budget = {
  id: string
  amount: number
  categoryId: string
  category: string
  month: string
  spent: number
  remaining: number
  progressPercentage: number
  isOverBudget: boolean
  createdAt: string
  updatedAt: string
}

export type BudgetInput = Pick<Budget, 'amount' | 'categoryId' | 'month'>
