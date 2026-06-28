"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, CheckCircle2, Lock } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export function ProposalForm({
  projectId,
  canApply,
}: {
  projectId: string;
  canApply: boolean;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [bid, setBid] = useState("");
  const [days, setDays] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <Lock className="mx-auto h-6 w-6 text-zinc-500" />
        <p className="mt-3 text-sm text-zinc-300">Sign in as a freelancer to submit a proposal.</p>
        <button
          onClick={() => router.push("/auth/login?redirect=" + encodeURIComponent(`/projects/${projectId}`))}
          className="btn-primary mt-4 inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold"
        >
          Log in to apply
        </button>
      </div>
    );
  }

  if (!canApply) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <Lock className="mx-auto h-6 w-6 text-zinc-500" />
        <p className="mt-3 text-sm text-zinc-300">
          Only freelancer accounts can submit proposals.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
        <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-400" />
        <p className="mt-3 font-semibold text-white">Proposal sent!</p>
        <p className="mt-1 text-sm text-zinc-400">The client will review your application shortly.</p>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!bid || !letter) {
      setError("Please enter your bid and a cover letter.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          bidAmount: Number(bid),
          coverLetter: letter,
          estimatedDays: days ? Number(days) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-brand-500/60 focus:outline-none";

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="font-display text-lg font-semibold text-white">Submit a proposal</h3>
      <p className="mt-1 text-sm text-zinc-400">Tell the client why you're the perfect fit.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">Your bid (USD)</label>
          <input
            type="number"
            min={1}
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            placeholder="2500"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">Est. days</label>
          <input
            type="number"
            min={1}
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="14"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1.5 block text-xs font-medium text-zinc-400">Cover letter</label>
        <textarea
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          rows={5}
          placeholder="Describe your approach, relevant experience, and timeline…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Submit proposal
      </button>
    </form>
  );
}
