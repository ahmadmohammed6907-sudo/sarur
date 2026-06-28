import Link from 'next/link'
import { Code2, Palette, Layout, Smartphone, Clapperboard, BarChart3, BrainCircuit, Gamepad2 } from 'lucide-react'
import { Reveal } from './reveal'

const CATEGORIES = [
  { icon: Code2, label: 'Programming', count: '8,420 talents' },
  { icon: Palette, label: 'Graphic Design', count: '6,110 talents' },
  { icon: Layout, label: 'Web Design', count: '5,300 talents' },
  { icon: Smartphone, label: 'Mobile Apps', count: '3,940 talents' },
  { icon: Clapperboard, label: 'Animation', count: '2,180 talents' },
  { icon: BarChart3, label: 'Data Analysis', count: '2,760 talents' },
  { icon: BrainCircuit, label: 'AI', count: '1,950 talents' },
  { icon: Gamepad2, label: 'Game Development', count: '1,320 talents' },
]

export function Categories() {
  return (
    <section id="categories" className="bg-muted/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Explore Categories
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            From a single line of code to a fully animated world — find experts in every craft.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.label} delay={(i % 4) * 0.05}>
              <Link
                href="/services"
                className="group flex h-full flex-col items-start gap-4 rounded-3xl bg-paper p-6 shadow-paper-sm transition-transform hover:-translate-y-1 hover:shadow-paper"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-background text-teal shadow-inset-sm transition-colors group-hover:text-teal-dark">
                  <cat.icon className="size-6" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{cat.label}</h3>
                  <p className="text-xs text-muted-foreground">{cat.count}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
