import { AppError } from '../types/errors.js'
import type { BudgetInput } from '../types/api.js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/
const BUDGET_FIELDS = ['amount', 'categoryId', 'month']

function invalid(message: string): never {
  throw new AppError(400, 'VALIDATION_ERROR', message)
}

export function validateBudgetInput(body: unknown): BudgetInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) invalid('request body must be a JSON object')
  const input = body as Record<string, unknown>
  const unknownField = Object.keys(input).find((field) => !BUDGET_FIELDS.includes(field))
  if (unknownField) invalid(`unexpected field: ${unknownField}`)
  if (typeof input.amount !== 'number' || !Number.isFinite(input.amount) || input.amount <= 0 || input.amount > 9999999999.99) invalid('amount must be a positive number no greater than 9999999999.99')
  if (Math.round(input.amount * 100) !== input.amount * 100) invalid('amount must have no more than two decimal places')
  if (typeof input.categoryId !== 'string' || !UUID_PATTERN.test(input.categoryId)) invalid('categoryId must be a valid UUID')
  if (typeof input.month !== 'string' || !MONTH_PATTERN.test(input.month)) invalid('month must use the YYYY-MM format')
  return { amount: input.amount, categoryId: input.categoryId, month: input.month }
}

export function validateBudgetId(value: string): string {
  if (!UUID_PATTERN.test(value)) throw new AppError(400, 'INVALID_ID', 'Budget id must be a valid UUID')
  return value
}