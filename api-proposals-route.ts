import { NextResponse } from "next/server";
import { db } from "@/db";
import { proposals, projects } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { proposalSchema } from "@/lib/validation";
import { requireRole, jsonError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireRole("freelancer");
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body", 400);
  }

  const parsed = proposalSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 422, {
      fields: parsed.error.flatten().fieldErrors,
    });
  }

  const { projectId, bidAmount, coverLetter, estimatedDays } = parsed.data;

  const [project] = await db
    .select({ id: projects.id, status: projects.status })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) return jsonError("Project not found", 404);
  if (project.status !== "open") {
    return jsonError("This project is no longer accepting proposals", 400);
  }

  const [existing] = await db
    .select({ id: proposals.id })
    .from(proposals)
    .where(
      and(eq(proposals.projectId, projectId), eq(proposals.freelancerId, auth.user.id))
    )
    .limit(1);

  if (existing) {
    return jsonError("You have already applied to this project", 409);
  }

  const [proposal] = await db
    .insert(proposals)
    .values({
      projectId,
      freelancerId: auth.user.id,
      bidAmount,
      coverLetter,
      estimatedDays: estimatedDays ?? null,
    })
    .returning({ id: proposals.id });

  return NextResponse.json({ success: true, id: proposal?.id }, { status: 201 });
}
