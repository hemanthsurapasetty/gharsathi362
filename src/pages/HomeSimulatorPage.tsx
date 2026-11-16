import { useEffect, useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

interface Room {
  id: string
  name: string
  zone: string
  widthFt: number
  lengthFt: number
  xPct: number
  yPct: number
  wPct: number
  hPct: number
  vastu: string
  floor: number // 1: Ground, 2: First, 3: Second
  color: string
  features?: string[]
}

const PLOT_PRESETS = [
  { label: '30 × 40 ft (1,200 sq ft)', width: 30, length: 40 },
  { label: '30 × 50 ft (1,500 sq ft)', width: 30, length: 50 },
  { label: '40 × 60 ft (2,400 sq ft)', width: 40, length: 60 },
  { label: '20 × 30 ft (600 sq ft)', width: 20, length: 30 },
]

const QUALITY_RATES = {
  standard: { label: 'Standard', ratePerSqFt: 1650, desc: 'Solid concrete structure, 2x2 vitrified tiles, flush doors & standard CP fittings' },
  premium: { label: 'Premium', ratePerSqFt: 2100, desc: 'Teak main door, 4x2 polished tiles/granite, Jaquar fittings & weather-proof exterior' },
  luxury: { label: 'Luxury', ratePerSqFt: 2750, desc: 'Imported marble, soundproof UPVC, smart lighting, designer facade & premium sanitaryware' },
}

const apiPrefix = import.meta.env.VITE_API_URL || '/api'
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export default function HomeSimulatorPage() {
  const gradientId = useId()
  // Plot inputs
  const [plotWidth, setPlotWidth] = useState(30)
  const [plotLength, setPlotLength] = useState(40)
  const [floors, setFloors] = useState(2)
  const [bhk, setBhk] = useState(3)
  const [layoutStyle, setLayoutStyle] = useState<'vastu' | 'modern' | 'compact'>('vastu')
  const [quality, setQuality] = useState<'standard' | 'premium' | 'luxury'>('premium')
  
  // Feature options
  const [hasPooja, setHasPooja] = useState(true)
  const [hasParking, setHasParking] = useState(true)
  const [hasBalcony, setHasBalcony] = useState(true)

  // Visualizer controls
  const [activeFloor, setActiveFloor] = useState(1) // 1 = Ground, 2 = First
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'blueprint' | 'color'>('blueprint')

  // Auto-load profile if user is signed in
  useEffect(() => {
    let active = true
    fetch(`${apiPrefix}/home-profile`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.profile) return
        const p = data.profile
        if (p.plotWidthFt) setPlotWidth(p.plotWidthFt)
        if (p.plotLengthFt) setPlotLength(p.plotLengthFt)
        if (p.floors) setFloors(Math.min(3, Math.max(1, p.floors)))
        if (p.bedrooms) setBhk(Math.min(4, Math.max(1, p.bedrooms)))
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  // Derived calculations
  const plotAreaSqFt = plotWidth * plotLength
  
  // Setbacks in feet
  const frontSetback = Math.max(4, Math.round(plotLength * 0.12))
  const rearSetback = Math.max(3, Math.round(plotLength * 0.08))
  const sideSetback = Math.max(2.5, Math.round(plotWidth * 0.07))
  
  const buildableWidth = Math.max(15, plotWidth - (sideSetback * 2))
  const buildableLength = Math.max(20, plotLength - frontSetback - rearSetback)
  const groundFootprintSqFt = Math.round(buildableWidth * buildableLength)
  const totalBuiltUpSqFt = groundFootprintSqFt * floors
  const groundCoveragePct = Math.round((groundFootprintSqFt / plotAreaSqFt) * 100)
  const far = (totalBuiltUpSqFt / plotAreaSqFt).toFixed(2)

  // Cost estimates
  const baseCost = totalBuiltUpSqFt * QUALITY_RATES[quality].ratePerSqFt
  const civilCost = Math.round(baseCost * 0.46)
  const finishCost = Math.round(baseCost * 0.18)
  const plumbingElectricalCost = Math.round(baseCost * 0.15)
  const doorsWindowsCost = Math.round(baseCost * 0.11)
  const paintElevationCost = Math.round(baseCost * 0.10)
  const estimatedMonths = Math.min(18, Math.max(6, Math.round(5 + (floors * 2.5) + (totalBuiltUpSqFt / 1000))))

  // Generate responsive floor rooms
  const rooms: Room[] = useMemo(() => {
    const list: Room[] = []

    // --- GROUND FLOOR ---
    if (hasParking) {
      list.push({
        id: 'g-parking',
        name: 'Car Porch & Entry',
        zone: 'North-West (Vayu)',
        widthFt: Math.round(buildableWidth * 0.4),
        lengthFt: Math.round(buildableLength * 0.35),
        xPct: 5,
        yPct: 62,
        wPct: 38,
        hPct: 34,
        vastu: 'Good for vehicle movement and breezy circulation.',
        floor: 1,
        color: '#e2e8f0',
        features: ['Covered portico', 'Direct gate access'],
      })
    }

    list.push({
      id: 'g-living',
      name: 'Living Room',
      zone: 'North / North-East',
      widthFt: Math.round(buildableWidth * (hasParking ? 0.55 : 0.6)),
      lengthFt: Math.round(buildableLength * 0.42),
      xPct: hasParking ? 46 : 5,
      yPct: 55,
      wPct: hasParking ? 50 : 58,
      hPct: 41,
      vastu: 'North/East orientation welcomes natural light and positive family energy.',
      floor: 1,
      color: '#fef3c7',
      features: ['Sofa lounge setup', 'Ventilated bay windows', 'Main entrance foyer'],
    })

    list.push({
      id: 'g-dining',
      name: 'Dining & Staircase Foyer',
      zone: 'Brahmasthan / Central',
      widthFt: Math.round(buildableWidth * 0.5),
      lengthFt: Math.round(buildableLength * 0.32),
      xPct: 5,
      yPct: 26,
      wPct: 45,
      hPct: 33,
      vastu: 'Open core connects rooms smoothly with cross ventilation.',
      floor: 1,
      color: '#ede9fe',
      features: ['6-seater dining area', 'Under-stair store / shoe rack', 'Stairway to 1st Floor'],
    })

    list.push({
      id: 'g-kitchen',
      name: layoutStyle === 'vastu' ? 'Kitchen (Agni)' : 'Modern Kitchen & Utility',
      zone: 'South-East (Agni Corner)',
      widthFt: Math.round(buildableWidth * 0.42),
      lengthFt: Math.round(buildableLength * 0.32),
      xPct: 53,
      yPct: 26,
      wPct: 43,
      hPct: 33,
      vastu: 'South-East is the Agni (Fire) zone, ideal for the stove facing east.',
      floor: 1,
      color: '#ffedd5',
      features: ['L-shaped granite counter', 'Chimney ducting', 'Utility wash sink'],
    })

    if (hasPooja) {
      list.push({
        id: 'g-pooja',
        name: 'Pooja Mandir',
        zone: 'North-East (Ishanya)',
        widthFt: Math.round(buildableWidth * 0.22),
        lengthFt: Math.round(buildableLength * 0.2),
        xPct: 76,
        yPct: 4,
        wPct: 20,
        hPct: 19,
        vastu: 'Ishanya (North-East) corner brings peace, calmness, and morning sun.',
        floor: 1,
        color: '#fef08a',
        features: ['Marble pedestal', 'Brass bell recess', 'East-facing entrance'],
      })
    }

    list.push({
      id: 'g-bed1',
      name: bhk === 1 ? 'Primary Bedroom' : 'Guest / Parents Bedroom',
      zone: 'South-West / South',
      widthFt: Math.round(buildableWidth * 0.5),
      lengthFt: Math.round(buildableLength * 0.26),
      xPct: 5,
      yPct: 4,
      wPct: 45,
      hPct: 20,
      vastu: 'Ground floor bedroom easily accessible for elders, away from street noise.',
      floor: 1,
      color: '#dbeafe',
      features: ['King bed niche', 'Full-height wardrobe', 'Window to rear yard'],
    })

    list.push({
      id: 'g-bath',
      name: 'Common Bath',
      zone: 'West / North-West',
      widthFt: Math.round(buildableWidth * 0.22),
      lengthFt: Math.round(buildableLength * 0.2),
      xPct: 53,
      yPct: 4,
      wPct: 20,
      hPct: 19,
      vastu: 'Placed along outer wall for natural shaft ventilation.',
      floor: 1,
      color: '#ccfbf1',
      features: ['Glass shower partition', 'Wall-hung commode'],
    })

    // --- FIRST FLOOR ---
    if (floors >= 2) {
      list.push({
        id: 'f-master',
        name: 'Master Suite (Nairutya)',
        zone: 'South-West (Earth Element)',
        widthFt: Math.round(buildableWidth * 0.55),
        lengthFt: Math.round(buildableLength * 0.4),
        xPct: 5,
        yPct: 4,
        wPct: 52,
        hPct: 42,
        vastu: 'Supreme master bedroom corner in Vastu for stability and sound sleep.',
        floor: 2,
        color: '#dbeafe',
        features: ['Walk-in dressing space', 'Attached luxury bath', 'Large picture windows'],
      })

      list.push({
        id: 'f-bath-master',
        name: 'Master Bath',
        zone: 'West Wall',
        widthFt: Math.round(buildableWidth * 0.35),
        lengthFt: Math.round(buildableLength * 0.2),
        xPct: 60,
        yPct: 4,
        wPct: 36,
        hPct: 22,
        vastu: 'Direct plumbing stack aligned with ground floor bath.',
        floor: 2,
        color: '#ccfbf1',
        features: ['Double vanity', 'Rain shower'],
      })

      if (bhk >= 3) {
        list.push({
          id: 'f-kids',
          name: bhk >= 4 ? 'Children Bedroom' : 'Family Bed / Study Room',
          zone: 'North-West (Vayu)',
          widthFt: Math.round(buildableWidth * 0.45),
          lengthFt: Math.round(buildableLength * 0.35),
          xPct: 5,
          yPct: 50,
          wPct: 46,
          hPct: 44,
          vastu: 'Good for active children, students, and breezy circulation.',
          floor: 2,
          color: '#e0e7ff',
          features: ['Study desk nook', 'Twin beds or Queen bed'],
        })
      }

      list.push({
        id: 'f-lounge',
        name: 'Upstairs Family Lounge',
        zone: 'Central Living',
        widthFt: Math.round(buildableWidth * 0.42),
        lengthFt: Math.round(buildableLength * 0.35),
        xPct: 54,
        yPct: 30,
        wPct: 42,
        hPct: 36,
        vastu: 'Private gathering space for movies, books, and morning tea.',
        floor: 2,
        color: '#fef3c7',
        features: ['TV cabinet console', 'Stairway connection'],
      })

      if (hasBalcony) {
        list.push({
          id: 'f-balcony',
          name: 'Sit-out Balcony',
          zone: 'North / East View',
          widthFt: Math.round(buildableWidth * 0.42),
          lengthFt: Math.round(buildableLength * 0.22),
          xPct: 54,
          yPct: 70,
          wPct: 42,
          hPct: 24,
          vastu: 'North-East open balcony welcomes fresh morning breezes and greenery.',
          floor: 2,
          color: '#dcfce7',
          features: ['Glass railing', 'Planter boxes', 'Sit-out chairs'],
        })
      }
    }

    return list
  }, [bhk, buildableLength, buildableWidth, floors, hasBalcony, hasParking, hasPooja, layoutStyle])

  const visibleRooms = useMemo(() => rooms.filter((r) => r.floor === activeFloor), [rooms, activeFloor])
  const selectedRoom = useMemo(() => rooms.find((r) => r.id === selectedRoomId) || visibleRooms[0] || null, [rooms, selectedRoomId, visibleRooms])

  return (
    <main className="min-h-[calc(100vh-68px)] bg-brand-canvas px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-teal">
              <span>Interactive Simulator</span>
              <span>•</span>
              <span className="text-slate-500">2D Floor Plan & Estimate</span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
              Simulate Your Dream Home
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5"
            >
              <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Save Brief
            </Button>
            <Button asChild size="sm">
              <Link to="/plan/setup">Save to Profile</Link>
            </Button>
          </div>
        </div>

        {/* Main Grid: Controls Sidebar + Simulator Canvas + Cost Analytics */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* LEFT COLUMN: Controls Sidebar (4 cols) */}
          <div className="space-y-5 lg:col-span-4">
            
            {/* 1. Plot Dimensions Card */}
            <section className="rounded-2xl border border-brand-line bg-white p-5 shadow-card">
              <h2 className="font-display text-base font-bold text-brand-ink">1. Plot Dimensions</h2>
              <p className="mt-1 text-xs text-slate-500">Choose a common standard plot or enter custom dimensions.</p>

              {/* Preset Buttons */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {PLOT_PRESETS.map((preset) => {
                  const isSelected = plotWidth === preset.width && plotLength === preset.length
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setPlotWidth(preset.width)
                        setPlotLength(preset.length)
                      }}
                      className={`rounded-xl border p-2.5 text-left text-xs transition ${
                        isSelected
                          ? 'border-brand-green bg-brand-green/10 font-bold text-brand-green-dark'
                          : 'border-brand-line bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  )
                })}
              </div>

              {/* Width & Length Sliders */}
              <div className="mt-4 space-y-3 border-t border-brand-line pt-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Plot Width</span>
                    <span className="font-display font-bold text-brand-ink">{plotWidth} ft</span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={80}
                    step={1}
                    value={plotWidth}
                    onChange={(e) => setPlotWidth(Number(e.target.value))}
                    className="mt-1.5 h-1.5 w-full accent-brand-green"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Plot Length</span>
                    <span className="font-display font-bold text-brand-ink">{plotLength} ft</span>
                  </div>
                  <input
                    type="range"
                    min={25}
                    max={120}
                    step={1}
                    value={plotLength}
                    onChange={(e) => setPlotLength(Number(e.target.value))}
                    className="mt-1.5 h-1.5 w-full accent-brand-green"
                  />
                </div>
              </div>

              {/* Plot Metrics Chip */}
              <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-canvas px-3.5 py-2 text-xs">
                <span className="text-slate-600">Total Land Area:</span>
                <span className="font-bold text-brand-ink">
                  {plotAreaSqFt.toLocaleString('en-IN')} sq ft ({((plotAreaSqFt) / 435.6).toFixed(1)} cents)
                </span>
              </div>
            </section>

            {/* 2. Floors & Rooms Configuration */}
            <section className="rounded-2xl border border-brand-line bg-white p-5 shadow-card">
              <h2 className="font-display text-base font-bold text-brand-ink">2. Floors & Bedrooms</h2>

              <div className="mt-3 space-y-3">
                {/* Floors Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700">Number of Floors</label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {[
                      { count: 1, label: 'Ground (1)' },
                      { count: 2, label: 'G + 1 (2)' },
                      { count: 3, label: 'G + 2 (3)' },
                    ].map((f) => (
                      <button
                        key={f.count}
                        type="button"
                        onClick={() => {
                          setFloors(f.count)
                          if (activeFloor > f.count) setActiveFloor(1)
                        }}
                        className={`rounded-xl border py-2 text-xs font-bold transition ${
                          floors === f.count
                            ? 'border-brand-green bg-brand-green text-white shadow-sm'
                            : 'border-brand-line bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BHK Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700">Bedrooms (BHK)</label>
                  <div className="mt-1.5 grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setBhk(num)}
                        className={`rounded-xl border py-2 text-xs font-bold transition ${
                          bhk === num
                            ? 'border-brand-teal bg-brand-teal text-white shadow-sm'
                            : 'border-brand-line bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {num} BHK
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layout Architecture Style */}
                <div>
                  <label className="text-xs font-semibold text-slate-700">Layout Style</label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {[
                      { key: 'vastu', label: 'Vastu' },
                      { key: 'modern', label: 'Open' },
                      { key: 'compact', label: 'Compact' },
                    ].map((style) => (
                      <button
                        key={style.key}
                        type="button"
                        onClick={() => setLayoutStyle(style.key as any)}
                        className={`rounded-xl border py-2 text-xs font-semibold transition ${
                          layoutStyle === style.key
                            ? 'border-brand-ink bg-brand-ink text-white shadow-sm'
                            : 'border-brand-line bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Room Options */}
                <div className="border-t border-brand-line pt-3">
                  <p className="text-xs font-semibold text-slate-700">Special Spaces</p>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasPooja}
                        onChange={(e) => setHasPooja(e.target.checked)}
                        className="rounded border-slate-300 text-brand-green focus:ring-brand-green"
                      />
                      <span>Dedicated Pooja Room (North-East)</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasParking}
                        onChange={(e) => setHasParking(e.target.checked)}
                        className="rounded border-slate-300 text-brand-green focus:ring-brand-green"
                      />
                      <span>Covered Car Parking Portico</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasBalcony}
                        onChange={(e) => setHasBalcony(e.target.checked)}
                        className="rounded border-slate-300 text-brand-green focus:ring-brand-green"
                      />
                      <span>Front Sit-out / Balcony</span>
                    </label>
                  </div>
                </div>

              </div>
            </section>

            {/* 3. Material & Construction Standard */}
            <section className="rounded-2xl border border-brand-line bg-white p-5 shadow-card">
              <h2 className="font-display text-base font-bold text-brand-ink">3. Construction Quality</h2>
              <div className="mt-3 space-y-2">
                {(Object.keys(QUALITY_RATES) as Array<keyof typeof QUALITY_RATES>).map((key) => {
                  const q = QUALITY_RATES[key]
                  const isSelected = quality === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setQuality(key)}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        isSelected
                          ? 'border-brand-green bg-brand-green/5 ring-1 ring-brand-green'
                          : 'border-brand-line bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display text-sm font-bold text-brand-ink">{q.label}</span>
                        <span className="text-xs font-bold text-brand-green-dark">₹{q.ratePerSqFt}/sq ft</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-4 text-slate-500">{q.desc}</p>
                    </button>
                  )
                })}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Interactive 2D Simulator Canvas & Room Details (8 cols) */}
          <div className="space-y-5 lg:col-span-8">
            
            {/* Visualizer Card */}
            <section className="rounded-2xl border border-brand-line bg-white p-5 shadow-card sm:p-6">
              
              {/* Floor Switcher & Style Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line pb-4">
                
                {/* Floor Tabs */}
                <div className="flex items-center gap-1.5 rounded-full bg-brand-canvas p-1">
                  <button
                    type="button"
                    onClick={() => setActiveFloor(1)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                      activeFloor === 1
                        ? 'bg-white text-brand-ink shadow-sm'
                        : 'text-slate-600 hover:text-brand-ink'
                    }`}
                  >
                    Ground Floor
                  </button>
                  {floors >= 2 && (
                    <button
                      type="button"
                      onClick={() => setActiveFloor(2)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                        activeFloor === 2
                          ? 'bg-white text-brand-ink shadow-sm'
                          : 'text-slate-600 hover:text-brand-ink'
                      }`}
                    >
                      First Floor
                    </button>
                  )}
                  {floors >= 3 && (
                    <button
                      type="button"
                      onClick={() => setActiveFloor(3)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                        activeFloor === 3
                          ? 'bg-white text-brand-ink shadow-sm'
                          : 'text-slate-600 hover:text-brand-ink'
                      }`}
                    >
                      Second Floor
                    </button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Theme:</span>
                  <div className="flex rounded-lg border border-brand-line p-0.5">
                    <button
                      type="button"
                      onClick={() => setViewMode('blueprint')}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                        viewMode === 'blueprint' ? 'bg-[#0f2830] text-cyan-300' : 'text-slate-600'
                      }`}
                    >
                      Blueprint
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('color')}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                        viewMode === 'color' ? 'bg-brand-canvas text-brand-ink font-bold' : 'text-slate-600'
                      }`}
                    >
                      Color Plan
                    </button>
                  </div>
                </div>

              </div>

              {/* 2D Architectural SVG Floor Plan */}
              <div className="relative mt-4 flex items-center justify-center overflow-hidden rounded-xl border border-brand-line bg-brand-canvas p-4 sm:p-6">
                
                {/* Compass Marker */}
                <div className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-sm border border-brand-line text-[10px] font-extrabold text-brand-ink">
                  <div className="flex flex-col items-center">
                    <span className="text-red-500 font-black">N</span>
                    <span className="text-[7px] text-slate-400">▲</span>
                  </div>
                </div>

                <div className="w-full max-w-[620px] aspect-[4/3] relative">
                  <svg
                    viewBox="0 0 1000 750"
                    className="size-full select-none"
                    style={{
                      background: viewMode === 'blueprint' ? '#0c2127' : '#f8fafc',
                    }}
                  >
                    <defs>
                      <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                        <path
                          d="M 25 0 L 0 0 0 25"
                          fill="none"
                          stroke={viewMode === 'blueprint' ? 'rgba(34, 211, 238, 0.08)' : 'rgba(203, 213, 225, 0.4)'}
                          strokeWidth="1"
                        />
                      </pattern>
                      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>

                    {/* Grid Background */}
                    <rect width="1000" height="750" fill="url(#grid)" />

                    {/* Plot Boundary Outline (Dotted Red / Orange Line) */}
                    <rect
                      x="40"
                      y="40"
                      width="920"
                      height="670"
                      fill="none"
                      stroke={viewMode === 'blueprint' ? '#f59e0b' : '#ea580c'}
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                    <text
                      x="50"
                      y="65"
                      fill={viewMode === 'blueprint' ? '#f59e0b' : '#ea580c'}
                      fontSize="13"
                      fontWeight="700"
                    >
                      PLOT BOUNDARY: {plotWidth}' × {plotLength}' ({plotAreaSqFt} sq ft)
                    </text>

                    {/* Setback Annotations */}
                    <text x="500" y="32" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">
                      REAR SETBACK ({rearSetback} ft)
                    </text>
                    <text x="500" y="735" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">
                      FRONT ROAD & SETBACK ({frontSetback} ft)
                    </text>
                    <text x="18" y="375" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600" transform="rotate(-90 18 375)">
                      SIDE ({sideSetback} ft)
                    </text>
                    <text x="982" y="375" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600" transform="rotate(90 982 375)">
                      SIDE ({sideSetback} ft)
                    </text>

                    {/* Ground Building Footprint (Inner Solid Border) */}
                    <rect
                      x="100"
                      y="90"
                      width="800"
                      height="570"
                      rx="6"
                      fill={viewMode === 'blueprint' ? '#0f2f38' : '#ffffff'}
                      stroke={viewMode === 'blueprint' ? '#38bdf8' : '#334155'}
                      strokeWidth="4"
                    />

                    {/* Rooms Geometry */}
                    {visibleRooms.map((room) => {
                      const rx = 100 + (room.xPct / 100) * 800
                      const ry = 90 + (room.yPct / 100) * 570
                      const rw = (room.wPct / 100) * 800
                      const rh = (room.hPct / 100) * 570
                      const isSelected = selectedRoom?.id === room.id

                      return (
                        <g
                          key={room.id}
                          className="cursor-pointer transition-all"
                          onClick={() => setSelectedRoomId(room.id)}
                        >
                          {/* Room Box */}
                          <rect
                            x={rx}
                            y={ry}
                            width={rw}
                            height={rh}
                            fill={
                              viewMode === 'blueprint'
                                ? isSelected
                                  ? 'rgba(56, 189, 248, 0.28)'
                                  : 'rgba(15, 47, 56, 0.85)'
                                : isSelected
                                ? '#dbeafe'
                                : room.color
                            }
                            stroke={
                              isSelected
                                ? viewMode === 'blueprint'
                                  ? '#22d3ee'
                                  : '#2563eb'
                                : viewMode === 'blueprint'
                                ? '#38bdf8'
                                : '#64748b'
                            }
                            strokeWidth={isSelected ? 3 : 1.8}
                          />

                          {/* Door Swing Indicator */}
                          <path
                            d={`M ${rx + 10} ${ry + rh} A 22 22 0 0 0 ${rx + 32} ${ry + rh - 22}`}
                            fill="none"
                            stroke={viewMode === 'blueprint' ? '#38bdf8' : '#94a3b8'}
                            strokeWidth="1.2"
                            strokeDasharray="2 2"
                          />

                          {/* Room Name & Dimensions Text */}
                          <text
                            x={rx + rw / 2}
                            y={ry + rh / 2 - 8}
                            textAnchor="middle"
                            fill={viewMode === 'blueprint' ? '#f0fdfa' : '#0f172a'}
                            fontSize={rw < 140 ? '12' : '14'}
                            fontWeight="700"
                          >
                            {room.name}
                          </text>
                          <text
                            x={rx + rw / 2}
                            y={ry + rh / 2 + 10}
                            textAnchor="middle"
                            fill={viewMode === 'blueprint' ? '#38bdf8' : '#475569'}
                            fontSize="11"
                            fontWeight="600"
                          >
                            {room.widthFt}' × {room.lengthFt}' ({room.widthFt * room.lengthFt} sq ft)
                          </text>

                          {/* Zone indicator */}
                          {rw > 180 && (
                            <text
                              x={rx + rw / 2}
                              y={ry + rh / 2 + 26}
                              textAnchor="middle"
                              fill={viewMode === 'blueprint' ? '#94a3b8' : '#64748b'}
                              fontSize="9.5"
                            >
                              {room.zone}
                            </text>
                          )}
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </div>

              {/* Selected Room Details Bar */}
              {selectedRoom && (
                <div className="mt-4 rounded-xl border border-brand-line bg-brand-canvas p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal">
                        Selected Room
                      </span>
                      <h3 className="font-display text-base font-bold text-brand-ink">
                        {selectedRoom.name}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Dimensions: <strong>{selectedRoom.widthFt}' × {selectedRoom.lengthFt}'</strong> ({selectedRoom.widthFt * selectedRoom.lengthFt} sq ft) • {selectedRoom.zone}
                      </p>
                    </div>
                    <div className="max-w-xs rounded-lg bg-white p-2.5 text-xs text-slate-700 shadow-sm border border-brand-line">
                      <strong className="text-brand-green-dark">Vastu Note:</strong> {selectedRoom.vastu}
                    </div>
                  </div>
                  {selectedRoom.features && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-brand-line/60 pt-2">
                      {selectedRoom.features.map((feat) => (
                        <span key={feat} className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-brand-line">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </section>

            {/* REAL-TIME COST & SPECIFICATION ESTIMATOR */}
            <section className="rounded-2xl border border-brand-line bg-white p-5 shadow-card sm:p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-green-dark">
                    Estimator & Material Planning
                  </span>
                  <h2 className="font-display text-xl font-bold text-brand-ink">
                    Simulated Construction Cost
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500">Estimated Project Cost</span>
                  <p className="font-display text-2xl font-black text-brand-teal sm:text-3xl">
                    {inr.format(baseCost)}
                  </p>
                </div>
              </div>

              {/* Area & Metric Highlights */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-brand-canvas p-3 border border-brand-line">
                  <span className="text-[11px] text-slate-500">Total Built-up Area</span>
                  <p className="font-display text-base font-bold text-brand-ink">{totalBuiltUpSqFt.toLocaleString('en-IN')} sq ft</p>
                </div>
                <div className="rounded-xl bg-brand-canvas p-3 border border-brand-line">
                  <span className="text-[11px] text-slate-500">Ground Coverage</span>
                  <p className="font-display text-base font-bold text-brand-ink">{groundCoveragePct}%</p>
                </div>
                <div className="rounded-xl bg-brand-canvas p-3 border border-brand-line">
                  <span className="text-[11px] text-slate-500">Floor Area Ratio (FAR)</span>
                  <p className="font-display text-base font-bold text-brand-ink">{far}</p>
                </div>
                <div className="rounded-xl bg-brand-canvas p-3 border border-brand-line">
                  <span className="text-[11px] text-slate-500">Est. Timeline</span>
                  <p className="font-display text-base font-bold text-brand-ink">{estimatedMonths} Months</p>
                </div>
              </div>

              {/* Cost Breakdown Progress Bars */}
              <div className="mt-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Itemized Cost Breakdown ({QUALITY_RATES[quality].label} Grade @ ₹{QUALITY_RATES[quality].ratePerSqFt}/sq ft)
                </h3>
                
                {[
                  { name: 'Structure, Foundation & Brickwork (46%)', amount: civilCost, pct: 46, color: 'bg-emerald-600' },
                  { name: 'Flooring, Tiling & Countertops (18%)', amount: finishCost, pct: 18, color: 'bg-teal-600' },
                  { name: 'Electrical & Plumbing Systems (15%)', amount: plumbingElectricalCost, pct: 15, color: 'bg-cyan-600' },
                  { name: 'Doors, Windows & Woodwork (11%)', amount: doorsWindowsCost, pct: 11, color: 'bg-amber-600' },
                  { name: 'Painting & Elevation Finishes (10%)', amount: paintElevationCost, pct: 10, color: 'bg-indigo-600' },
                ].map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{item.name}</span>
                      <span className="font-display font-bold text-brand-ink">{inr.format(item.amount)}</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <p className="mt-6 rounded-xl bg-amber-50 p-3.5 text-xs text-amber-800 border border-amber-200/60 leading-5">
                <strong>Planning Guidance Note:</strong> Rates are indexed for typical Indian tier-1 and tier-2 city construction (cement, TMT steel, sand, labor). Local municipal bylaws, soil condition, elevation complexity, and bespoke finishes may affect final architectural drawings.
              </p>

            </section>

          </div>

        </div>
      </div>
    </main>
  )
}
