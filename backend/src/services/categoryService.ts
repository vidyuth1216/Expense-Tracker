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
}