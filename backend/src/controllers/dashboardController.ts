import type { Request, Response } from 'express'
import { dashboardService } from '../services/dashboardService.js'
import { validateDashboardPeriod } from '../validators/dashboard.js'

export async function getDashboard(request: Request, response: Response): Promise<void> {
  const period = validateDashboardPeriod(request.query.month, request.query.year)
  const dashboard = await dashboardService.get(request.userId as string, period)
  response.json({ data: dashboard })
}