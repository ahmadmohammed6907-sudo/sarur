"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Sparkles, Loader2, AlertCircle, Check, Briefcase, Building2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-brand-500/60 focus:outline-none";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: "freelancer" as "freelancer" | "client",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        if (data.fields) setFieldErrors(data.fields);
      } else {
        await refresh();
        const redirect = params.get("redirect") || "/dashboard";
        router.push(redirect);
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const pw = form.password;
  const checks = [
    { ok: pw.length >= 8, label: "8+ characters" },
    { ok: /[A-Z]/.test(pw), label: "uppercase letter" },
    { ok: /[0-9]/.test(pw), label: "number" },
  ];

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Account type toggle */}
      <div>
        <span className="mb-2 block text-xs font-medium text-zinc-400">I want to</span>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "freelancer", label: "Find work", icon: Briefcase, desc: "As a freelancer" },
            { value: "client", label: "Hire talent", icon: Building2, desc: "As a client" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, userType: opt.value as "freelancer" | "client" }))}
              className={`rounded-xl border p-4 text-left transition ${
                form.userType === opt.value
                  ? "border-brand-500/60 bg-brand-500/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <opt.icon className={`h-5 w-5 ${form.userType === opt.value ? "text-brand-400" : "text-zinc-400"}`} />
              <p className="mt-2 text-sm font-semibold text-white">{opt.label}</p>
              <p className="text-xs text-zinc-500">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <input
          className={inputClass}
          placeholder="Full name"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
        />
        {fieldErrors.fullName && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.fullName[0]}</p>
        )}
      </div>

      <div>
        <input
          type="email"
          className={inputClass}
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.email[0]}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          className={inputClass}
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {checks.map((c) => (
            <span
              key={c.label}
              className={`flex items-center gap-1 text-[11px] ${c.ok ? "text-emerald-400" : "text-zinc-600"}`}
            >
              <Check className="h-3 w-3" /> {c.label}
            </span>
          ))}
        </div>
        {fieldErrors.password && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.password[0]}</p>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Create account
      </button>

      <p className="text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-brand-400 hover:text-brand-300">
          Log in
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600/30 via-ink-900 to-cyan-600/15 p-12 lg:flex">
        <div className="absolute inset-0 noise opacity-[0.03]" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400">
            <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-bold text-white">SARUR</span>
        </Link>
        <div className="relative">
          <h2 className="font-display text-4xl font-bold leading-tight text-white">
            Join 85,000+ professionals building the future of work.
          </h2>
          <p className="mt-4 max-w-md text-zinc-300">
            Whether you&apos;re hiring or getting hired, SARUR gives you the tools,
            talent, and trust to get great work done.
          </p>
        </div>
        <div className="relative flex gap-8">
          {[
            ["85k+", "Freelancers"],
            ["320k+", "Projects done"],
            ["$240M+", "Paid out"],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="font-display text-2xl font-bold text-white">{v}</p>
              <p className="text-xs text-zinc-400">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Link href="/" className="mb-8 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400">
                <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
              </span>
              <span className="font-display text-xl font-bold text-white">SARUR</span>
            </Link>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-400">It&apos;s free to get started.</p>

          <div className="mt-8">
            <Suspense fallback={null}>
              <RegisterForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
