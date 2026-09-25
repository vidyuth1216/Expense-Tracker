import { AppError } from '../types/errors.js'
import type { CategoryInput } from '../types/api.js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function validateCategoryInput(body: unknown): CategoryInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'request body must be a JSON object')
  }
  const name = (body as { name?: unknown }).name
  if (typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 50) {
    throw new AppError(400, 'VALIDATION_ERROR', 'name must be between 1 and 50 characters')
  }
  return { name: name.trim() }
}

export function validateCategoryId(value: string): string {
  if (!UUID_PATTERN.test(value)) {
    throw new AppError(400, 'INVALID_ID', 'Category id must be a valid UUID')
  }

  return value
}