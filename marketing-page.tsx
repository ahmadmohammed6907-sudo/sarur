import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { db } from '@/db'
import { services, users } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { listFreelancers } from '@/lib/queries'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Categories } from '@/components/landing/categories'
import { ManagedServices } from '@/components/landing/managed-services'
import { Referral } from '@/components/landing/referral'
import { formatDollars } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SARUR',
  url: 'https://sarur.app',
  logo: 'https://sarur.app/sarur-deer.png',
  slogan: 'Where Talent Meets Opportunity',
  description:
    'SARUR connects freelancers, agencies, and businesses in one premium ecosystem.',
}

async function getHomeData() {
  const featured = await db
    .select({
      id: services.id,
      title: services.title,
      price: services.price,
      imageUrl: services.imageUrl,
      category: services.category,
      rating: services.rating,
      reviewCount: services.reviewCount,
      freelancerId: users.id,
      freelancerName: users.fullName,
      freelancerAvatar: users.avatarUrl,
      freelancerTitle: users.title,
    })
    .from(services)
    .innerJoin(users, eq(services.freelancerId, users.id))
    .where(eq(services.isActive, true))
    .orderBy(desc(services.rating), desc(services.salesCount))
    .limit(8)

  const freelancers = await listFreelancers({ limit: 4 })
  return { featured, freelancers }
}

export default async function HomePage() {
  const { featured, freelancers } = await getHomeData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — SARUR design with real DB data */}
      <Hero featuredServices={featured} topFreelancers={freelancers} />

      {/* How it works — SARUR design */}
      <HowItWorks />

      {/* Categories — SARUR design */}
      <Categories />

      {/* Featured Services — DB-powered */}
      {featured.length > 0 && (
        <section className="py-20 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-primary mb-2">
                  Featured work
                </p>
                <h2 className="text-3xl font-bold text-foreground">
                  Top-rated services this week
                </h2>
              </div>
              <Link
                href="/services"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.slice(0, 4).map((s) => (
                <Link
                  key={s.id}
                  href={`/services/${s.id}`}
                  className="lift group rounded-2xl bg-card border border-border p-5 shadow-paper-sm hover:shadow-paper"
                >
                  <div className="mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-1">
                      {s.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {s.freelancerName}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      ⭐ {Number(s.rating).toFixed(1)} ({s.reviewCount})
                    </span>
                    <span className="font-bold text-foreground">
                      {formatDollars(s.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Freelancers — DB-powered */}
      {freelancers.length > 0 && (
        <section className="py-20 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-primary mb-2">
                  Meet the talent
                </p>
                <h2 className="text-3xl font-bold text-foreground">
                  Top-rated freelancers
                </h2>
              </div>
              <Link
                href="/freelancers"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {freelancers.map((f) => (
                <Link
                  key={f.id}
                  href={`/freelancers/${f.id}`}
                  className="lift group flex flex-col items-center rounded-2xl bg-card border border-border p-6 text-center shadow-paper-sm hover:shadow-paper"
                >
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                    {f.fullName.charAt(0)}
                  </div>
                  <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary transition-colors">
                    {f.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{f.title}</p>
                  {f.hourlyRate && (
                    <p className="mt-3 text-sm font-semibold text-foreground">
                      {formatDollars(f.hourlyRate)}
                      <span className="text-xs font-normal text-muted-foreground">/hr</span>
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Managed Services — SARUR design */}
      <ManagedServices />

      {/* Referral / Affiliate — SARUR design */}
      <Referral />
    </>
  )
}
