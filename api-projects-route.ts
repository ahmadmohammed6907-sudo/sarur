import { NextResponse } from "next/server";
import { projectSchema } from "@/lib/validation";
import { requireRole, handleApiError, parseRequestBody } from "@/lib/api";
import { ProjectService } from "@/services/ProjectService";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const projectService = new ProjectService();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? undefined;
    const category = url.searchParams.get("category") ?? undefined;
    const search = url.searchParams.get("search") ?? undefined;
    const limit = url.searchParams.get("limit")
      ? Number(url.searchParams.get("limit"))
      : undefined;

    const projects = await projectService.listProjects({
      status,
      category,
      search,
      limit,
    });

    logger.logApiRequest("GET", "/api/projects", 200, 0);

    return NextResponse.json({
      projects,
      total: projects.length,
    });
  } catch (error) {
    logger.error("Failed to fetch projects", error);
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole("client");
    if (!auth.ok) return auth.response;

    const body = await parseRequestBody(request);
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const {
      title,
      description,
      category,
      budgetMin,
      budgetMax,
      experienceLevel,
      duration,
      skillsRequired,
      deadline,
    } = parsed.data;

    const project = await projectService.createProject({
      clientId: auth.user.id,
      title,
      description,
      category,
      budgetMin,
      budgetMax,
      experienceLevel,
      duration,
      skillsRequired,
      deadline: deadline ? new Date(deadline) : undefined,
    });

    logger.info("Project created", "PROJECT", {
      projectId: project.id,
      clientId: auth.user.id,
    });

    return NextResponse.json({ success: true, id: project.id }, { status: 201 });
  } catch (error) {
    logger.error("Failed to create project", error);
    return handleApiError(error);
  }
}
