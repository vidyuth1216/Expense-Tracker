import { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma.js'
import type { BudgetInput, BudgetResponse } from '../types/api.js'
import { AppError } from '../types/errors.js'

function monthRange(month: string) {
  const [year, monthNumber] = month.split('-').map(Number)
  return { start: new Date(Date.UTC(year, monthNumber - 1, 1)), end: new Date(Date.UTC(year, monthNumber, 1)) }
}

function toResponse(budget: { id: string; amount: Prisma.Decimal; categoryId: string; month: string; category: { name: string }; createdAt: Date; updatedAt: Date }, spent: number): BudgetResponse {
  const amount = budget.amount.toNumber()
  return {
    id: budget.id,
    amount,
    categoryId: budget.categoryId,
    month: budget.month,
    category: budget.category.name,
    spent,
    remaining: Number((amount - spent).toFixed(2)),
    progressPercentage: amount === 0 ? 0 : Number(((spent / amount) * 100).toFixed(2)),
    isOverBudget: spent > amount,
    createdAt: budget.createdAt.toISOString(),
    updatedAt: budget.updatedAt.toISOString(),
  }
}

async function ensureCategoryBelongsToUser(categoryId: string, userId: string): Promise<void> {
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId }, select: { id: true } })
  if (!category) throw new AppError(400, 'INVALID_CATEGORY_ID', 'categoryId does not identify a category for this user')
}

export const budgetService = {
  async list(userId: string, month?: string): Promise<BudgetResponse[]> {
    const budgets = await prisma.budget.findMany({ where: { userId, ...(month ? { month } : {}) }, include: { category: { select: { name: true } } }, orderBy: [{ month: 'desc' }, { createdAt: 'desc' }] })
    if (!budgets.length) return []
    const expenses = await prisma.expense.findMany({ where: { userId, OR: Array.from(new Set(budgets.map((budget) => budget.month))).map((budgetMonth) => { const range = monthRange(budgetMonth); return { date: { gte: range.start, lt: range.end } } }) }, select: { categoryId: true, amount: true, date: true } })
    const spentByBudget = new Map<string, number>()
    for (const expense of expenses) {
      const expenseMonth = expense.date.toISOString().slice(0, 7)
      spentByBudget.set(`${expenseMonth}:${expense.categoryId}`, (spentByBudget.get(`${expenseMonth}:${expense.categoryId}`) ?? 0) + expense.amount.toNumber())
    }
    return budgets.map((budget) => toResponse(budget, Number((spentByBudget.get(`${budget.month}:${budget.categoryId}`) ?? 0).toFixed(2))))
  },

  async get(id: string, userId: string): Promise<BudgetResponse> {
    const budget = await prisma.budget.findFirst({ where: { id, userId }, include: { category: { select: { name: true } } } })
    if (!budget) throw new AppError(404, 'BUDGET_NOT_FOUND', 'Budget not found')
    const range = monthRange(budget.month)
    const aggregate = await prisma.expense.aggregate({ where: { userId, categoryId: budget.categoryId, date: { gte: range.start, lt: range.end } }, _sum: { amount: true } })
    return toResponse(budget, aggregate._sum.amount?.toNumber() ?? 0)
  },

  async create(input: BudgetInput, userId: string): Promise<BudgetResponse> {
    await ensureCategoryBelongsToUser(input.categoryId, userId)
    const budget = await prisma.budget.create({ data: { ...input, userId } })
    return this.get(budget.id, userId)
  },

  async update(id: string, input: BudgetInput, userId: string): Promise<BudgetResponse> {
    await ensureCategoryBelongsToUser(input.categoryId, userId)
    const result = await prisma.budget.updateMany({ where: { id, userId }, data: input })
    if (result.count === 0) throw new AppError(404, 'BUDGET_NOT_FOUND', 'Budget not found')
    return this.get(id, userId)
  },

  async remove(id: string, userId: string): Promise<void> {
    const result = await prisma.budget.deleteMany({ where: { id, userId } })
    if (result.count === 0) throw new AppError(404, 'BUDGET_NOT_FOUND', 'Budget not found')
  },
}