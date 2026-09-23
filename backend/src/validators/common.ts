import type { RequestHandler } from 'express'

export const validateRequest: RequestHandler = (_request, _response, next) => {
  next()
}