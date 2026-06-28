import { NextResponse } from "next/server";
import { getUserOr401 } from "@/lib/api";
import { getFreelancerDashboard, getClientDashboard } from "@/lib/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await getUserOr401();
  if (!auth.ok) return auth.response;

  const data =
    auth.user.userType === "freelancer"
      ? await getFreelancerDashboard(auth.user)
      : await getClientDashboard(auth.user);

  return NextResponse.json({ role: auth.user.userType, ...data });
}
