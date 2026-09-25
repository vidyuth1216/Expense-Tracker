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

export type IncomeResponse = IncomeInput & {
  id: string
  createdAt: string
  updatedAt: string
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
  totalIncome: number
  totalExpenses: number
  remainingBalance: number
  savingsRate: number
  expenseBreakdown: DashboardExpenseCategory[]
  recentExpenses: DashboardRecentExpense[]
  sixMonthHistory: DashboardMonthlySpending[]
}

export type CategoryInput = {
  name: string
}

export type CategoryResponse = {
  id: string
  name: string
}

export type BudgetInput = {
  amount: number
  categoryId: string
  month: string
}

export type BudgetResponse = BudgetInput & {
  id: string
  category: string
  spent: number
  remaining: number
  progressPercentage: number
  isOverBudget: boolean
  createdAt: string
  updatedAt: string
}