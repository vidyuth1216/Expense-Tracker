import type { ErrorRequestHandler } from 'express'
import { Prisma } from '@prisma/client'
import { AppError } from '../types/errors.js'

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error)

  if (response.headersSent) {
    return
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({ error: { code: error.code, message: error.message } })
    return
  }

  if (typeof error === 'object' && error !== null && 'type' in error && error.type === 'entity.parse.failed') {
    response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Request body must contain valid JSON' } })
    return
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    response.status(409).json({ error: { code: 'CONFLICT', message: 'The request conflicts with existing data' } })
    return
  }

  response.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' } })
}