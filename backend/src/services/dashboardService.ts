import { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma.js'
import type { DashboardResponse, ExpenseResponse } from '../types/api.js'
import { monthRange } from '../validators/dashboard.js'

function decimalToNumber(value: Prisma.Decimal | null | undefined): number {
  return value?.toNumber() ?? 0
}

function dateString(value: Date): string {
  return value.toISOString().slice(0, 10)
}

function monthString(value: Date): string {
  return value.toISOString().slice(0, 7)
}

function toExpenseResponse(expense: {
  id: string
  amount: Prisma.Decimal
  categoryId: string
  description: string | null
  paymentMethod: string
  date: Date
  createdAt: Date
  updatedAt: Date
}): ExpenseResponse {
  return {
    id: expense.id,
    amount: expense.amount.toNumber(),
    categoryId: expense.categoryId,
    description: expense.description,
    paymentMethod: expense.paymentMethod,
    date: dateString(expense.date),
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt.toISOString(),
  }
}

export const dashboardService = {
  async get(userId: string, month: string): Promise<DashboardResponse> {
    const { start, end } = monthRange(month)
    const firstMonth = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() - 4, 1))

    const [incomeAggregate, expenseAggregate, categoryGroups, categories, recentExpenses, chartExpenses] = await Promise.all([
      prisma.income.aggregate({ where: { userId, date: { gte: start, lt: end } }, _sum: { amount: true } }),
      prisma.expense.aggregate({ where: { userId, date: { gte: start, lt: end } }, _sum: { amount: true } }),
      prisma.expense.groupBy({
        by: ['categoryId'],
        where: { userId, date: { gte: start, lt: end } },
        _sum: { amount: true },
      }),
      prisma.category.findMany({ where: { userId }, select: { id: true, name: true } }),
      prisma.expense.findMany({
        where: { userId, date: { gte: start, lt: end } },
        include: { category: { select: { name: true } } },
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        take: 5,
      }),
      prisma.expense.findMany({
        where: { userId, date: { gte: firstMonth, lt: end } },
        select: { amount: true, date: true },
      }),
    ])

    const income = decimalToNumber(incomeAggregate._sum.amount)
    const expenses = decimalToNumber(expenseAggregate._sum.amount)
    const remaining = income - expenses
    const savingsRate = income === 0 ? 0 : Number(((remaining / income) * 100).toFixed(2))
    const categoryNames = new Map(categories.map((category) => [category.id, category.name]))

    const expenseByCategory = categoryGroups
      .map((group) => {
        const amount = decimalToNumber(group._sum.amount)
        return {
          categoryId: group.categoryId,
          category: categoryNames.get(group.categoryId) ?? 'Unknown',
          amount,
          percentage: expenses === 0 ? 0 : Number(((amount / expenses) * 100).toFixed(2)),
        }
      })
      .sort((left, right) => right.amount - left.amount)

    const monthlyTotals = new Map<string, number>()
    for (const expense of chartExpenses) {
      const key = monthString(expense.date)
      monthlyTotals.set(key, (monthlyTotals.get(key) ?? 0) + expense.amount.toNumber())
    }

    const monthlySpending = Array.from({ length: 5 }, (_, index) => {
      const date = new Date(Date.UTC(firstMonth.getUTCFullYear(), firstMonth.getUTCMonth() + index, 1))
      const key = monthString(date)
      return { month: key, amount: Number((monthlyTotals.get(key) ?? 0).toFixed(2)) }
    })

    return {
      month,
      income,
      expenses,
      remaining,
      savingsRate,
      expenseByCategory,
      recentExpenses: recentExpenses.map((expense) => ({
        ...toExpenseResponse(expense),
        category: categoryNames.get(expense.categoryId) ?? 'Unknown',
      })),
      monthlySpending,
    }
  },
}