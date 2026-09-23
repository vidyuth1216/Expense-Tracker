import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export type ApiErrorResponse = {
  error?: { code?: string; message?: string }
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.error?.message ?? 'The request could not be completed.'
  }
  return 'The request could not be completed.'
}