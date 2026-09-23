import { api } from './api'
import type { Expense, ExpenseInput } from '../types/finance'

type ExpenseApiRecord = Omit<Expense, 'category'>
type ApiResponse<T> = { data: T }

export async function getExpenses(): Promise<Expense[]> {
  const response = await api.get<ApiResponse<ExpenseApiRecord[]>>('/api/expenses')
  return response.data.data.map(withCategoryLabel)
}

export async function createExpense(expense: ExpenseInput): Promise<Expense> {
  const response = await api.post<ApiResponse<ExpenseApiRecord>>('/api/expenses', toApiInput(expense))
  return withCategoryLabel(response.data.data)
}

export async function updateExpense(id: string, expense: ExpenseInput): Promise<Expense> {
  const response = await api.put<ApiResponse<ExpenseApiRecord>>(`/api/expenses/${id}`, toApiInput(expense))
  return withCategoryLabel(response.data.data)
}

export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/api/expenses/${id}`)
}

function toApiInput(expense: ExpenseInput) {
  return {
    amount: expense.amount,
    categoryId: expense.categoryId,
    description: expense.description || null,
    paymentMethod: expense.paymentMethod,
    date: expense.date,
  }
}

function withCategoryLabel(expense: ExpenseApiRecord): Expense {
  const category = categoryOptions.find((option) => option.id === expense.categoryId)?.name ?? 'Other'
  return { ...expense, category }
}

export const categoryOptions = readCategoryOptions()

function readCategoryOptions() {
  const fallback = [
    ['Housing', '00000000-0000-4000-8000-000000000001'],
    ['Food', '00000000-0000-4000-8000-000000000002'],
    ['Transport', '00000000-0000-4000-8000-000000000003'],
    ['Shopping', '00000000-0000-4000-8000-000000000004'],
    ['Health', '00000000-0000-4000-8000-000000000005'],
    ['Entertainment', '00000000-0000-4000-8000-000000000006'],
  ] as const
  try {
    const configured = import.meta.env.VITE_CATEGORY_OPTIONS
    const values = configured ? JSON.parse(configured) as Record<string, string> : Object.fromEntries(fallback.map(([name, id]) => [name, id]))
    return Object.entries(values).map(([name, id]) => ({ name, id })) as typeof fallback extends never ? never : { id: string; name: Expense['category'] }[]
  } catch {
    return fallback.map(([name, id]) => ({ name, id })) as { id: string; name: Expense['category'] }[]
  }
}