import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/plan/setup" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      const destination = (location.state as { from?: string } | null)?.from
      navigate(destination?.startsWith('/plan') ? destination : '/plan/setup', { replace: true })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'We could not sign you in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-68px)] bg-brand-canvas px-4 py-8 sm:px-7 sm:py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-brand-line bg-white shadow-card lg:grid-cols-[1fr_.9fr]">
        <section className="p-6 sm:p-10 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-green-dark">Welcome back</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-ink">Sign in to your plans.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Pick up where you left off and keep your home details together.</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-brand-ink">Email address</label>
              <input id="login-email" autoComplete="email" type="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-xl border border-brand-line bg-white px-4 text-sm text-brand-ink outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15" />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-brand-ink">Password</label>
              <input id="login-password" autoComplete="current-password" type="password" required maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-brand-line bg-white px-4 text-sm text-brand-ink outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15" />
            </div>
            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
            <Button className="w-full" size="lg" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">New to GharSathi? <Link to="/register" className="font-bold text-brand-teal hover:underline">Create an account</Link></p>
          <p className="mt-5 text-center text-xs leading-5 text-slate-500">Your sign-in uses a secure, HTTP-only session cookie. Your password is never stored in your browser by GharSathi.</p>
        </section>
        <aside className="relative hidden min-h-[560px] bg-brand-teal lg:block">
          <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85" alt="A light-filled home opening onto a garden" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-teal/90 via-brand-teal/10 to-transparent" />
          <div className="absolute bottom-0 p-10 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Your Home Planning Partner</p>
            <p className="mt-3 max-w-sm font-display text-2xl font-bold leading-snug">A clearer plan, one thoughtful step at a time.</p>
          </div>
        </aside>
      </div>
    </main>
  )
}
