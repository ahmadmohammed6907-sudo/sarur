import { NextResponse } from "next/server";
import { getFreelancerDetail } from "@/lib/queries";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const freelancer = await getFreelancerDetail(id);
  if (!freelancer) return jsonError("Freelancer not found", 404);
  return NextResponse.json({ freelancer });
}
