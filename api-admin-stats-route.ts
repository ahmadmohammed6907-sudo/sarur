import { NextResponse } from "next/server";
import { requireRole, handleApiError } from "@/lib/api";
import { db } from "@/db";
import { users, services, projects, payments } from "@/db/schema";
import { eq, sql, sum } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requireRole("admin");
    if (!auth.ok) return auth.response;

    // Run all count queries in parallel
    const [
      [usersRow],
      [freelancersRow],
      [clientsRow],
      [servicesRow],
      [projectsRow],
      [paymentsRow],
      [revenueRow],
      [pendingRow],
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(users),
      db.select({ count: sql<number>`count(*)::int` }).from(users).where(eq(users.userType, "freelancer")),
      db.select({ count: sql<number>`count(*)::int` }).from(users).where(eq(users.userType, "client")),
      db.select({ count: sql<number>`count(*)::int` }).from(services),
      db.select({ count: sql<number>`count(*)::int` }).from(projects),
      db.select({ count: sql<number>`count(*)::int` }).from(payments),
      db.select({ total: sum(payments.amount) }).from(payments).where(eq(payments.status, "completed")),
      db.select({ count: sql<number>`count(*)::int` }).from(payments).where(eq(payments.status, "pending")),
    ]);

    return NextResponse.json({
      totalUsers: usersRow?.count ?? 0,
      totalFreelancers: freelancersRow?.count ?? 0,
      totalClients: clientsRow?.count ?? 0,
      totalServices: servicesRow?.count ?? 0,
      totalProjects: projectsRow?.count ?? 0,
      totalPayments: paymentsRow?.count ?? 0,
      totalRevenue: Number(revenueRow?.total ?? 0),
      pendingPayments: pendingRow?.count ?? 0,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
