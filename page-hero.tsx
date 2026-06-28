import type { ReactNode } from 'react'

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:pt-14">
      <div className="rounded-[2.5rem] bg-paper p-8 shadow-paper sm:p-14">
        {eyebrow ? (
          <span className="inline-block rounded-full bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-dark shadow-inset-sm">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-7">{children}</div> : null}
      </div>
    </section>
  )
}
