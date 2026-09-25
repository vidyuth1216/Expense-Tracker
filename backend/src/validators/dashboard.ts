import { AppError } from '../types/errors.js'

const INTEGER_PATTERN = /^\d+$/

export function validateDashboardPeriod(monthValue: unknown, yearValue: unknown): { month: number; year: number; key: string } {
  if (typeof monthValue !== 'string' || !INTEGER_PATTERN.test(monthValue)) {
    throw new AppError(400, 'INVALID_MONTH', 'month must be a number from 1 to 12')
  }
  if (typeof yearValue !== 'string' || !INTEGER_PATTERN.test(yearValue)) {
    throw new AppError(400, 'INVALID_YEAR', 'year must be a four-digit number')
  }
  const month = Number(monthValue)
  const year = Number(yearValue)
  if (month < 1 || month > 12) throw new AppError(400, 'INVALID_MONTH', 'month must be a number from 1 to 12')
  if (year < 1000 || year > 9999) throw new AppError(400, 'INVALID_YEAR', 'year must be a four-digit number')
  return { month, year, key: `${year}-${String(month).padStart(2, '0')}` }
}

export function monthRange(month: number, year: number): { start: Date; end: Date } {
  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
  }
}