import { api } from './api'
import type { AnalyticsData } from '../types/finance'

export async function getAnalytics(): Promise<AnalyticsData> {
  const response = await api.get<{ data: AnalyticsData }>('/api/analytics')
  return response.data.data
}