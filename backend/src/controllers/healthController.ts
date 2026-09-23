import type { Request, Response } from 'express'
import { healthService } from '../services/healthService.js'

export function getHealth(_request: Request, response: Response): void {
  response.json(healthService.getStatus())
}