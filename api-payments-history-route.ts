import { NextResponse } from "next/server";
import { requireRole, handleApiError } from "@/lib/api";
import { listAllPayments } from "@/services/PaymentService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requireRole("admin");
    if (!auth.ok) return auth.response;

    const data = await listAllPayments(100);
    return NextResponse.json({ payments: data });
  } catch (error) {
    return handleApiError(error);
  }
}
