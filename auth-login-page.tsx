"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-brand-500/60 focus:outline-none";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
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

  function fillDemo(type: "freelancer" | "client") {
    setEmail(`${type}@sarur.app`);
    setPassword("Password123");
    setError(null);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-400">Email</label>
        <input
          type="email"
          className={inputClass}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-400">Password</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            className={inputClass}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
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
        Log in
      </button>

      {/* Demo accounts */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="text-xs font-medium text-zinc-400">Try a demo account:</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemo("freelancer")}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-zinc-300 hover:border-white/20 hover:text-white"
          >
            🎨 Freelancer
          </button>
          <button
            type="button"
            onClick={() => fillDemo("client")}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-zinc-300 hover:border-white/20 hover:text-white"
          >
            🏢 Client
          </button>
        </div>
        <p className="mt-2 text-[11px] text-zinc-600">Password for all: Password123</p>
      </div>

      <p className="text-center text-sm text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-brand-400 hover:text-brand-300">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
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
            Welcome back. Let&apos;s get to work.
          </h2>
          <p className="mt-4 max-w-md text-zinc-300">
            Log in to manage your projects, track proposals, and grow on SARUR.
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
            Log in to SARUR
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            New here?{" "}
            <Link href="/auth/register" className="font-semibold text-brand-400 hover:text-brand-300">
              Create an account
            </Link>
          </p>

          <div className="mt-8">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
