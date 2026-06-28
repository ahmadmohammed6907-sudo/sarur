import type { Metadata } from "next";
import Link from "next/link";
import {
  DollarSign,
  Share2,
  TrendingUp,
  Users,
  ArrowRight,
  Gift,
  BarChart3,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Affiliate Program — SARUR",
  description:
    "Earn commission by referring clients and freelancers to SARUR. Join our affiliate program and grow your income.",
};

const TIERS = [
  {
    name: "Starter",
    commission: "5%",
    referrals: "1–10 / month",
    perks: ["Affiliate dashboard", "Referral links & banners", "Monthly payouts"],
    highlight: false,
  },
  {
    name: "Partner",
    commission: "10%",
    referrals: "11–50 / month",
    perks: [
      "Everything in Starter",
      "Priority support",
      "Co-marketing opportunities",
      "Bi-weekly payouts",
    ],
    highlight: true,
  },
  {
    name: "Elite",
    commission: "15%",
    referrals: "50+ / month",
    perks: [
      "Everything in Partner",
      "Dedicated affiliate manager",
      "Custom landing pages",
      "Weekly payouts",
      "Early access to new features",
    ],
    highlight: false,
  },
];

const HOW_IT_WORKS = [
  {
    icon: Share2,
    title: "Share Your Link",
    description: "Get your unique referral link from the affiliate dashboard and share it anywhere.",
  },
  {
    icon: Users,
    title: "Referred Users Sign Up",
    description: "When someone signs up via your link, they're automatically tracked to your account.",
  },
  {
    icon: DollarSign,
    title: "Earn Commission",
    description: "You earn a percentage of every transaction your referred users make on SARUR.",
  },
  {
    icon: TrendingUp,
    title: "Scale Your Earnings",
    description: "The more you refer, the higher your tier — and the higher your commission rate.",
  },
];

export default function AffiliatePage() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <span className="inline-block rounded-full bg-[var(--primary)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-6">
          Affiliate Program
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Refer. Earn.{" "}
          <span className="text-[var(--primary)]">Repeat.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-[var(--muted-foreground)]">
          Join the SARUR affiliate program and earn up to 15% commission on every transaction from
          users you refer. No cap on earnings.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-3.5 text-sm font-semibold text-[var(--primary-foreground)] shadow-md hover:bg-[var(--accent)] transition-colors"
          >
            Join Now — It&apos;s Free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-8 py-3.5 text-sm font-semibold hover:border-[var(--primary)] transition-colors"
          >
            Talk to Us
          </Link>
        </div>

        {/* Quick stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto">
          {[
            { label: "Avg. monthly earning", value: "$1,200+" },
            { label: "Max commission", value: "15%" },
            { label: "Payout methods", value: "3+" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <div className="text-2xl font-extrabold text-[var(--primary)]">{value}</div>
              <div className="mt-1 text-xs text-[var(--muted-foreground)]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[var(--card)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold mb-14">How it works</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10">
                  <Icon className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold mb-4">Commission Tiers</h2>
        <p className="text-center text-[var(--muted-foreground)] mb-14 max-w-xl mx-auto">
          Automatically move up as you refer more users. Higher tiers unlock bigger commissions and
          exclusive perks.
        </p>
        <div className="grid gap-8 lg:grid-cols-3">
          {TIERS.map(({ name, commission, referrals, perks, highlight }) => (
            <div
              key={name}
              className={`rounded-2xl border p-8 ${
                highlight
                  ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-lg"
                  : "border-[var(--border)] bg-[var(--card)]"
              }`}
            >
              {highlight && (
                <span className="mb-4 inline-block rounded-full bg-[var(--primary)] px-3 py-0.5 text-xs font-semibold text-[var(--primary-foreground)]">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold">{name}</h3>
              <div className="mt-2 text-4xl font-extrabold text-[var(--primary)]">{commission}</div>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">commission · {referrals}</p>
              <ul className="mt-6 space-y-3">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm">
                    <Gift className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="bg-[var(--card)] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-bold mb-14">Your affiliate toolkit</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: BarChart3,
                title: "Live Dashboard",
                desc: "Track clicks, sign-ups, and earnings in real time.",
              },
              {
                icon: Share2,
                title: "Marketing Assets",
                desc: "Ready-made banners, links, and copy in Arabic & English.",
              },
              {
                icon: Zap,
                title: "Fast Payouts",
                desc: "Get paid via bank transfer, PayPal, or SARUR credits.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 text-center">
                <div className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10">
                  <Icon className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--primary)] py-20 text-[var(--primary-foreground)]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <DollarSign className="mx-auto mb-6 h-12 w-12 opacity-80" />
          <h2 className="text-3xl font-bold">Start earning today</h2>
          <p className="mt-4 text-lg opacity-80">
            Signing up is free and takes less than 2 minutes. Your first referral could come today.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--primary-foreground)] px-8 py-3.5 text-sm font-semibold text-[var(--primary)] hover:opacity-90 transition-opacity"
          >
            Create Free Account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
