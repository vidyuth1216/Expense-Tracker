import type { Request, Response } from 'express'
import { env } from '../config/env.js'
import { AUTH_COOKIE } from '../middleware/auth.js'
import { authService, createAccessToken } from '../services/authService.js'
import { validateLoginInput, validateRegisterInput } from '../validators/auth.js'

const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 1000,
  path: '/',
}

function setAuthCookie(response: Response, token: string): void {
  response.cookie(AUTH_COOKIE, token, cookieOptions)
}

export async function register(request: Request, response: Response): Promise<void> {
  const user = await authService.register(validateRegisterInput(request.body))
  setAuthCookie(response, createAccessToken(user.id))
  response.status(201).json({ data: { user } })
}

export async function login(request: Request, response: Response): Promise<void> {
  const result = await authService.login(validateLoginInput(request.body))
  setAuthCookie(response, result.token)
  response.json({ token: result.token, data: { user: result.user } })
}

export function logout(_request: Request, response: Response): void {
  response.clearCookie(AUTH_COOKIE, cookieOptions)
  response.json({ data: { loggedOut: true } })
}

export async function me(request: Request, response: Response): Promise<void> {
  const user = await authService.getUser(request.userId as string)
  response.json({ data: { user } })
}