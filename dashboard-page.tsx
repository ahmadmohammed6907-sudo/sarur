"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Store,
  Send,
  CheckCircle2,
  Briefcase,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Loader2,
  Clock,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, StarRating, EmptyState } from "@/components/ui";
import { formatDollars, timeAgo } from "@/lib/utils";

type DashboardData = {
  role: "freelancer" | "client";
  stats: Record<string, number>;
  services?: Array<{
    id: string;
    title: string;
    price: number;
    rating: number;
    reviewCount: number;
    salesCount: number;
  }>;
  proposals?: Array<{
    id: string;
    bidAmount: number;
    status: string;
    coverLetter: string;
    createdAt: string;
    projectTitle: string;
    projectStatus: string;
    projectId: string;
  }>;
  projects?: Array<{
    id: string;
    title: string;
    budgetMin: number;
    budgetMax: number;
    status: string;
    category: string;
    proposalCount: number;
    createdAt: string;
  }>;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const isFreelancer = data.role === "freelancer";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Welcome back, {user?.fullName.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Here&apos;s what&apos;s happening with your{" "}
            {isFreelancer ? "freelance business" : "projects"} today.
          </p>
        </div>
        <Link
          href={isFreelancer ? "/services/new" : "/projects/new"}
          className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          {isFreelancer ? "New service" : "Post project"}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isFreelancer
          ? [
              { icon: Store, label: "Active services", value: data.stats.activeServices ?? 0, color: "text-brand-400" },
              { icon: Wallet, label: "Total sales", value: data.stats.totalSales ?? 0, color: "text-emerald-400" },
              { icon: Send, label: "Proposals sent", value: data.stats.proposalsSent ?? 0, color: "text-cyan-400" },
              { icon: CheckCircle2, label: "Accepted", value: data.stats.acceptedProposals ?? 0, color: "text-amber-400" },
            ].map((s) => (
              <StatCard key={s.label} {...s} />
            ))
          : [
              { icon: Briefcase, label: "Total projects", value: data.stats.totalProjects ?? 0, color: "text-brand-400" },
              { icon: TrendingUp, label: "Active", value: data.stats.activeProjects ?? 0, color: "text-cyan-400" },
              { icon: Users, label: "Proposals received", value: data.stats.totalProposals ?? 0, color: "text-amber-400" },
              { icon: Wallet, label: "Total budget", value: formatDollars(data.stats.totalBudget ?? 0), color: "text-emerald-400" },
            ].map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
      </div>

      {/* Lists */}
      {isFreelancer ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            title="My services"
            action={{ label: "Create", href: "/services/new" }}
            empty={data.services?.length === 0}
            emptyText="You haven't listed any services yet."
          >
            <div className="space-y-3">
              {data.services?.map((s) => (
                <Link
                  key={s.id}
                  href={`/services/${s.id}`}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:border-white/20"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{s.title}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                      <StarRating value={s.rating} showValue={false} />
                      <span>{s.salesCount} sales</span>
                    </div>
                  </div>
                  <span className="font-display text-sm font-bold text-white">
                    {formatDollars(s.price)}
                  </span>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel
            title="Recent proposals"
            action={{ label: "Find work", href: "/projects" }}
            empty={data.proposals?.length === 0}
            emptyText="You haven't applied to any projects yet."
          >
            <div className="space-y-3">
              {data.proposals?.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-white">{p.projectTitle}</p>
                    <StatusPill status={p.status} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {timeAgo(p.createdAt)}
                    </span>
                    <span className="font-semibold text-emerald-400">
                      Bid {formatDollars(p.bidAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      ) : (
        <Panel
          title="Your projects"
          action={{ label: "Post project", href: "/projects/new" }}
          empty={data.projects?.length === 0}
          emptyText="You haven't posted any projects yet."
        >
          {data.projects && data.projects.length > 0 ? (
            <div className="space-y-3">
              {data.projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/20"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{p.title}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                      <span>{p.category}</span>
                      <span>{p.proposalCount} proposals</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {timeAgo(p.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill status={p.status} />
                    <span className="font-display text-sm font-bold text-white">
                      {formatDollars(p.budgetMin)}–{formatDollars(p.budgetMax)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </Panel>
      )}

      {/* CTA banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-600/20 via-transparent to-cyan-600/15 p-6 sm:p-8">
        <h3 className="font-display text-lg font-semibold text-white">
          {isFreelancer ? "Looking for your next gig?" : "Need talent for your next project?"}
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          {isFreelancer
            ? "Browse fresh projects posted by clients every day."
            : "Browse thousands of vetted freelancers ready to help."}
        </p>
        <Link
          href={isFreelancer ? "/projects" : "/freelancers"}
          className="btn-primary mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
        >
          {isFreelancer ? "Browse projects" : "Hire talent"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Wallet;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl bg-white/5 ${color}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );
}

function Panel({
  title,
  action,
  empty,
  emptyText,
  children,
}: {
  title: string;
  action?: { label: string; href: string };
  empty?: boolean;
  emptyText?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-white">{title}</h2>
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300"
          >
            {action.label} <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      {empty ? (
        <EmptyState title="Nothing here yet" description={emptyText} />
      ) : (
        children
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "accepted" || status === "completed"
      ? "bg-emerald-500/15 text-emerald-300"
      : status === "rejected" || status === "cancelled"
      ? "bg-red-500/15 text-red-300"
      : status === "in_progress"
      ? "bg-cyan-500/15 text-cyan-300"
      : "bg-white/10 text-zinc-300";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${cls}`}>
      {status.replace("_", " ")}
    </span>
  );
}
