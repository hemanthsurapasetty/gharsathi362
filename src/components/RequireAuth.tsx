import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <main className="grid min-h-[55vh] place-items-center px-5"><p className="text-sm text-slate-600">Checking your account…</p></main>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
