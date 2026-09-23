import type { RequestHandler } from 'express'
import { verifyAccessToken } from '../services/authService.js'
import { AppError } from '../types/errors.js'

export const AUTH_COOKIE = 'expense_tracker_token'

export const requireAuthentication: RequestHandler = (request, _response, next) => {
  const token = request.cookies?.[AUTH_COOKIE] as string | undefined
  if (!token) {
    next(new AppError(401, 'UNAUTHENTICATED', 'Authentication is required'))
    return
  }

  try {
    request.userId = verifyAccessToken(token)
    next()
  } catch (error) {
    next(error)
  }
}