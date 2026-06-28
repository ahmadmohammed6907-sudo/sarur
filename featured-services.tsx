import Link from 'next/link'
import { Star, Code2, Palette, Clapperboard, BrainCircuit, Gamepad2, BarChart3 } from 'lucide-react'
import { Reveal } from './reveal'

const SERVICES = [
  { icon: Code2, title: 'I will build a full-stack web app', seller: 'Amira H.', rating: 4.9, price: 'From $450' },
  { icon: Palette, title: 'I will design a premium brand identity', seller: 'Daniel R.', rating: 5.0, price: 'From $180' },
  { icon: Clapperboard, title: 'I will animate a 30s explainer video', seller: 'Lina P.', rating: 4.8, price: 'From $320' },
  { icon: BrainCircuit, title: 'I will build a custom AI chatbot', seller: 'Sara M.', rating: 4.9, price: 'From $600' },
  { icon: Gamepad2, title: 'I will develop a 2D mobile game', seller: 'Jon C.', rating: 4.7, price: 'From $900' },
  { icon: BarChart3, title: 'I will create an interactive dashboard', seller: 'Omar K.', rating: 4.9, price: 'From $240' },
]

export function FeaturedServices() {
  return (
    <section id="services" className="bg-muted/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Featured Services
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Ready-to-buy packages from our marketplace — clear scope, clear price.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.06}>
              <Link
                href="/services"
                className="group flex h-full flex-col rounded-3xl bg-paper p-6 shadow-paper-sm transition-transform hover:-translate-y-1 hover:shadow-paper"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-background text-teal shadow-inset-sm">
                  <s.icon className="size-6" />
                </span>
                <h3 className="mt-4 flex-1 text-pretty font-bold leading-snug text-ink">
                  {s.title}
                </h3>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="size-4 fill-warning text-warning" />
                    <span className="text-sm font-bold text-ink">{s.rating}</span>
                    <span className="text-xs text-muted-foreground">· {s.seller}</span>
                  </div>
                  <span className="text-sm font-extrabold text-teal">{s.price}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
