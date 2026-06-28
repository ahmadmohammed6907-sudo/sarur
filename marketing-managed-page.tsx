import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Zap,
  BarChart3,
  HeadphonesIcon,
  CheckCircle2,
  ArrowRight,
  Building2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Managed Solutions — SARUR",
  description:
    "End-to-end project delivery managed by SARUR. We handle vetting, coordination, and quality assurance so you can focus on your business.",
};

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Vetted Talent",
    description:
      "Every freelancer on a managed project goes through our rigorous vetting process — technical assessments, portfolio review, and background checks.",
  },
  {
    icon: Users,
    title: "Dedicated Project Manager",
    description:
      "A SARUR project manager coordinates your team, tracks milestones, and keeps everything on schedule from kickoff to delivery.",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    description:
      "We match your project with pre-vetted specialists within 48 hours so work starts immediately — no lengthy bidding periods.",
  },
  {
    icon: BarChart3,
    title: "Progress Reporting",
    description:
      "Real-time dashboards and weekly reports keep you informed at every stage. No surprises, full transparency.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description:
      "Priority support channel with guaranteed response times. Your project manager is always reachable.",
  },
  {
    icon: Building2,
    title: "Enterprise Ready",
    description:
      "NDAs, custom contracts, invoicing, and compliance documentation available for enterprise clients.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Submit Your Brief",
    description: "Describe your project, timeline, and budget. Our team reviews it within 24 hours.",
  },
  {
    step: "02",
    title: "We Build Your Team",
    description:
      "We hand-pick the best-fit freelancers from our vetted pool and assign a project manager.",
  },
  {
    step: "03",
    title: "Work Begins",
    description: "Your dedicated team starts immediately with clear milestones and deliverables.",
  },
  {
    step: "04",
    title: "Review & Deliver",
    description:
      "SARUR QA reviews all deliverables before you see them. You approve — we ship.",
  },
];

export default function ManagedPage() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <span className="inline-block rounded-full bg-[var(--primary)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-6">
          Managed Solutions
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          We run the project.
          <br />
          <span className="text-[var(--primary)]">You own the outcome.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-[var(--muted-foreground)]">
          For teams that need results without the overhead of managing freelancers themselves.
          SARUR Managed Solutions gives you a dedicated team, a project manager, and guaranteed
          delivery — all under one roof.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-3.5 text-sm font-semibold text-[var(--primary-foreground)] shadow-md hover:bg-[var(--accent)] transition-colors"
          >
            Get a Free Consultation <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-8 py-3.5 text-sm font-semibold hover:border-[var(--primary)] transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[var(--card)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold mb-14">Everything handled for you</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 hover:border-[var(--primary)] transition-colors"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10">
                  <Icon className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold mb-14">How it works</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ step, title, description }) => (
            <div key={step} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-lg font-bold text-[var(--primary-foreground)]">
                {step}
              </div>
              <h3 className="mb-2 font-semibold">{title}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--primary)] py-20 text-[var(--primary-foreground)]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <CheckCircle2 className="mx-auto mb-6 h-12 w-12 opacity-80" />
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-4 text-lg opacity-80">
            Tell us about your project and we&apos;ll get back to you within 24 hours with a
            tailored plan.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--primary-foreground)] px-8 py-3.5 text-sm font-semibold text-[var(--primary)] hover:opacity-90 transition-opacity"
          >
            Contact Us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
