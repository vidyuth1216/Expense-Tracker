import type { Request, Response } from 'express'
import { budgetService } from '../services/budgetService.js'
import { validateBudgetId, validateBudgetInput } from '../validators/budget.js'

const userId = (request: Request) => request.userId as string
const budgetId = (request: Request) => validateBudgetId(typeof request.params.id === 'string' ? request.params.id : '')

export async function listBudgets(request: Request, response: Response): Promise<void> {
  response.json({ data: await budgetService.list(userId(request), typeof request.query.month === 'string' ? request.query.month : undefined) })
}

export async function getBudget(request: Request, response: Response): Promise<void> {
  response.json({ data: await budgetService.get(budgetId(request), userId(request)) })
}

export async function createBudget(request: Request, response: Response): Promise<void> {
  response.status(201).json({ data: await budgetService.create(validateBudgetInput(request.body), userId(request)) })
}

export async function updateBudget(request: Request, response: Response): Promise<void> {
  response.json({ data: await budgetService.update(budgetId(request), validateBudgetInput(request.body), userId(request)) })
}

export async function deleteBudget(request: Request, response: Response): Promise<void> {
  const id = budgetId(request)
  await budgetService.remove(id, userId(request))
  response.json({ data: { id, deleted: true } })
}