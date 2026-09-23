import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Prisma } from '@prisma/client'
import { env } from '../config/env.js'
import { prisma } from '../config/prisma.js'
import type { AuthUser, LoginInput, RegisterInput } from '../types/api.js'
import { AppError } from '../types/errors.js'

const BCRYPT_ROUNDS = 12

function toAuthUser(user: { id: string; name: string; email: string; currency: string }): AuthUser {
  return { id: user.id, name: user.name, email: user.email, currency: user.currency }
}

export function createAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: '1h', issuer: 'expense-tracker-api', audience: 'expense-tracker-client' })
}

export function verifyAccessToken(token: string): string {
  try {
    const payload = jwt.verify(token, env.jwtSecret, { issuer: 'expense-tracker-api', audience: 'expense-tracker-client' })
    if (typeof payload === 'string' || typeof payload.sub !== 'string') throw new Error('Invalid token subject')
    return payload.sub
  } catch {
    throw new AppError(401, 'UNAUTHENTICATED', 'Authentication is required')
  }
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthUser> {
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS)
    try {
      const user = await prisma.user.create({
        data: { name: input.name, email: input.email, passwordHash },
        select: { id: true, name: true, email: true, currency: true },
      })
      return toAuthUser(user)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError(409, 'EMAIL_ALREADY_REGISTERED', 'An account with this email already exists')
      }
      throw error
    }
  },

  async login(input: LoginInput): Promise<{ user: AuthUser; token: string }> {
    const user = await prisma.user.findUnique({ where: { email: input.email } })
    const validPassword = user ? await bcrypt.compare(input.password, user.passwordHash) : false
    if (!user || !validPassword) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')
    }

    return { user: toAuthUser(user), token: createAccessToken(user.id) }
  },

  async getUser(userId: string): Promise<AuthUser> {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, currency: true } })
    if (!user) throw new AppError(401, 'UNAUTHENTICATED', 'Authentication is required')
    return toAuthUser(user)
  },
}