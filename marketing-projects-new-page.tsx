"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, Briefcase, Lock } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { CATEGORY_NAMES } from "@/lib/constants";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-brand-500/60 focus:outline-none [&>option]:bg-ink-850";

export default function NewProjectPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState<{
    title: string;
    category: string;
    budgetMin: string;
    budgetMax: string;
    experienceLevel: string;
    duration: string;
    skills: string;
    deadline: string;
    description: string;
  }>({
    title: "",
    category: CATEGORY_NAMES[0],
    budgetMin: "",
    budgetMax: "",
    experienceLevel: "intermediate",
    duration: "",
    skills: "",
    deadline: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  if (!loading && user?.userType !== "client") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-zinc-400">
          <Lock className="h-6 w-6" />
        </span>
        <h1 className="mt-5 font-display text-xl font-bold text-white">
          Only client accounts can post projects
        </h1>
        <Link href="/auth/register" className="btn-primary mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold">
          Create a client account
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          budgetMin: Number(form.budgetMin),
          budgetMax: Number(form.budgetMax),
          experienceLevel: form.experienceLevel,
          duration: form.duration,
          skillsRequired: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
          deadline: form.deadline || undefined,
          description: form.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to post project");
        if (data.fields) setFieldErrors(data.fields);
      } else {
        router.push(`/projects/${data.id}`);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto max-w-2xl py-10">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white">
          ← Back to dashboard
        </Link>
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-brand-400">
            <Briefcase className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Post a project</h1>
            <p className="text-sm text-zinc-400">Describe what you need and get proposals from top talent.</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <Field label="Project title" error={fieldErrors.title}>
            <input className={inputClass} placeholder="Build a mobile app with React Native"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category">
              <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Experience level">
              <select className={inputClass} value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
                <option value="beginner">Entry / Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Min budget (USD)" error={fieldErrors.budgetMin}>
              <input type="number" min={50} className={inputClass} placeholder="1000"
                value={form.budgetMin} onChange={(e) => setForm({ ...form, budgetMin: e.target.value })} />
            </Field>
            <Field label="Max budget (USD)" error={fieldErrors.budgetMax}>
              <input type="number" min={50} className={inputClass} placeholder="3000"
                value={form.budgetMax} onChange={(e) => setForm({ ...form, budgetMax: e.target.value })} />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Project duration">
              <select className={inputClass} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}>
                <option value="">Select duration</option>
                <option>Less than 1 month</option>
                <option>1 to 3 months</option>
                <option>3 to 6 months</option>
                <option>More than 6 months</option>
              </select>
            </Field>
            <Field label="Deadline (optional)">
              <input type="date" className={inputClass}
                value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </Field>
          </div>

          <Field label="Skills required (comma separated)">
            <input className={inputClass} placeholder="React, Node.js, PostgreSQL"
              value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          </Field>

          <Field label="Project description" error={fieldErrors.description}>
            <textarea rows={6} className={`${inputClass} resize-none`} placeholder="Describe your project, goals, requirements, and any deliverables…"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold disabled:opacity-60">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Post project
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string[]; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</span>
      {children}
      {error && error.length > 0 && <span className="mt-1 block text-xs text-red-400">{error[0]}</span>}
    </label>
  );
}
