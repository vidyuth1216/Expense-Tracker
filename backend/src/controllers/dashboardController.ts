import type { Request, Response } from 'express'
import { dashboardService } from '../services/dashboardService.js'
import { validateDashboardMonth } from '../validators/dashboard.js'

export async function getDashboard(request: Request, response: Response): Promise<void> {
  const month = validateDashboardMonth(request.query.month)
  const dashboard = await dashboardService.get(request.userId as string, month)
  response.json({ data: dashboard })
}