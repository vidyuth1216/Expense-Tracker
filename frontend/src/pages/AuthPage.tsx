import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
  const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isLogin) await login(email, password)
      else await register(name, email, password)
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The request could not be completed.')
    } finally {
      setSubmitting(false)
    }
  }

  return <main className="grid min-h-screen place-items-center px-5 py-10 sm:px-8"><section className="w-full max-w-md">
    <div className="mb-10 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#d5f477] text-lg font-black text-[#151814]">e</div><span className="text-xl font-semibold tracking-tight">everyday<span className="text-[#d5f477]">.</span></span></div>
    <div className="rounded-2xl border border-white/10 bg-[#141a18]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8"><p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#62d4c9]">Personal finance workspace</p><h1 className="mb-2 text-3xl font-semibold">{isLogin ? 'Welcome back.' : 'Create your account.'}</h1><p className="mb-8 text-sm text-[#84908a]">{isLogin ? 'Sign in to pick up where you left off.' : 'Start making your money easier to understand.'}</p>
      {error && <div className="mb-5 rounded-xl border border-[#ff9b70]/30 bg-[#321e1a] px-4 py-3 text-sm text-[#ffb18f]" role="alert">{error}</div>}
      <form className="space-y-5" onSubmit={submit}>{!isLogin && <label className="field-label">Name<input className="field-input" onChange={(event) => setName(event.target.value)} required type="text" value={name} /></label>}<label className="field-label">Email<input autoComplete="email" className="field-input" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label><label className="field-label">Password<input autoComplete={isLogin ? 'current-password' : 'new-password'} className="field-input" minLength={8} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label><button className="w-full rounded-xl bg-[#d5f477] px-4 py-3 font-semibold text-[#151814] hover:bg-[#e1ff91] disabled:cursor-wait disabled:opacity-60" disabled={submitting} type="submit">{submitting ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}</button></form>
      <p className="mt-7 text-center text-sm text-[#84908a]">{isLogin ? 'New to everyday?' : 'Already have an account?'}{' '}<Link className="font-semibold text-[#d5f477] hover:text-white" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Sign in'}</Link></p>
    </div></section></main>
}