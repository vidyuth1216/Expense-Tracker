import { prisma } from '../config/prisma.js'
import type { AnalyticsResponse } from '../types/api.js'

const DAY_MS = 24 * 60 * 60 * 1000

function monthString(date: Date): string {
  return date.toISOString().slice(0, 7)
}

export const analyticsService = {
  async get(userId: string): Promise<AnalyticsResponse> {
    const now = new Date()
    const currentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    const start = new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() - 5, 1))
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))

    const [incomes, expenses] = await Promise.all([
      prisma.income.findMany({ where: { userId, date: { gte: start, lt: end } }, select: { amount: true, date: true } }),
      prisma.expense.findMany({ where: { userId, date: { gte: start, lt: end } }, select: { amount: true, date: true, category: { select: { name: true } } } }),
    ])

    const monthlyTotals = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + index, 1))
      const month = monthString(date)
      const income = incomes.reduce((total, record) => total + (monthString(record.date) === month ? record.amount.toNumber() : 0), 0)
      const monthlyExpenses = expenses.reduce((total, record) => total + (monthString(record.date) === month ? record.amount.toNumber() : 0), 0)
      return { month, income, expenses: monthlyExpenses, savings: income - monthlyExpenses }
    })

    const spendingByCategory = new Map<string, number>()
    let totalExpenses = 0
    for (const expense of expenses) {
      const amount = expense.amount.toNumber()
      totalExpenses += amount
      spendingByCategory.set(expense.category.name, (spendingByCategory.get(expense.category.name) ?? 0) + amount)
    }

    const categoryBreakdown = [...spendingByCategory]
      .map(([category, amount]) => ({ category, amount, percentage: totalExpenses === 0 ? 0 : Number(((amount / totalExpenses) * 100).toFixed(2)) }))
      .sort((left, right) => right.amount - left.amount)
    const elapsedDays = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start.getTime()) / DAY_MS) + 1

    return {
      monthlyTotals: monthlyTotals.map((month) => ({
        ...month,
        income: Number(month.income.toFixed(2)),
        expenses: Number(month.expenses.toFixed(2)),
        savings: Number(month.savings.toFixed(2)),
      })),
      categoryBreakdown,
      totalSpending: Number(totalExpenses.toFixed(2)),
      averageMonthlySpending: Number((totalExpenses / 6).toFixed(2)),
      averageDailySpending: Number((totalExpenses / elapsedDays).toFixed(2)),
      highestSpendingCategory: categoryBreakdown[0] ?? null,
    }
  },
}