import type { Request, Response } from 'express'
import { expenseService } from '../services/expenseService.js'
import { validateExpenseId, validateExpenseInput } from '../validators/expense.js'

function userId(request: Request): string {
  return request.userId as string
}

function expenseId(request: Request): string {
  return validateExpenseId(typeof request.params.id === 'string' ? request.params.id : '')
}

export async function listExpenses(request: Request, response: Response): Promise<void> {
  response.json({ data: await expenseService.list(userId(request)) })
}

export async function getExpense(request: Request, response: Response): Promise<void> {
  const expense = await expenseService.get(expenseId(request), userId(request))
  response.json({ data: expense })
}

export async function createExpense(request: Request, response: Response): Promise<void> {
  const expense = await expenseService.create(validateExpenseInput(request.body), userId(request))
  response.status(201).json({ data: expense })
}

export async function updateExpense(request: Request, response: Response): Promise<void> {
  const expense = await expenseService.update(expenseId(request), validateExpenseInput(request.body), userId(request))
  response.json({ data: expense })
}

export async function deleteExpense(request: Request, response: Response): Promise<void> {
  const id = expenseId(request)
  await expenseService.remove(id, userId(request))
  response.json({ data: { id, deleted: true } })
}