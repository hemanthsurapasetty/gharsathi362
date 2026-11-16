import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '../components/ui/button'

interface HomeProfile {
  city: string
  plotWidthFt: number
  plotLengthFt: number
  builtUpAreaSqft: number
  floors: number
  bedrooms: number
  budgetInr: number | null
}

const apiPrefix = import.meta.env.VITE_API_URL || '/api'
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export default function PlanOverviewPage() {
  const [profile, setProfile] = useState<HomeProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetch(`${apiPrefix}/home-profile`, { credentials: 'include' })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({})) as { profile?: HomeProfile | null; error?: string }
        if (!response.ok) throw new Error(payload.error || 'Could not load your home profile.')
        if (active) setProfile(payload.profile || null)
      })
      .catch((requestError) => { if (active) setError(requestError instanceof Error ? requestError.message : 'Could not load your home profile.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  if (!loading && !error && !profile) return <Navigate to="/plan/setup" replace />

  return (
    <main className="min-h-[calc(100vh-68px)] bg-brand-canvas px-4 py-8 sm:px-7 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-green-dark">Your planning workspace</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">A clear start for your home.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">These are the details you shared. Use them as a starting brief when you explore your next planning steps.</p>
        {loading && <p className="mt-8 rounded-2xl bg-white p-6 text-sm text-slate-500">Loading your saved plan…</p>}
        {error && <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        {profile && <>
          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['City or town', profile.city],
              ['Plot size', `${profile.plotWidthFt} × ${profile.plotLengthFt} ft · ${(profile.plotWidthFt * profile.plotLengthFt).toLocaleString('en-IN')} sq ft`],
              ['Built-up area', `${profile.builtUpAreaSqft.toLocaleString('en-IN')} sq ft`],
              ['Floors', String(profile.floors)],
              ['Bedrooms', String(profile.bedrooms)],
              ['Comfortable budget', profile.budgetInr === null ? 'Not added' : inr.format(profile.budgetInr)],
            ].map(([label, value]) => <article key={label} className="rounded-2xl border border-brand-line bg-white p-5">
              <p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 font-display text-lg font-bold text-brand-ink">{value}</p>
            </article>)}
          </section>
          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-brand-teal p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="font-display text-lg font-bold">Simulate your home design</h2>
              <p className="mt-1 text-sm leading-6 text-white/80">View your plot with an interactive 2D floor plan layout, Vastu orientations, and live construction cost estimation.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <Button asChild className="bg-white text-brand-teal hover:bg-emerald-50 font-bold">
                <Link to="/simulate">Open Design Simulator →</Link>
              </Button>
              <Button asChild className="border border-white/40 bg-white/10 text-white hover:bg-white/20">
                <Link to="/plan/setup">Edit details</Link>
              </Button>
            </div>
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">Estimates and concepts are not professional construction advice. Site-specific design, structural safety, and approvals need qualified review.</p>
        </>}
      </div>
    </main>
  )
}
