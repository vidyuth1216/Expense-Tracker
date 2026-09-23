declare global {
  namespace Express {
    interface Request {
      userId?: string
      authUser?: {
        id: string
        name: string
        email: string
        currency: string
      }
    }
  }
}

export {}