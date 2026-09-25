import { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma.js'
import type { CategoryInput, CategoryResponse } from '../types/api.js'
import { AppError } from '../types/errors.js'

export const categoryService = {
  async list(userId: string): Promise<CategoryResponse[]> {
    return prisma.category.findMany({ where: { userId }, select: { id: true, name: true }, orderBy: { name: 'asc' } })
  },

  async create(input: CategoryInput, userId: string): Promise<CategoryResponse> {
    try {
      return await prisma.category.create({ data: { ...input, userId }, select: { id: true, name: true } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError(409, 'CATEGORY_ALREADY_EXISTS', 'A category with this name already exists')
      }
      throw error
    }
  },

  async remove(id: string, userId: string): Promise<void> {
    await prisma.$transaction(async (transaction) => {
      const category = await transaction.category.findFirst({ where: { id, userId }, select: { id: true, name: true } })
      if (!category) throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found')

      const expenseCount = await transaction.expense.count({ where: { userId, categoryId: id } })
      if (expenseCount > 0) {
        const fallbackName = category.name === 'Other' ? 'Other (uncategorized)' : 'Other'
        const fallback = await transaction.category.upsert({
          where: { userId_name: { userId, name: fallbackName } },
          update: {},
          create: { userId, name: fallbackName },
          select: { id: true },
        })
        await transaction.expense.updateMany({ where: { userId, categoryId: id }, data: { categoryId: fallback.id } })
      }

      await transaction.category.delete({ where: { id } })
    })
  },
}