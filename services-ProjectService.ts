import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, and, or, like, desc } from "drizzle-orm";
import { NotFoundError, ValidationError, AuthorizationError } from "@/lib/errors";

export interface CreateProjectInput {
  clientId: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  experienceLevel?: string;
  duration?: string;
  skillsRequired?: string[];
  deadline?: Date;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  category?: string;
  budgetMin?: number;
  budgetMax?: number;
  experienceLevel?: string;
  duration?: string;
  skillsRequired?: string[];
  deadline?: Date;
  status?: "open" | "in_progress" | "completed" | "cancelled";
}

export interface ListProjectsOptions {
  status?: string;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Project service for managing project operations
 */
export class ProjectService {
  /**
   * Create a new project
   */
  async createProject(input: CreateProjectInput) {
    if (input.budgetMax < input.budgetMin) {
      throw new ValidationError("Maximum budget must be greater than minimum");
    }

    const [project] = await db
      .insert(projects)
      .values({
        clientId: input.clientId,
        title: input.title,
        description: input.description,
        category: input.category,
        budgetMin: input.budgetMin,
        budgetMax: input.budgetMax,
        experienceLevel: input.experienceLevel || "intermediate",
        duration: input.duration || null,
        skillsRequired: input.skillsRequired || [],
        deadline: input.deadline || null,
      })
      .returning();

    if (!project) {
      throw new Error("Failed to create project");
    }

    return project;
  }

  /**
   * Get project by ID
   */
  async getProjectById(projectId: string) {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      throw new NotFoundError("Project");
    }

    return project;
  }

  /**
   * Update project
   */
  async updateProject(projectId: string, clientId: string, input: UpdateProjectInput) {
    // Verify ownership
    const project = await this.getProjectById(projectId);
    if (project.clientId !== clientId) {
      throw new AuthorizationError("You can only update your own projects");
    }

    if (input.budgetMax && input.budgetMin && input.budgetMax < input.budgetMin) {
      throw new ValidationError("Maximum budget must be greater than minimum");
    }

    const [updated] = await db
      .update(projects)
      .set({
        title: input.title ?? project.title,
        description: input.description ?? project.description,
        category: input.category ?? project.category,
        budgetMin: input.budgetMin ?? project.budgetMin,
        budgetMax: input.budgetMax ?? project.budgetMax,
        experienceLevel: input.experienceLevel ?? project.experienceLevel,
        duration: input.duration ?? project.duration,
        skillsRequired: input.skillsRequired ?? project.skillsRequired,
        deadline: input.deadline ?? project.deadline,
        status: input.status ?? project.status,
      })
      .where(eq(projects.id, projectId))
      .returning();

    if (!updated) {
      throw new Error("Failed to update project");
    }

    return updated;
  }

  /**
   * Delete project
   */
  async deleteProject(projectId: string, clientId: string): Promise<void> {
    // Verify ownership
    const project = await this.getProjectById(projectId);
    if (project.clientId !== clientId) {
      throw new AuthorizationError("You can only delete your own projects");
    }

    await db.delete(projects).where(eq(projects.id, projectId));
  }

  /**
   * List projects with filters
   */
  async listProjects(options: ListProjectsOptions = {}) {
    const { status, category, search, limit = 20, offset = 0 } = options;

    const conditions: any[] = [];

    if (status) {
      conditions.push(eq(projects.status, status as any));
    }

    if (category) {
      conditions.push(eq(projects.category, category));
    }

    if (search) {
      conditions.push(
        or(
          like(projects.title, `%${search}%`),
          like(projects.description, `%${search}%`)
        )
      );
    }

    let query = db.select().from(projects);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const items = await query
      .orderBy(desc(projects.createdAt))
      .limit(limit)
      .offset(offset);

    return items;
  }

  /**
   * Get projects by client
   */
  async getProjectsByClient(clientId: string, limit: number = 20, offset: number = 0) {
    const items = await db
      .select()
      .from(projects)
      .where(eq(projects.clientId, clientId))
      .orderBy(desc(projects.createdAt))
      .limit(limit)
      .offset(offset);

    return items;
  }

  /**
   * Update project status
   */
  async updateProjectStatus(
    projectId: string,
    clientId: string,
    status: "open" | "in_progress" | "completed" | "cancelled"
  ) {
    // Verify ownership
    const project = await this.getProjectById(projectId);
    if (project.clientId !== clientId) {
      throw new AuthorizationError("You can only update your own projects");
    }

    const [updated] = await db
      .update(projects)
      .set({ status })
      .where(eq(projects.id, projectId))
      .returning();

    if (!updated) {
      throw new Error("Failed to update project status");
    }

    return updated;
  }
}
