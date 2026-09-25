import { api } from './api'
import type { Budget, BudgetInput } from '../types/finance'

type ApiResponse<T> = { data: T }

export async function getBudgets(month?: string): Promise<Budget[]> {
  const response = await api.get<ApiResponse<Budget[]>>('/api/budgets', { params: month ? { month } : undefined })
  return response.data.data
}

export async function createBudget(input: BudgetInput): Promise<Budget> {
  const response = await api.post<ApiResponse<Budget>>('/api/budgets', input)
  return response.data.data
}

export async function updateBudget(id: string, input: BudgetInput): Promise<Budget> {
  const response = await api.put<ApiResponse<Budget>>(`/api/budgets/${id}`, input)
  return response.data.data
}

export async function deleteBudget(id: string): Promise<void> {
  await api.delete(`/api/budgets/${id}`)
}