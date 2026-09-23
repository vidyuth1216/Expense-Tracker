export type ExpenseInput = {
  amount: number
  categoryId: string
  description?: string | null
  paymentMethod: string
  date: string
}

export type ExpenseResponse = {
  id: string
  amount: number
  categoryId: string
  description: string | null
  paymentMethod: string
  date: string
  createdAt: string
  updatedAt: string
}

export type IncomeInput = {
  amount: number
  source: string
  date: string
  description?: string | null
}

export type RegisterInput = {
  name: string
  email: string
  password: string
}

export type LoginInput = {
  email: string
  password: string
}

export type AuthUser = {
  id: string
  name: string
  email: string
  currency: string
}

export type DashboardExpenseCategory = {
  categoryId: string
  category: string
  amount: number
  percentage: number
}

export type DashboardRecentExpense = ExpenseResponse & {
  category: string
}

export type DashboardMonthlySpending = {
  month: string
  amount: number
}

export type DashboardResponse = {
  month: string
  income: number
  expenses: number
  remaining: number
  savingsRate: number
  expenseByCategory: DashboardExpenseCategory[]
  recentExpenses: DashboardRecentExpense[]
  monthlySpending: DashboardMonthlySpending[]
}