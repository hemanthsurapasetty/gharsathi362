import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { useAuth } from '../contexts/AuthContext'

export default function RegisterPage() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
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
      await register(fullName, email, password)
      navigate('/plan/setup', { replace: true })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'We could not create your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-68px)] bg-brand-canvas px-4 py-8 sm:px-7 sm:py-12">
      <div className="mx-auto max-w-xl rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-green-dark">Your home journey</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-ink">Create your GharSathi account.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Your account keeps your home-planning details private and ready when you return.</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="register-name" className="mb-1.5 block text-sm font-semibold text-brand-ink">Your name</label>
            <input id="register-name" autoComplete="name" type="text" required minLength={2} maxLength={120} value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-12 w-full rounded-xl border border-brand-line px-4 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15" />
          </div>
          <div>
            <label htmlFor="register-email" className="mb-1.5 block text-sm font-semibold text-brand-ink">Email address</label>
            <input id="register-email" autoComplete="email" type="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-xl border border-brand-line px-4 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15" />
          </div>
          <div>
            <label htmlFor="register-password" className="mb-1.5 block text-sm font-semibold text-brand-ink">Create a password</label>
            <input id="register-password" autoComplete="new-password" type="password" required minLength={10} maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-brand-line px-4 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15" />
            <p className="mt-1.5 text-xs text-slate-500">Use at least 10 characters.</p>
          </div>
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          <Button className="w-full" size="lg" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-bold text-brand-teal hover:underline">Sign in</Link></p>
        <p className="mt-5 text-xs leading-5 text-slate-500">We collect your name and email to create your account. Home details are requested in the next step and can be updated later.</p>
      </div>
    </main>
  )
}
