"use client";

import { useState } from "react";
import {
  Mail,
  MessageSquare,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { INTERESTS } from "@/lib/constants";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-brand-500/60 focus:outline-none transition";

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    interest: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: [] }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        if (data.fields) setFieldErrors(data.fields);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="px-4 sm:px-6">
        <div className="mx-auto flex max-w-xl flex-col items-center py-24 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold text-white">Message sent!</h1>
          <p className="mt-3 text-zinc-400">
            Thanks for reaching out, {form.fullName.split(" ")[0] || "there"}. Our team
            will get back to you within one business day.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setForm({ fullName: "", email: "", company: "", interest: "", message: "" });
            }}
            className="btn-ghost mt-6 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto max-w-7xl py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          {/* Info */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              Contact us
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white">
              Let&apos;s talk
            </h1>
            <p className="mt-4 max-w-md text-zinc-400">
              Have a question about hiring, enterprise plans, or partnerships? Fill
              out the form and we&apos;ll respond within one business day.
            </p>

            <div className="mt-10 space-y-5">
              {[
                { icon: Mail, label: "Email", value: "hello@sarur.app" },
                { icon: MessageSquare, label: "Live chat", value: "Mon–Fri, 9am–6pm" },
                { icon: MapPin, label: "Office", value: "Remote-first · Global team" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-brand-400">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">{c.label}</p>
                    <p className="text-sm font-medium text-white">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={submit}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={fieldErrors.fullName}>
                <input
                  className={inputClass}
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  placeholder="Jane Doe"
                />
              </Field>
              <Field label="Email" error={fieldErrors.email}>
                <input
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="jane@company.com"
                />
              </Field>
              <Field label="Company (optional)">
                <input
                  className={inputClass}
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="Acme Inc."
                />
              </Field>
              <Field label="I'm interested in" error={fieldErrors.interest}>
                <select
                  className={`${inputClass} [&>option]:bg-ink-850`}
                  value={form.interest}
                  onChange={(e) => set("interest", e.target.value)}
                >
                  <option value="">Select an option</option>
                  {INTERESTS.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Message" error={fieldErrors.message}>
                <textarea
                  rows={5}
                  className={`${inputClass} resize-none`}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Tell us how we can help…"
                />
              </Field>
            </div>

            {error && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</span>
      {children}
      {error && error.length > 0 && (
        <span className="mt-1 block text-xs text-red-400">{error[0]}</span>
      )}
    </label>
  );
}
