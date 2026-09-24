import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, AUTH_TOKEN_KEY, getApiErrorMessage } from '../services/api'

export type AuthUser = { id: string; name: string; email: string; currency: string }

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem(AUTH_TOKEN_KEY)) {
      setLoading(false)
      return
    }
    api.get<{ data: { user: AuthUser } }>('/api/auth/me')
      .then((response) => setUser(response.data.data.user))
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{ token: string; data: { user: AuthUser } }>('/api/auth/login', { email, password })
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token)
      setUser(response.data.data.user)
    } catch (error) {
      throw new Error(getApiErrorMessage(error))
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      await api.post('/api/auth/register', { name, email, password })
      await login(email, password)
    } catch (error) {
      if (error instanceof Error) throw error
      throw new Error(getApiErrorMessage(error))
    }
  }

  const logout = async () => {
    try { await api.post('/api/auth/logout') } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}