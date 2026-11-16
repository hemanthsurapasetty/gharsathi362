import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface AuthUser {
  id: string
  fullName: string
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

interface AuthResponse {
  user: AuthUser
  error?: string
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const API_PREFIX = import.meta.env.VITE_API_URL || '/api'

async function authRequest(path: string, body?: Record<string, string>) {
  const response = await fetch(`${API_PREFIX}/auth${path}`, {
    method: body ? 'POST' : 'GET',
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const payload = await response.json().catch(() => ({})) as AuthResponse
  if (!response.ok) throw new Error(payload.error || 'We could not complete that request. Please try again.')
  return payload
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    authRequest('/me')
      .then((payload) => { if (active) setUser(payload.user) })
      .catch(() => { if (active) setUser(null) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const payload = await authRequest('/login', { email, password })
    setUser(payload.user)
  }, [])

  const register = useCallback(async (fullName: string, email: string, password: string) => {
    const payload = await authRequest('/register', { fullName, email, password })
    setUser(payload.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_PREFIX}/auth/logout`, { method: 'POST', credentials: 'include' })
    } catch {
      // Clear the signed-in view even if the API is temporarily unreachable.
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
