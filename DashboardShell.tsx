"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Menu,
  X,
  Plus,
  Search,
  Briefcase,
  Store,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Users,
  DollarSign,
  Activity,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";

export function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: "freelancer" | "client" | "admin";
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav =
    role === "admin"
      ? adminNav()
      : role === "freelancer"
      ? freelancerNav()
      : clientNav();

  return (
    <div className="relative z-10 min-h-screen lg:flex">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-white/10 bg-ink-900/60 p-5 backdrop-blur lg:flex">
        <SidebarContent nav={nav} pathname={pathname} user={user} logout={logout} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-white/10 bg-ink-900 p-5">
            <button
              className="absolute right-3 top-4 text-zinc-400 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent nav={nav} pathname={pathname} user={user} logout={logout} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/70 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <button
              className="grid h-9 w-9 place-items-center rounded-lg text-white hover:bg-white/5 lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" /> View site
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Avatar name={user?.fullName ?? "U"} src={user?.avatarUrl ?? null} size="sm" />
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  nav,
  pathname,
  user,
  logout,
}: {
  nav: { label: string; href: string; icon: typeof LayoutDashboard }[];
  pathname: string;
  user: { fullName: string; email: string; userType: string; avatarUrl: string | null } | null;
  logout: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400">
          <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
        </span>
        <span className="font-display text-xl font-bold text-white">SARUR</span>
      </Link>

      <nav className="mt-8 flex-1 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <Avatar name={user?.fullName ?? "U"} src={user?.avatarUrl ?? null} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.fullName}</p>
            <p className="truncate text-xs capitalize text-zinc-500">{user?.userType}</p>
          </div>
          <button onClick={logout} className="text-zinc-500 hover:text-white" aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function adminNav() {
  return [
    { label: "لوحة الإدارة", href: "/dashboard/admin", icon: ShieldCheck },
    { label: "المستخدمون", href: "/dashboard/admin/users", icon: Users },
    { label: "المدفوعات", href: "/dashboard/admin/payments", icon: DollarSign },
    { label: "صحة المنصة", href: "/dashboard/admin/health", icon: Activity },
    { label: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
  ];
}

/* Shared nav config builders */
export function freelancerNav() {
  return [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Find work", href: "/projects", icon: Search },
    { label: "Create service", href: "/services/new", icon: Plus },
    { label: "My services", href: "/services", icon: Store },
  ];
}

export function clientNav() {
  return [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Post project", href: "/projects/new", icon: Plus },
    { label: "Hire talent", href: "/freelancers", icon: Briefcase },
    { label: "Browse services", href: "/services", icon: Store },
  ];
}
