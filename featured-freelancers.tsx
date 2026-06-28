import Image from 'next/image'
import Link from 'next/link'
import { Star, BadgeCheck, ArrowRight } from 'lucide-react'
import { Reveal } from './reveal'

const FREELANCERS = [
  {
    name: 'Amira Hassan',
    role: 'Full-Stack Developer',
    avatar: '/freelancer-1.png',
    rating: 4.9,
    reviews: 213,
    skills: ['React', 'Node.js', 'PostgreSQL'],
  },
  {
    name: 'Daniel Reyes',
    role: 'Brand & Graphic Designer',
    avatar: '/freelancer-2.png',
    rating: 5.0,
    reviews: 178,
    skills: ['Branding', 'Illustration', 'Figma'],
  },
  {
    name: 'Lina Park',
    role: 'Motion Designer',
    avatar: '/freelancer-3.png',
    rating: 4.8,
    reviews: 142,
    skills: ['After Effects', '2D', '3D'],
  },
  {
    name: 'Omar Khalil',
    role: 'Data Analyst',
    avatar: '/freelancer-4.png',
    rating: 4.9,
    reviews: 96,
    skills: ['Python', 'SQL', 'Power BI'],
  },
]

export function FeaturedFreelancers() {
  return (
    <section id="freelancers" className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
      <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-xl">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Featured Freelancers
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Hand-picked, company-reviewed talent ready to bring your ideas to life.
          </p>
        </div>
        <Link
          href="/freelancers"
          className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-teal-dark shadow-paper-sm transition-transform hover:-translate-y-0.5"
        >
          View all <ArrowRight className="size-4" />
        </Link>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FREELANCERS.map((f, i) => (
          <Reveal key={f.name} delay={(i % 4) * 0.06}>
            <article className="group flex h-full flex-col rounded-3xl bg-paper p-5 shadow-paper-sm transition-transform hover:-translate-y-1 hover:shadow-paper">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="block size-16 overflow-hidden rounded-2xl shadow-inset-sm">
                    <Image
                      src={f.avatar}
                      alt={f.name}
                      width={64}
                      height={64}
                      className="size-full object-cover"
                    />
                  </span>
                  <BadgeCheck className="absolute -right-1.5 -top-1.5 size-6 rounded-full bg-paper p-0.5 text-teal shadow-paper-sm" />
                </div>
                <div>
                  <h3 className="flex items-center gap-1 font-bold text-ink">{f.name}</h3>
                  <p className="text-sm text-muted-foreground">{f.role}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5">
                <Star className="size-4 fill-warning text-warning" />
                <span className="text-sm font-bold text-ink">{f.rating}</span>
                <span className="text-xs text-muted-foreground">({f.reviews} reviews)</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {f.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-background px-3 py-1 text-xs font-medium text-teal-dark shadow-inset-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <Link
                href="/freelancers"
                className="mt-5 inline-flex items-center justify-center rounded-2xl bg-muted py-2.5 text-sm font-semibold text-teal-dark shadow-inset-sm transition-colors hover:bg-sage/40"
              >
                View Profile
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
