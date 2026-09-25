import { api } from './api'
import { getExpenses } from './expenseService'
import { getIncome } from './incomeService'
import type { DashboardData, Expense } from '../types/finance'

type DashboardApiRecord = Omit<DashboardData, 'recentExpenses'> & {
  recentExpenses: (Omit<Expense, 'description'> & { description: string | null })[]
}

export async function getDashboardData(month: string): Promise<DashboardData> {
  const [year, monthNumber] = month.split('-').map(Number)
  const response = await api.get<{ data: DashboardApiRecord }>('/api/dashboard', { params: { month: monthNumber, year } })
  return {
    ...response.data.data,
    recentExpenses: response.data.data.recentExpenses.map((expense) => ({ ...expense, description: expense.description ?? '' })),
  }
}

export async function getDashboardRecords() {
  const [expenses, incomes] = await Promise.all([getExpenses(), getIncome()])
  return { expenses, incomes }
}