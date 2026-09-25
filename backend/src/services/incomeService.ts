import { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma.js'
import type { IncomeInput, IncomeResponse } from '../types/api.js'
import { AppError } from '../types/errors.js'

function toResponse(income: { id: string; amount: Prisma.Decimal; source: string; date: Date; description: string | null; createdAt: Date; updatedAt?: Date }): IncomeResponse {
  return { id: income.id, amount: income.amount.toNumber(), source: income.source, date: income.date.toISOString().slice(0, 10), description: income.description, createdAt: income.createdAt.toISOString(), updatedAt: (income.updatedAt ?? income.createdAt).toISOString() }
}

export const incomeService = {
  async list(userId: string): Promise<IncomeResponse[]> {
    const incomes = await prisma.income.findMany({ where: { userId }, orderBy: [{ date: 'desc' }, { createdAt: 'desc' }] })
    return incomes.map(toResponse)
  },
  async get(id: string, userId: string): Promise<IncomeResponse> {
    const income = await prisma.income.findFirst({ where: { id, userId } })
    if (!income) throw new AppError(404, 'INCOME_NOT_FOUND', 'Income not found')
    return toResponse(income)
  },
  async create(input: IncomeInput, userId: string): Promise<IncomeResponse> {
    const income = await prisma.income.create({ data: { ...input, userId, date: new Date(`${input.date}T00:00:00.000Z`) } })
    return toResponse(income)
  },
  async update(id: string, input: IncomeInput, userId: string): Promise<IncomeResponse> {
    const result = await prisma.income.updateMany({ where: { id, userId }, data: { ...input, date: new Date(`${input.date}T00:00:00.000Z`) } })
    if (result.count === 0) throw new AppError(404, 'INCOME_NOT_FOUND', 'Income not found')
    return this.get(id, userId)
  },
  async remove(id: string, userId: string): Promise<void> {
    const result = await prisma.income.deleteMany({ where: { id, userId } })
    if (result.count === 0) throw new AppError(404, 'INCOME_NOT_FOUND', 'Income not found')
  },
}