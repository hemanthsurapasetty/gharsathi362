import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Design Simulator', href: '/simulate' },
  { label: 'Home ideas', href: '/#home-ideas' },
  { label: 'Cost planner', href: '/#planning-tools' },
  { label: 'How it works', href: '/#our-approach' },
  { label: 'About', href: '/#about' },
]

function Brand() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green" aria-label="GharSathi home">
      <svg aria-hidden="true" viewBox="0 0 36 36" className="size-8 text-brand-green" fill="none">
        <path d="m5 16.2 13-11 13 11v14.3H5V16.2Z" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M14 30.5V20h8v10.5M3.7 17.2 18 5l14.3 12.2" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>
        <span className="block font-display text-lg font-extrabold leading-5 tracking-tight text-brand-ink">Ghar<span className="text-brand-green-dark">Sathi</span></span>
        <span className="hidden text-[8px] font-bold tracking-[0.13em] text-brand-teal sm:block">DESIGN · PLAN · BUILD BETTER</span>
      </span>
    </Link>
  )
}

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  async function signOut() {
    await logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="relative z-30 border-b border-brand-line bg-white">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-5 px-4 sm:px-7 lg:px-9">
        <Brand />
        <nav aria-label="Main navigation" className="hidden items-center gap-5 xl:flex">
          {links.map((link) => (
            link.href.startsWith('/#') ? (
              <a key={link.label} href={link.href} className="whitespace-nowrap text-[13px] font-medium text-slate-600 transition-colors hover:text-brand-green-dark">
                {link.label}
              </a>
            ) : (
              <Link key={link.label} to={link.href} className="whitespace-nowrap text-[13px] font-medium text-slate-600 transition-colors hover:text-brand-green-dark">
                {link.label}
              </Link>
            )
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          {user ? <>
            <Link to="/plan/overview" className="text-[13px] font-semibold text-brand-teal hover:text-brand-green-dark">My plan</Link>
            <button type="button" onClick={signOut} className="text-[13px] font-medium text-slate-500 hover:text-brand-ink">Sign out</button>
          </> : <>
            <Link to="/login" className="px-2 py-2 text-[13px] font-semibold text-brand-teal hover:text-brand-green-dark">Sign in</Link>
            <Button asChild size="sm"><Link to="/register">Start planning</Link></Button>
          </>}
        </div>
        <button
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="flex size-10 items-center justify-center rounded-full border border-brand-line text-brand-ink xl:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <span aria-hidden="true" className="text-2xl leading-none">×</span> : <span aria-hidden="true" className="text-xl leading-none">☰</span>}
        </button>
      </div>
      {menuOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute inset-x-0 top-full border-b border-brand-line bg-white px-4 py-3 shadow-card xl:hidden">
        {links.map((link) => (
          link.href.startsWith('/#') ? (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-canvas">
              {link.label}
            </a>
          ) : (
            <Link key={link.label} to={link.href} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-canvas">
              {link.label}
            </Link>
          )
        ))}
        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-brand-line pt-3">
          {user ? <>
            <Button asChild variant="secondary"><Link onClick={() => setMenuOpen(false)} to="/plan/overview">My plan</Link></Button>
            <Button variant="secondary" onClick={signOut}>Sign out</Button>
          </> : <>
            <Button asChild variant="secondary"><Link onClick={() => setMenuOpen(false)} to="/login">Sign in</Link></Button>
            <Button asChild><Link onClick={() => setMenuOpen(false)} to="/register">Start planning</Link></Button>
          </>}
        </div>
      </nav>}
      <span className="sr-only" aria-live="polite">{location.pathname === '/' ? 'Home' : ''}</span>
    </header>
  )
}
