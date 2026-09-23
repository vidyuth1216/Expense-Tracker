import { getExpenses } from './expenseService'
import { getIncome } from './incomeService'

export async function getDashboardData() {
  const [expenses, incomes] = await Promise.all([getExpenses(), getIncome()])
  return { expenses, incomes }
}