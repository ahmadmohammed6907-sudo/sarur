import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { DashboardShell } from "@/components/DashboardShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?redirect=/dashboard");

  const role = user.userType === "client" ? "client" : "freelancer";
  return <DashboardShell role={role}>{children}</DashboardShell>;
}
