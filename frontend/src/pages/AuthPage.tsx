import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button, Card, Input } from '../components/ui'
import { ThemeToggle } from '../components/ThemeToggle'

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login'
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const destination =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'The request could not be completed.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-4 py-12 text-[var(--color-text)] transition-colors sm:px-6">
      {/* Top-Right Theme Toggle */}
      <header className="absolute right-4 top-4 z-10 sm:right-8 sm:top-8">
        <ThemeToggle />
      </header>

      {/* Auth Card Container */}
      <section className="w-full max-w-md">
        <Card className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl backdrop-blur-sm sm:p-8">
          {/* Brand Wordmark */}
          <div className="mb-6 text-center">
            <span className="brand-wordmark text-4xl font-normal tracking-tight text-[var(--color-text)] select-none">
              everyday<span className="text-[var(--color-accent)]">.</span>
            </span>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Private Wealth Management
            </p>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text)]">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {isLogin
                ? 'Sign in to access your financial operating system.'
                : 'Start tracking your wealth and cash flow with clarity.'}
            </p>
          </div>

          {error && (
            <div
              className="mb-5 rounded-lg border border-[var(--color-negative)]/30 bg-[var(--color-negative)]/10 px-4 py-2.5 text-xs text-[var(--color-negative)]"
              role="alert"
            >
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={submit}>
            {!isLogin && (
              <Input
                autoComplete="name"
                label="Full name"
                onChange={(event) => setName(event.target.value)}
                placeholder="Alexander Wright"
                required
                type="text"
                value={name}
              />
            )}

            <Input
              autoComplete="email"
              label="Email address"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="alexander@domain.com"
              required
              type="email"
              value={email}
            />

            <Input
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              label="Password"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={password}
            />

            <div className="pt-2">
              <Button
                className="w-full"
                disabled={submitting}
                size="lg"
                type="submit"
                variant="primary"
              >
                {submitting ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
            {isLogin ? 'New to everyday?' : 'Already have an account?'}{' '}
            <Link
              className="font-medium text-[var(--color-accent)] hover:underline"
              to={isLogin ? '/register' : '/login'}
            >
              {isLogin ? 'Create an account' : 'Sign in'}
            </Link>
          </p>
        </Card>
      </section>
    </main>
  )
}