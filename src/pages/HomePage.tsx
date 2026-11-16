import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { SectionHeading } from '../components/SectionHeading'

const homeIdeas = [
  {
    name: 'A calm compact home',
    detail: 'A thoughtful starting point for a smaller plot.',
    type: 'Compact',
    image: 'photo-1600210492486-724fe5c67fb0',
    alt: 'Warm, naturally lit living room with simple furnishings',
  },
  {
    name: 'Room for everyone',
    detail: 'A flexible family layout to explore together.',
    type: '2BHK idea',
    image: 'photo-1600607687939-ce8a6c25118c',
    alt: 'Contemporary home interior opening onto a green garden',
  },
  {
    name: 'A little more breathing room',
    detail: 'Spaces that can adapt as your family grows.',
    type: '3BHK idea',
    image: 'photo-1600607687920-4e2a09cf159d',
    alt: 'Modern Indian-inspired home with an open, light-filled layout',
  },
]

const steps = [
  ['01', 'Start with your needs', 'Think through your plot, family, priorities, and what feels comfortable to spend.'],
  ['02', 'Explore your options', 'Compare layouts and planning choices before making bigger commitments.'],
  ['03', 'Plan with clarity', 'Take informed questions and a clearer brief to qualified local professionals.'],
]

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none"><path d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-brand-ink">
      <main id="top">
        <section className="relative isolate flex min-h-[650px] items-center bg-[#173d35] sm:min-h-[690px]">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85"
            alt="A welcoming contemporary home with an open view to the garden"
            className="absolute inset-0 -z-20 size-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-hero-wash" />
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="max-w-2xl text-white">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-emerald-300" /> Your home planning partner
              </div>
              <h1 className="font-display text-[2.65rem] font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-[4.25rem]">
                A home of your own, <span className="text-emerald-200">planned with confidence.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                Clear ideas and practical guidance for families taking their first steps toward building a home.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-950/20">
                  <Link to="/simulate">Launch Design Simulator <ArrowIcon /></Link>
                </Button>
                <Button asChild variant="inverse" size="lg">
                  <a href="#home-ideas">Explore home ideas</a>
                </Button>
              </div>
              <p className="mt-5 text-xs leading-5 text-white/65">Ideas for planning conversations. Site-specific drawings and engineering need qualified professional review.</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 hidden w-[34%] max-w-md rounded-tl-3xl bg-white/95 p-6 shadow-card backdrop-blur sm:block lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-brand-green-dark">DESIGN · PLAN · BUILD BETTER</p>
            <p className="mt-2 font-display text-xl font-bold leading-snug text-brand-ink">Good planning begins with the right questions.</p>
          </div>
        </section>

        <section className="border-b border-brand-line bg-brand-canvas">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:grid-cols-3 sm:px-8 lg:px-10 lg:py-8">
            {[
              ['Plan around your budget', 'See the choices behind the numbers.'],
              ['Make space for your life', 'Start with the way your family lives.'],
              ['Build with better questions', 'Know what to discuss before you commit.'],
            ].map(([title, detail], i) => <div key={title} className="flex items-start gap-4 sm:border-r sm:border-brand-line sm:pr-5 last:border-0">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-teal shadow-sm">0{i + 1}</span>
              <div><h2 className="font-display text-sm font-bold text-brand-ink">{title}</h2><p className="mt-1 text-sm leading-5 text-slate-600">{detail}</p></div>
            </div>)}
          </div>
        </section>

        <section id="home-ideas" className="scroll-mt-8 px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="A place to begin" title="Find ideas that feel like home." description="Explore a few early concepts to help you picture what could work for your family. These are inspiration, not construction drawings." />
              <a href="#get-started" className="inline-flex items-center gap-2 self-start pb-1 text-sm font-bold text-brand-teal hover:text-brand-green-dark sm:self-auto">Start planning <ArrowIcon /></a>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {homeIdeas.map((idea) => <article className="group overflow-hidden rounded-2xl border border-brand-line bg-white transition hover:-translate-y-1 hover:shadow-card" key={idea.name}>
                <div className="relative aspect-[1.43] overflow-hidden bg-brand-canvas">
                  <img className="size-full object-cover transition duration-500 group-hover:scale-[1.035]" src={`https://images.unsplash.com/${idea.image}?auto=format&fit=crop&w=1000&q=80`} alt={idea.alt} loading="lazy" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-brand-teal shadow-sm">{idea.type}</span>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-display text-lg font-bold text-brand-ink">{idea.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{idea.detail}</p>
                  <p className="mt-4 border-t border-brand-line pt-4 text-xs leading-5 text-slate-500">Conceptual inspiration · Adapt to your plot and professional advice</p>
                </div>
              </article>)}
            </div>
          </div>
        </section>

        <section id="our-approach" className="scroll-mt-8 bg-brand-canvas px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="A clearer way forward" title="Home building can feel like a lot. You don't have to plan it all at once." description="Budgets, layouts, materials, and unfamiliar decisions can pile up. GharSathi is being built to make the early planning steps easier to understand." />
              <a href="#get-started" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-brand-teal hover:text-brand-green-dark">Take the first step <ArrowIcon /></a>
            </div>
            <div className="space-y-3">
              {steps.map(([number, title, detail]) => <div className="flex gap-5 rounded-2xl border border-brand-line bg-white p-5 sm:p-6" key={number}>
                <span className="font-display text-lg font-extrabold text-brand-green">{number}</span>
                <div><h3 className="font-display text-base font-bold text-brand-ink">{title}</h3><p className="mt-1.5 text-sm leading-6 text-slate-600">{detail}</p></div>
              </div>)}
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-8 px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-brand-teal md:grid-cols-[1fr_.9fr]">
            <div className="p-7 sm:p-10 lg:p-14">
              <SectionHeading light eyebrow="Why GharSathi" title="A more thoughtful start to building." description="We believe families deserve clear, approachable information as they plan one of life's biggest decisions. GharSathi brings ideas and practical planning guidance together in one place." />
            </div>
            <div className="relative min-h-64 md:min-h-full">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85" alt="Sunlight falling across a welcoming home interior" className="absolute inset-0 size-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-teal/50 to-transparent" />
              <p className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-brand-teal">Your Home Planning Partner</p>
            </div>
          </div>
        </section>

        <section id="planning-tools" className="scroll-mt-8 px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-2xl border border-brand-line bg-brand-canvas p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-green-dark">Home Design Simulator & Estimator</p>
              <h2 className="mt-2 font-display text-xl font-bold text-brand-ink">Simulate your plot, room layouts & construction budget.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Instantly generate a 2D architectural floor plan, test Vastu orientations, calculate setbacks, and get a realistic Indian market construction cost estimate.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <Button asChild className="shrink-0"><Link to="/simulate">Try Simulator <ArrowIcon /></Link></Button>
            </div>
          </div>
        </section>

        <section id="get-started" className="scroll-mt-8 px-5 pb-20 sm:px-8 sm:pb-24 lg:px-10">
          <div className="mx-auto max-w-5xl rounded-3xl border border-brand-line bg-brand-canvas px-6 py-10 text-center sm:px-12 sm:py-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green-dark">A better first step</p>
            <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">Your home plans start with a conversation.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">Create an account to start a home profile. Your planning details stay with your account so you can return and update them.</p>
            <a className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-teal underline underline-offset-4" href="/register">Create your account <ArrowIcon /></a>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-line bg-white px-5 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p><span className="font-display font-extrabold text-brand-ink">GharSathi</span> <span className="mx-1 text-brand-green">·</span> DESIGN · PLAN · BUILD BETTER</p>
          <p>Planning concepts are for information only. Consult qualified professionals for site-specific design, structural safety, and approvals.</p>
        </div>
      </footer>
    </div>
  )
}
