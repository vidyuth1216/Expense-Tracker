import type { Request, Response } from 'express'
import { analyticsService } from '../services/analyticsService.js'

export async function getAnalytics(request: Request, response: Response): Promise<void> {
  response.json({ data: await analyticsService.get(request.userId as string) })
}