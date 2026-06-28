"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Store,
  Briefcase,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Activity,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatDollars, timeAgo } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────────── */

interface AdminStats {
  totalUsers: number;
  totalFreelancers: number;
  totalClients: number;
  totalServices: number;
  totalProjects: number;
  totalPayments: number;
  totalRevenue: number; // in cents
  pendingPayments: number;
}

interface PaymentRow {
  id: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  provider: string;
  providerOrderId: string | null;
  createdAt: string;
}

interface HealthData {
  status: "healthy" | "degraded" | "unhealthy";
  database: { status: string; latency: number };
  memory: { used: number; total: number };
  uptime: number;
}

/* ── Stat Card ──────────────────────────────────────────────────────── */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "violet",
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  sub?: string;
  color?: "violet" | "cyan" | "emerald" | "amber" | "rose";
}) {
  const colors = {
    violet: "from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-400",
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400",
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400",
    rose: "from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-400",
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-5 ${colors[color]}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-400">{label}</p>
        <Icon className="h-5 w-5 opacity-70" />
      </div>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
    </div>
  );
}

/* ── Payment Status Badge ───────────────────────────────────────────── */

function StatusBadge({ status }: { status: PaymentRow["status"] }) {
  const map = {
    completed: { icon: CheckCircle2, label: "مكتمل", cls: "text-emerald-400 bg-emerald-400/10" },
    pending: { icon: Clock, label: "قيد الانتظار", cls: "text-amber-400 bg-amber-400/10" },
    failed: { icon: XCircle, label: "فاشل", cls: "text-rose-400 bg-rose-400/10" },
    refunded: { icon: AlertCircle, label: "مسترجع", cls: "text-zinc-400 bg-zinc-400/10" },
  };
  const { icon: Icon, label, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

/* ── Health Status ──────────────────────────────────────────────────── */

function HealthCard({ health }: { health: HealthData | null }) {
  if (!health) return null;

  const isHealthy = health.status === "healthy";
  const uptime = Math.floor(health.uptime / 3600);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-zinc-400" />
        <h3 className="text-sm font-semibold text-white">صحة المنصة</h3>
        <span
          className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            isHealthy
              ? "bg-emerald-400/10 text-emerald-400"
              : "bg-rose-400/10 text-rose-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${isHealthy ? "bg-emerald-400" : "bg-rose-400"} animate-pulse`}
          />
          {isHealthy ? "سليم" : "تنبيه"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs text-zinc-500">قاعدة البيانات</p>
          <p className="mt-1 text-sm font-semibold text-white">{health.database.latency}ms</p>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs text-zinc-500">الذاكرة</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {health.memory.used}/{health.memory.total}MB
          </p>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs text-zinc-500">وقت التشغيل</p>
          <p className="mt-1 text-sm font-semibold text-white">{uptime}h</p>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────── */

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, paymentsRes, healthRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/payments/history"),
          fetch("/api/health"),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (paymentsRes.ok) {
          const d = await paymentsRes.json();
          setPayments(d.payments ?? []);
        }
        if (healthRes.ok) setHealth(await healthRes.json());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const totalRevenueDollars = stats ? (stats.totalRevenue / 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">لوحة الإدارة</h1>
          <p className="text-sm text-zinc-400">إشراف كامل على منصة سرور</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="إجمالي المستخدمين"
          value={stats?.totalUsers ?? "—"}
          sub={`${stats?.totalFreelancers ?? 0} مستقل · ${stats?.totalClients ?? 0} عميل`}
          color="violet"
        />
        <StatCard
          icon={Store}
          label="الخدمات"
          value={stats?.totalServices ?? "—"}
          color="cyan"
        />
        <StatCard
          icon={Briefcase}
          label="المشاريع"
          value={stats?.totalProjects ?? "—"}
          color="emerald"
        />
        <StatCard
          icon={DollarSign}
          label="الإيرادات"
          value={`$${totalRevenueDollars}`}
          sub={`${stats?.totalPayments ?? 0} معاملة`}
          color="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="مدفوعات معلقة"
          value={stats?.pendingPayments ?? 0}
          color="rose"
        />
      </div>

      {/* Health + Payments grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Health */}
        <div className="lg:col-span-1">
          <HealthCard health={health} />
        </div>

        {/* Recent payments */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h3 className="text-sm font-semibold text-white">أحدث المدفوعات</h3>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-400">
                {payments.length} معاملة
              </span>
            </div>

            {payments.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-zinc-500">
                <DollarSign className="h-8 w-8 opacity-30" />
                <p className="text-sm">لا توجد مدفوعات بعد</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {payments.slice(0, 8).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4 px-5 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white font-mono">
                        {p.providerOrderId?.slice(0, 18) ?? p.id.slice(0, 18)}…
                      </p>
                      <p className="text-xs text-zinc-500">{timeAgo(p.createdAt)}</p>
                    </div>
                    <StatusBadge status={p.status} />
                    <p className="text-sm font-semibold text-white shrink-0">
                      {formatDollars(p.amount / 100)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
