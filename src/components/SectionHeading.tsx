interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  light?: boolean
}

export function SectionHeading({ eyebrow, title, description, light = false }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className={`mb-3 text-xs font-bold uppercase tracking-[0.18em] ${light ? 'text-emerald-200' : 'text-brand-green-dark'}`}>
        {eyebrow}
      </p>
      <h2 className={`font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl ${light ? 'text-white' : 'text-brand-ink'}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-7 sm:text-lg ${light ? 'text-white/75' : 'text-slate-600'}`}>
          {description}
        </p>
      )}
    </div>
  )
}
