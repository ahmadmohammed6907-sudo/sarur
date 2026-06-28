"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Store, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { CATEGORY_NAMES } from "@/lib/constants";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-brand-500/60 focus:outline-none [&>option]:bg-ink-850";

export default function NewServicePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState<{
    title: string;
    category: string;
    price: string;
    deliveryDays: string;
    tags: string;
    imageUrl: string;
    description: string;
  }>({
    title: "",
    category: CATEGORY_NAMES[0],
    price: "",
    deliveryDays: "5",
    tags: "",
    imageUrl: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  if (!loading && user?.userType !== "freelancer") {
    return (
      <RoleGate
        title="Only freelancer accounts can list services"
        cta={{ label: "Create a freelancer account", href: "/auth/register" }}
      />
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          price: Number(form.price),
          deliveryDays: Number(form.deliveryDays),
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          imageUrl: form.imageUrl,
          description: form.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create service");
        if (data.fields) setFieldErrors(data.fields);
      } else {
        router.push(`/services/${data.id}`);
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
            <Store className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Create a service</h1>
            <p className="text-sm text-zinc-400">List what you offer and start receiving orders.</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <Field label="Service title" error={fieldErrors.title}>
            <input className={inputClass} placeholder="I will design a modern landing page in Figma"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category">
              <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Price (USD)" error={fieldErrors.price}>
              <input type="number" min={5} className={inputClass} placeholder="450"
                value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Delivery time (days)">
              <input type="number" min={1} className={inputClass}
                value={form.deliveryDays} onChange={(e) => setForm({ ...form, deliveryDays: e.target.value })} />
            </Field>
            <Field label="Tags (comma separated)">
              <input className={inputClass} placeholder="Figma, UI/UX, Landing"
                value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </Field>
          </div>

          <Field label="Cover image URL (optional)">
            <input className={inputClass} placeholder="https://…"
              value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </Field>

          <Field label="Description" error={fieldErrors.description}>
            <textarea rows={6} className={`${inputClass} resize-none`} placeholder="Describe what's included, your process, and why clients should choose you…"
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
            Publish service
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

function RoleGate({ title, cta }: { title: string; cta: { label: string; href: string } }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-zinc-400">
        <Lock className="h-6 w-6" />
      </span>
      <h1 className="mt-5 font-display text-xl font-bold text-white">{title}</h1>
      <Link href={cta.href} className="btn-primary mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold">
        {cta.label}
      </Link>
    </div>
  );
}
