import { api } from './api'
import type { CategoryOption } from '../types/finance'

type ApiResponse<T> = { data: T }

export async function getCategories(): Promise<CategoryOption[]> {
  const response = await api.get<ApiResponse<CategoryOption[]>>('/api/categories')
  return response.data.data
}

export async function createCategory(name: string): Promise<CategoryOption> {
  const response = await api.post<ApiResponse<CategoryOption>>('/api/categories', { name })
  return response.data.data
}