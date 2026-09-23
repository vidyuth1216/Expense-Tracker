import { AppError } from '../types/errors.js'
import type { IncomeInput } from '../types/api.js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function invalid(message: string): never {
  throw new AppError(400, 'VALIDATION_ERROR', message)
}

function validateDate(value: unknown): string {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) invalid('date must use the YYYY-MM-DD format')
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) invalid('date must be a valid calendar date')
  return value
}

export function validateIncomeInput(body: unknown): IncomeInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) invalid('request body must be a JSON object')
  const input = body as Record<string, unknown>
  const fields = ['amount', 'source', 'date', 'description']
  const unknownField = Object.keys(input).find((field) => !fields.includes(field))
  if (unknownField) invalid(`unexpected field: ${unknownField}`)
  if (typeof input.amount !== 'number' || !Number.isFinite(input.amount) || input.amount <= 0 || input.amount > 9999999999.99) invalid('amount must be a positive number no greater than 9999999999.99')
  if (Math.round(input.amount * 100) !== input.amount * 100) invalid('amount must have no more than two decimal places')
  if (typeof input.source !== 'string' || input.source.trim().length === 0 || input.source.length > 100) invalid('source must be a non-empty string of at most 100 characters')
  if (input.description !== undefined && input.description !== null && (typeof input.description !== 'string' || input.description.length > 1000)) invalid('description must be a string of at most 1000 characters')
  return { amount: input.amount, source: input.source.trim(), date: validateDate(input.date), description: input.description === undefined ? null : input.description }
}

export function validateIncomeId(value: string): string {
  if (!UUID_PATTERN.test(value)) throw new AppError(400, 'INVALID_ID', 'Income id must be a valid UUID')
  return value
}