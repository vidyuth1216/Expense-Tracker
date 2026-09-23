import type { Request, Response } from 'express'
import { incomeService } from '../services/incomeService.js'
import { validateIncomeId, validateIncomeInput } from '../validators/income.js'

const userId = (request: Request): string => request.userId as string
const incomeId = (request: Request): string => validateIncomeId(typeof request.params.id === 'string' ? request.params.id : '')

export async function listIncome(request: Request, response: Response): Promise<void> { response.json({ data: await incomeService.list(userId(request)) }) }
export async function getIncome(request: Request, response: Response): Promise<void> { response.json({ data: await incomeService.get(incomeId(request), userId(request)) }) }
export async function createIncome(request: Request, response: Response): Promise<void> { response.status(201).json({ data: await incomeService.create(validateIncomeInput(request.body), userId(request)) }) }
export async function updateIncome(request: Request, response: Response): Promise<void> { response.json({ data: await incomeService.update(incomeId(request), validateIncomeInput(request.body), userId(request)) }) }
export async function deleteIncome(request: Request, response: Response): Promise<void> { const id = incomeId(request); await incomeService.remove(id, userId(request)); response.json({ data: { id, deleted: true } }) }