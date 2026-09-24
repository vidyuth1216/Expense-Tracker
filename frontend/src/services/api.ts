import axios from 'axios'

export const AUTH_TOKEN_KEY = 'expense-tracker-token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export type ApiErrorResponse = {
  error?: { code?: string; message?: string }
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.response?.status === 401) return 'Invalid credentials'
    return error.response?.data.error?.message ?? 'The request could not be completed.'
  }
  return 'The request could not be completed.'
}