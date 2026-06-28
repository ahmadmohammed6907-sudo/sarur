import { NextResponse } from "next/server";
import { getServiceDetail } from "@/lib/queries";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const service = await getServiceDetail(id);
  if (!service) return jsonError("Service not found", 404);
  return NextResponse.json({ service });
}
