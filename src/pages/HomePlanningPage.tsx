import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
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

type FormValues = {
  city: string
  plotWidthFt: string
  plotLengthFt: string
  builtUpAreaSqft: string
  floors: string
  bedrooms: string
  budgetInr: string
}

const emptyForm: FormValues = {
  city: '',
  plotWidthFt: '',
  plotLengthFt: '',
  builtUpAreaSqft: '',
  floors: '1',
  bedrooms: '2',
  budgetInr: '',
}

const apiPrefix = import.meta.env.VITE_API_URL || '/api'

function numberValue(value: string) {
  return value.trim() === '' ? NaN : Number(value)
}

export default function HomePlanningPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormValues>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const plotArea = useMemo(() => numberValue(form.plotWidthFt) * numberValue(form.plotLengthFt), [form.plotWidthFt, form.plotLengthFt])

  useEffect(() => {
    let active = true
    fetch(`${apiPrefix}/home-profile`, { credentials: 'include' })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({})) as { profile?: HomeProfile | null; error?: string }
        if (!response.ok) throw new Error(payload.error || 'Could not load your saved home details.')
        if (active && payload.profile) {
          setForm({
            city: payload.profile.city,
            plotWidthFt: String(payload.profile.plotWidthFt),
            plotLengthFt: String(payload.profile.plotLengthFt),
            builtUpAreaSqft: String(payload.profile.builtUpAreaSqft),
            floors: String(payload.profile.floors),
            bedrooms: String(payload.profile.bedrooms),
            budgetInr: payload.profile.budgetInr === null ? '' : String(payload.profile.budgetInr),
          })
        }
      })
      .catch((requestError) => { if (active) setError(requestError instanceof Error ? requestError.message : 'Could not load your saved details.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const payload = {
      city: form.city.trim(),
      plotWidthFt: numberValue(form.plotWidthFt),
      plotLengthFt: numberValue(form.plotLengthFt),
      builtUpAreaSqft: numberValue(form.builtUpAreaSqft),
      floors: Number(form.floors),
      bedrooms: Number(form.bedrooms),
      budgetInr: form.budgetInr.trim() ? Number(form.budgetInr) : null,
    }
    try {
      const response = await fetch(`${apiPrefix}/home-profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json().catch(() => ({})) as { error?: string }
      if (!response.ok) throw new Error(result.error || 'We could not save your details. Please try again.')
      navigate('/plan/overview')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'We could not save your details. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-68px)] bg-brand-canvas px-4 py-8 sm:px-7 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3 text-xs font-semibold text-brand-teal"><span className="flex size-8 items-center justify-center rounded-full bg-brand-green text-white">1</span><span>YOUR HOME PROFILE</span><span className="h-px flex-1 bg-brand-line" /><span className="text-slate-400">NEXT: PLANNING SUMMARY</span></div>
        <section className="rounded-3xl border border-brand-line bg-white p-5 shadow-card sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-green-dark">Let's start with the basics</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">Tell us about your home plans.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">A few details help us shape your planning workspace. Use approximate measurements if you are still exploring.</p>
          <p className="mt-4 rounded-xl bg-brand-canvas px-4 py-3 text-xs leading-5 text-slate-600">Your details are saved to your GharSathi account. Dimensions are for planning conversations and are not construction drawings.</p>

          {loading ? <p className="py-12 text-center text-sm text-slate-500">Loading your saved details…</p> : <form className="mt-7 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="home-city" className="mb-1.5 block text-sm font-semibold text-brand-ink">City or town</label>
              <input id="home-city" autoComplete="address-level2" required minLength={2} maxLength={120} placeholder="For example, Mysuru" value={form.city} onChange={(event) => update('city', event.target.value)} className="h-12 w-full rounded-xl border border-brand-line px-4 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15" />
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-brand-ink">Plot dimensions <span className="font-normal text-slate-500">(feet)</span></legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="plot-width" className="mb-1.5 block text-xs font-medium text-slate-600">Width</label><input id="plot-width" type="number" inputMode="decimal" min="1" max="10000" step="0.5" required value={form.plotWidthFt} onChange={(event) => update('plotWidthFt', event.target.value)} className="h-12 w-full rounded-xl border border-brand-line px-4 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15" /></div>
                <div><label htmlFor="plot-length" className="mb-1.5 block text-xs font-medium text-slate-600">Length</label><input id="plot-length" type="number" inputMode="decimal" min="1" max="10000" step="0.5" required value={form.plotLengthFt} onChange={(event) => update('plotLengthFt', event.target.value)} className="h-12 w-full rounded-xl border border-brand-line px-4 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15" /></div>
              </div>
              {Number.isFinite(plotArea) && plotArea > 0 && <p className="mt-2 text-xs text-brand-teal">Approximate plot area: <strong>{Math.round(plotArea).toLocaleString('en-IN')} sq ft</strong></p>}
            </fieldset>
            <div>
              <label htmlFor="built-up-area" className="mb-1.5 block text-sm font-semibold text-brand-ink">Planned built-up area <span className="font-normal text-slate-500">(sq ft)</span></label>
              <input id="built-up-area" type="number" inputMode="numeric" min="1" max="250000" step="50" required value={form.builtUpAreaSqft} onChange={(event) => update('builtUpAreaSqft', event.target.value)} className="h-12 w-full rounded-xl border border-brand-line px-4 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="home-floors" className="mb-1.5 block text-sm font-semibold text-brand-ink">Number of floors</label><select id="home-floors" value={form.floors} onChange={(event) => update('floors', event.target.value)} className="h-12 w-full rounded-xl border border-brand-line bg-white px-4 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15">{[1, 2, 3, 4, 5].map((number) => <option key={number} value={number}>{number} {number === 1 ? 'floor' : 'floors'}</option>)}</select></div>
              <div><label htmlFor="home-bedrooms" className="mb-1.5 block text-sm font-semibold text-brand-ink">Bedrooms you have in mind</label><select id="home-bedrooms" value={form.bedrooms} onChange={(event) => update('bedrooms', event.target.value)} className="h-12 w-full rounded-xl border border-brand-line bg-white px-4 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15">{[1, 2, 3, 4, 5, 6, 7, 8].map((number) => <option key={number} value={number}>{number} {number === 1 ? 'bedroom' : 'bedrooms'}</option>)}</select></div>
            </div>
            <div>
              <label htmlFor="home-budget" className="mb-1.5 block text-sm font-semibold text-brand-ink">Comfortable construction budget <span className="font-normal text-slate-500">(optional, ₹)</span></label>
              <input id="home-budget" type="number" inputMode="numeric" min="100000" max="1000000000" step="50000" placeholder="Leave blank if you are still deciding" value={form.budgetInr} onChange={(event) => update('budgetInr', event.target.value)} className="h-12 w-full rounded-xl border border-brand-line px-4 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15" />
              <p className="mt-1.5 text-xs leading-5 text-slate-500">This is your planning range, not a construction quote or verified local rate.</p>
            </div>
            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
            <div className="flex flex-col-reverse gap-3 border-t border-brand-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-xs leading-5 text-slate-500">You can change these details later. A qualified local professional should review site-specific plans.</p>
              <Button size="lg" disabled={submitting}>{submitting ? 'Saving your profile…' : 'Save and continue'}</Button>
            </div>
          </form>}
        </section>
      </div>
    </main>
  )
}
