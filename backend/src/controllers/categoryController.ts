import type { Request, Response } from 'express'
import { categoryService } from '../services/categoryService.js'
import { validateCategoryId, validateCategoryInput } from '../validators/category.js'

function userId(request: Request): string {
  return request.userId as string
}

export async function listCategories(request: Request, response: Response): Promise<void> {
  response.json({ data: await categoryService.list(userId(request)) })
}

export async function createCategory(request: Request, response: Response): Promise<void> {
  const category = await categoryService.create(validateCategoryInput(request.body), userId(request))
  response.status(201).json({ data: category })
}

export async function deleteCategory(request: Request, response: Response): Promise<void> {
  const id = validateCategoryId(typeof request.params.id === 'string' ? request.params.id : '')
  await categoryService.remove(id, userId(request))
  response.json({ data: { id, deleted: true } })
}