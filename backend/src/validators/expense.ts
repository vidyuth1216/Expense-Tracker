import { AppError } from '../types/errors.js'
import type { ExpenseInput } from '../types/api.js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const EXPENSE_FIELDS = ['amount', 'categoryId', 'description', 'paymentMethod', 'date']

function invalid(message: string): never {
  throw new AppError(400, 'VALIDATION_ERROR', message)
}

function validateDate(value: unknown): string {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) {
    invalid('date must use the YYYY-MM-DD format')
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    invalid('date must be a valid calendar date')
  }

  return value
}

export function validateExpenseInput(body: unknown): ExpenseInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    invalid('request body must be a JSON object')
  }

  const input = body as Record<string, unknown>
  const unknownField = Object.keys(input).find((field) => !EXPENSE_FIELDS.includes(field))
  if (unknownField) {
    invalid(`unexpected field: ${unknownField}`)
  }

  if (typeof input.amount !== 'number' || !Number.isFinite(input.amount) || input.amount <= 0 || input.amount > 9999999999.99) {
    invalid('amount must be a positive number no greater than 9999999999.99')
  }

  if (Math.round(input.amount * 100) !== input.amount * 100) {
    invalid('amount must have no more than two decimal places')
  }

  if (typeof input.categoryId !== 'string' || !UUID_PATTERN.test(input.categoryId)) {
    invalid('categoryId must be a valid UUID')
  }

  if (input.description !== undefined && input.description !== null && (typeof input.description !== 'string' || input.description.length > 1000)) {
    invalid('description must be a string of at most 1000 characters')
  }

  if (typeof input.paymentMethod !== 'string' || input.paymentMethod.trim().length === 0 || input.paymentMethod.length > 100) {
    invalid('paymentMethod must be a non-empty string of at most 100 characters')
  }

  return {
    amount: input.amount,
    categoryId: input.categoryId,
    description: input.description === undefined ? null : input.description,
    paymentMethod: input.paymentMethod.trim(),
    date: validateDate(input.date),
  }
}

export function validateExpenseId(value: string): string {
  if (!UUID_PATTERN.test(value)) {
    throw new AppError(400, 'INVALID_ID', 'Expense id must be a valid UUID')
  }

  return value
}