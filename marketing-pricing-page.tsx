"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants";
import { formatDollars } from "@/lib/utils";
import { SectionHeading } from "@/components/ui";

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto max-w-7xl py-14">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          subtitle="Start for free and upgrade as you grow. No hidden fees, cancel anytime."
        />

        {/* Toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-sm ${!annual ? "text-white" : "text-zinc-500"}`}>Monthly</span>
          <button
            onClick={() => setAnnual((v) => !v)}
            className="relative h-7 w-12 rounded-full border border-white/10 bg-white/10 transition"
            aria-label="Toggle billing period"
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 transition-all ${
                annual ? "left-6" : "left-0.5"
              }`}
            />
          </button>
          <span className={`text-sm ${annual ? "text-white" : "text-zinc-500"}`}>
            Annual <span className="text-emerald-400">(-20%)</span>
          </span>
        </div>

        {/* Plans */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const price = annual ? plan.annual : plan.monthly;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl p-7 ${
                  plan.highlight
                    ? "gradient-border ring-glow"
                    : "border border-white/10 bg-white/[0.03]"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">{plan.tagline}</p>
                <div className="mt-5 flex items-end gap-1">
                  <span className="font-display text-4xl font-bold text-white">
                    {price === 0 ? "$0" : formatDollars(price)}
                  </span>
                  {price > 0 && <span className="mb-1 text-sm text-zinc-500">/mo</span>}
                </div>
                {annual && price > 0 && (
                  <p className="mt-1 text-xs text-zinc-500">billed annually</p>
                )}

                <Link
                  href={plan.name === "Enterprise" ? "/contact" : "/auth/register"}
                  className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold ${
                    plan.highlight ? "btn-primary" : "btn-ghost text-white"
                  }`}
                >
                  {plan.cta}
                  {plan.highlight && <ArrowRight className="h-4 w-4" />}
                </Link>

                <ul className="mt-7 space-y-3 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-zinc-300">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-500/20 text-brand-400">
                        <Check className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* FAQ-ish note */}
        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-brand-400" />
          <p className="mt-3 text-sm text-zinc-300">
            All plans include secure escrow, dispute resolution, and access to
            our vetted talent pool. Need something custom?
          </p>
          <Link href="/contact" className="mt-3 inline-block text-sm font-semibold text-brand-400 hover:text-brand-300">
            Talk to our team →
          </Link>
        </div>
      </div>
    </div>
  );
}
