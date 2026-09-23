import { AppError } from '../types/errors.js'

const MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/

export function validateDashboardMonth(value: unknown): string {
  if (typeof value !== 'string' || !MONTH_PATTERN.test(value)) {
    throw new AppError(400, 'INVALID_MONTH', 'month must use the YYYY-MM format')
  }

  return value
}

export function monthRange(month: string): { start: Date; end: Date } {
  const [year, monthNumber] = month.split('-').map(Number)
  return {
    start: new Date(Date.UTC(year, monthNumber - 1, 1)),
    end: new Date(Date.UTC(year, monthNumber, 1)),
  }
}