import { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma.js'
import type { ExpenseInput, ExpenseResponse } from '../types/api.js'
import { AppError } from '../types/errors.js'

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
    date: expense.date.toISOString().slice(0, 10),
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt.toISOString(),
  }
}

async function ensureCategoryBelongsToUser(categoryId: string, userId: string): Promise<void> {
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId }, select: { id: true } })
  if (!category) {
    throw new AppError(400, 'INVALID_CATEGORY_ID', 'categoryId does not identify a category for this user')
  }
}

export const expenseService = {
  async list(userId: string): Promise<ExpenseResponse[]> {
    const expenses = await prisma.expense.findMany({ where: { userId }, orderBy: [{ date: 'desc' }, { createdAt: 'desc' }] })
    return expenses.map(toExpenseResponse)
  },

  async get(id: string, userId: string): Promise<ExpenseResponse> {
    const expense = await prisma.expense.findFirst({ where: { id, userId } })
    if (!expense) {
      throw new AppError(404, 'EXPENSE_NOT_FOUND', 'Expense not found')
    }

    return toExpenseResponse(expense)
  },

  async create(input: ExpenseInput, userId: string): Promise<ExpenseResponse> {
    await ensureCategoryBelongsToUser(input.categoryId, userId)
    const expense = await prisma.expense.create({ data: { ...input, userId, date: new Date(`${input.date}T00:00:00.000Z`) } })
    return toExpenseResponse(expense)
  },

  async update(id: string, input: ExpenseInput, userId: string): Promise<ExpenseResponse> {
    await ensureCategoryBelongsToUser(input.categoryId, userId)
    const result = await prisma.expense.updateMany({
      where: { id, userId },
      data: { ...input, date: new Date(`${input.date}T00:00:00.000Z`) },
    })
    if (result.count === 0) {
      throw new AppError(404, 'EXPENSE_NOT_FOUND', 'Expense not found')
    }

    return this.get(id, userId)
  },

  async remove(id: string, userId: string): Promise<void> {
    const result = await prisma.expense.deleteMany({ where: { id, userId } })
    if (result.count === 0) {
      throw new AppError(404, 'EXPENSE_NOT_FOUND', 'Expense not found')
    }
  },
}