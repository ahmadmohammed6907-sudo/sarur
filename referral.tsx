import Link from 'next/link'
import { Gift, Users, Briefcase, ArrowRight } from 'lucide-react'
import { Reveal } from './reveal'

export function Referral() {
  return (
    <section id="affiliate" className="bg-muted/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-10 rounded-[2.5rem] bg-paper p-8 shadow-paper sm:p-12 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-dark shadow-inset-sm">
              <Gift className="size-3.5" /> Referral Program
            </span>
            <h2 className="mt-6 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Invite friends. Earn 10% commission.
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Share your unique referral link with clients and freelancers. Track
              clicks, registrations, and revenue — and earn a commission on every
              referral that joins SARUR.
            </p>
            <Link
              href="/affiliate"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-paper transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              Join the Program <ArrowRight className="size-4" />
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Briefcase, who: 'Client Referral', reward: '10%', note: 'on first project spend' },
                { icon: Users, who: 'Freelancer Referral', reward: '10%', note: 'on first earnings' },
              ].map((r) => (
                <div key={r.who} className="rounded-3xl bg-background p-6 shadow-inset-sm">
                  <span className="grid size-12 place-items-center rounded-2xl bg-paper text-teal shadow-paper-sm">
                    <r.icon className="size-6" />
                  </span>
                  <p className="mt-4 text-3xl font-extrabold text-teal">{r.reward}</p>
                  <p className="font-bold text-ink">{r.who}</p>
                  <p className="text-sm text-muted-foreground">{r.note}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
