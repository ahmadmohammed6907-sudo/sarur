import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Heart,
  ShieldCheck,
  Globe2,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";
import { STATS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "About SARUR",
  description: "Our mission is to unlock the future of work by connecting talent with opportunity.",
};

const VALUES = [
  {
    icon: Target,
    title: "Mission-driven",
    description: "We exist to give every talented person access to great work — wherever they are.",
  },
  {
    icon: ShieldCheck,
    title: "Trust first",
    description: "Escrow, vetting, and transparency are built into everything we ship.",
  },
  {
    icon: Heart,
    title: "People over profit",
    description: "Low fees and fair payouts mean talent keeps more of what they earn.",
  },
  {
    icon: Zap,
    title: "Move fast",
    description: "We obsess over reducing friction so great work happens sooner.",
  },
];

const TIMELINE = [
  { year: "2023", title: "SARUR is born", text: "Founded with a simple idea: make hiring freelancers effortless and fair." },
  { year: "2024", title: "10,000 talents", text: "Crossed our first major milestone of vetted professionals on the platform." },
  { year: "2025", title: "Global expansion", text: "Launched escrow payments and expanded to 190+ countries." },
  { year: "2026", title: "$240M+ paid out", text: "Became a trusted marketplace for the next generation of work." },
];

export default function AboutPage() {
  return (
    <div className="px-4 sm:px-6">
      {/* Hero */}
      <section className="mx-auto max-w-4xl py-14 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
          Our story
        </span>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          We&apos;re building the <span className="text-gradient">future of work</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          SARUR was founded on a belief that talent is everywhere, but
          opportunity is not. We connect ambitious teams with the world&apos;s best
          freelancers — securely, fairly, and without the friction.
        </p>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-gradient sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-zinc-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl py-20">
        <SectionHeading
          eyebrow="What we value"
          title="Principles that guide us"
          subtitle="These aren't posters on a wall — they shape every product decision we make."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-brand-400">
                <v.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-4xl py-10">
        <SectionHeading eyebrow="Our journey" title="Milestones along the way" />
        <div className="mt-12 space-y-8">
          {TIMELINE.map((t, i) => (
            <div key={t.year} className="relative flex gap-6">
              <div className="flex flex-col items-center">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 font-display text-sm font-bold text-white">
                  {t.year}
                </span>
                {i < TIMELINE.length - 1 && (
                  <span className="mt-2 w-px flex-1 bg-gradient-to-b from-white/20 to-transparent" />
                )}
              </div>
              <div className="pb-4">
                <h3 className="font-display text-lg font-semibold text-white">{t.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global CTA */}
      <section className="mx-auto max-w-7xl py-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-600/20 via-transparent to-cyan-600/15 p-10 text-center sm:p-14">
          <Globe2 className="mx-auto h-8 w-8 text-brand-400" />
          <h2 className="mt-4 font-display text-3xl font-bold text-white">
            Join a global movement of talent and teams
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-zinc-300">
            Whether you&apos;re hiring or getting hired, there&apos;s a place for you on SARUR.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/auth/register" className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn-ghost inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white">
              <Users className="h-4 w-4" /> Contact sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
