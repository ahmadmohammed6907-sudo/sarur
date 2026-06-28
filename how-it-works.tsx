import { FileText, Inbox, Handshake, CheckCircle2, UserPlus, FolderUp, ShieldCheck, Wallet } from 'lucide-react'
import { Reveal } from './reveal'

const CLIENT_STEPS = [
  { icon: FileText, title: 'Post Project', desc: 'Describe what you need in a guided wizard.' },
  { icon: Inbox, title: 'Receive Proposals', desc: 'Verified freelancers bid on your project.' },
  { icon: Handshake, title: 'Hire Talent', desc: 'Pick the perfect match and start working.' },
  { icon: CheckCircle2, title: 'Get Results', desc: 'Approve milestones and release payment.' },
]

const FREELANCER_STEPS = [
  { icon: UserPlus, title: 'Register', desc: 'Create your freelancer account in minutes.' },
  { icon: FolderUp, title: 'Submit Portfolio', desc: 'Upload your best work and skills.' },
  { icon: ShieldCheck, title: 'Company Review', desc: 'Our team reviews and verifies your profile.' },
  { icon: Wallet, title: 'Start Earning', desc: 'Send proposals and grow your income.' },
]

function StepColumn({
  label,
  steps,
}: {
  label: string
  steps: typeof CLIENT_STEPS
}) {
  return (
    <div className="rounded-[2rem] bg-paper p-6 shadow-paper sm:p-8">
      <span className="inline-block rounded-full bg-muted px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-dark shadow-inset-sm">
        {label}
      </span>
      <div className="mt-6 space-y-4">
        {steps.map((step, i) => (
          <div key={step.title} className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-background text-teal shadow-inset-sm">
              <step.icon className="size-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sage">0{i + 1}</span>
                <h4 className="font-bold text-ink">{step.title}</h4>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          How SARUR Works
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          A simple, transparent flow for both sides of the marketplace.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <StepColumn label="For Clients" steps={CLIENT_STEPS} />
        </Reveal>
        <Reveal delay={0.1}>
          <StepColumn label="For Freelancers" steps={FREELANCER_STEPS} />
        </Reveal>
      </div>
    </section>
  )
}
