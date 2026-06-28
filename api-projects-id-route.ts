import { NextResponse } from "next/server";
import { getProjectDetail } from "@/lib/queries";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await getProjectDetail(id);
  if (!project) return jsonError("Project not found", 404);
  return NextResponse.json({ project });
}
