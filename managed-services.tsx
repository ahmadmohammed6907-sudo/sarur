import Link from 'next/link'
import { Code2, Clapperboard, BarChart3, BrainCircuit, Gamepad2, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Reveal } from './reveal'

const MANAGED = [
  { icon: Code2, label: 'Full Software Development' },
  { icon: Clapperboard, label: 'Animation Production' },
  { icon: Gamepad2, label: 'Game Development' },
  { icon: BarChart3, label: 'Data Analytics' },
  { icon: BrainCircuit, label: 'AI Solutions' },
]

const WORKFLOW = ['Submit Requirements', 'Company Review', 'Team Assignment', 'Project Delivery']

export function ManagedServices() {
  return (
    <section id="managed" className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
      <div className="overflow-hidden rounded-[2.5rem] bg-teal-dark p-8 shadow-paper-lg sm:p-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="inline-block rounded-full bg-paper/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-paper">
              SARUR Managed Services
            </span>
            <h2 className="mt-6 text-balance text-3xl font-extrabold leading-tight text-paper sm:text-4xl">
              Let our in-house team deliver your whole project.
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-paper/75">
              For large or complex initiatives, skip the hiring. SARUR&apos;s managed
              team takes your project from requirements to final delivery — fully
              accountable, end to end.
            </p>

            <div className="mt-8 space-y-3">
              {WORKFLOW.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-full bg-sage text-sm font-bold text-teal-dark">
                    {i + 1}
                  </span>
                  <span className="font-medium text-paper">{step}</span>
                  {i < WORKFLOW.length - 1 && (
                    <ArrowRight className="size-4 text-paper/40" />
                  )}
                </div>
              ))}
            </div>

            <Link
              href="/managed"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-sm font-semibold text-teal-dark shadow-paper transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              Request Full Delivery <ArrowRight className="size-4" />
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-4">
              {MANAGED.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center gap-4 rounded-2xl bg-paper/10 p-5 backdrop-blur-sm"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-paper/15 text-sage">
                    <m.icon className="size-6" />
                  </span>
                  <span className="flex-1 font-bold text-paper">{m.label}</span>
                  <CheckCircle2 className="size-5 text-sage" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
