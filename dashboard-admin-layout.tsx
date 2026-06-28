import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { DashboardShell } from "@/components/DashboardShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  // Double-check at layout level (middleware already blocks non-admins)
  if (!user || user.userType !== "admin") {
    redirect("/dashboard");
  }

  return <DashboardShell role="admin">{children}</DashboardShell>;
}
