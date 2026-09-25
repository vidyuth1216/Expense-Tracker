import { api } from './api'
import type { Income, IncomeInput } from '../types/finance'

type ApiResponse<T> = { data: T }

export async function getIncome(): Promise<Income[]> {
  const response = await api.get<ApiResponse<Income[]>>('/api/income')
  return response.data.data
}

export async function createIncome(income: IncomeInput): Promise<Income> {
  const response = await api.post<ApiResponse<Income>>('/api/income', toApiInput(income))
  return response.data.data
}

export async function updateIncome(id: string, income: IncomeInput): Promise<Income> {
  const response = await api.put<ApiResponse<Income>>(`/api/income/${id}`, toApiInput(income))
  return response.data.data
}

export async function deleteIncome(id: string): Promise<void> {
  await api.delete(`/api/income/${id}`)
}

function toApiInput(income: IncomeInput) {
  return {
    amount: income.amount,
    source: income.source,
    description: income.description || null,
    date: income.date,
  }
}