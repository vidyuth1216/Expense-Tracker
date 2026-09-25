import { api } from './api'
import { getCategories } from './categoryService'
import type { Expense, ExpenseInput } from '../types/finance'

type ExpenseApiRecord = Omit<Expense, 'category'>
type ApiResponse<T> = { data: T }

export async function getExpenses(): Promise<Expense[]> {
  const [response, categories] = await Promise.all([
    api.get<ApiResponse<ExpenseApiRecord[]>>('/api/expenses'),
    getCategories(),
  ])
  return response.data.data.map((expense) => withCategoryLabel(expense, categories))
}

export async function createExpense(expense: ExpenseInput): Promise<Expense> {
  const response = await api.post<ApiResponse<ExpenseApiRecord>>('/api/expenses', toApiInput(expense))
  const categories = await getCategories()
  return withCategoryLabel(response.data.data, categories)
}

export async function updateExpense(id: string, expense: ExpenseInput): Promise<Expense> {
  const response = await api.put<ApiResponse<ExpenseApiRecord>>(`/api/expenses/${id}`, toApiInput(expense))
  const categories = await getCategories()
  return withCategoryLabel(response.data.data, categories)
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

function withCategoryLabel(expense: ExpenseApiRecord, categories: { id: string; name: string }[]): Expense {
  const category = categories.find((option) => option.id === expense.categoryId)?.name ?? 'Other'
  return { ...expense, category }
}
