import { AppError } from '../types/errors.js'
import type { LoginInput, RegisterInput } from '../types/api.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function inputObject(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'request body must be a JSON object')
  }
  return body as Record<string, unknown>
}

function validateEmail(value: unknown): string {
  if (typeof value !== 'string' || value.length > 254 || !EMAIL_PATTERN.test(value)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'email must be a valid email address')
  }
  return value.trim().toLowerCase()
}

function validatePassword(value: unknown): string {
  if (typeof value !== 'string' || value.length < 8 || value.length > 72) {
    throw new AppError(400, 'VALIDATION_ERROR', 'password must be between 8 and 72 characters')
  }
  return value
}

export function validateRegisterInput(body: unknown): RegisterInput {
  const input = inputObject(body)
  if (typeof input.name !== 'string' || input.name.trim().length < 1 || input.name.length > 100) {
    throw new AppError(400, 'VALIDATION_ERROR', 'name must be between 1 and 100 characters')
  }
  return { name: input.name.trim(), email: validateEmail(input.email), password: validatePassword(input.password) }
}

export function validateLoginInput(body: unknown): LoginInput {
  const input = inputObject(body)
  return { email: validateEmail(input.email), password: validatePassword(input.password) }
}