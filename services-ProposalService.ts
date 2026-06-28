import { db } from "@/db";
import { proposals, projects } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { NotFoundError, ValidationError, AuthorizationError } from "@/lib/errors";

export interface CreateProposalInput {
  projectId: string;
  freelancerId: string;
  bidAmount: number;
  coverLetter: string;
  estimatedDays?: number;
}

export interface UpdateProposalInput {
  bidAmount?: number;
  coverLetter?: string;
  estimatedDays?: number;
  status?: "pending" | "accepted" | "rejected";
}

/**
 * Proposal service for managing proposal operations
 */
export class ProposalService {
  /**
   * Create a new proposal
   */
  async createProposal(input: CreateProposalInput) {
    if (input.bidAmount < 1) {
      throw new ValidationError("Bid amount must be at least $1");
    }

    // Check if project exists
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, input.projectId))
      .limit(1);

    if (!project) {
      throw new NotFoundError("Project");
    }

    // Check if freelancer already has a proposal for this project
    const [existing] = await db
      .select()
      .from(proposals)
      .where(
        and(
          eq(proposals.projectId, input.projectId),
          eq(proposals.freelancerId, input.freelancerId)
        )
      )
      .limit(1);

    if (existing) {
      throw new ValidationError("You have already submitted a proposal for this project");
    }

    const [proposal] = await db
      .insert(proposals)
      .values({
        projectId: input.projectId,
        freelancerId: input.freelancerId,
        bidAmount: input.bidAmount,
        coverLetter: input.coverLetter,
        estimatedDays: input.estimatedDays || null,
      })
      .returning();

    if (!proposal) {
      throw new Error("Failed to create proposal");
    }

    return proposal;
  }

  /**
   * Get proposal by ID
   */
  async getProposalById(proposalId: string) {
    const [proposal] = await db
      .select()
      .from(proposals)
      .where(eq(proposals.id, proposalId))
      .limit(1);

    if (!proposal) {
      throw new NotFoundError("Proposal");
    }

    return proposal;
  }

  /**
   * Update proposal
   */
  async updateProposal(proposalId: string, freelancerId: string, input: UpdateProposalInput) {
    // Verify ownership
    const proposal = await this.getProposalById(proposalId);
    if (proposal.freelancerId !== freelancerId) {
      throw new AuthorizationError("You can only update your own proposals");
    }

    // Check if proposal is still pending
    if (proposal.status !== "pending") {
      throw new ValidationError("You can only update pending proposals");
    }

    if (input.bidAmount && input.bidAmount < 1) {
      throw new ValidationError("Bid amount must be at least $1");
    }

    const [updated] = await db
      .update(proposals)
      .set({
        bidAmount: input.bidAmount ?? proposal.bidAmount,
        coverLetter: input.coverLetter ?? proposal.coverLetter,
        estimatedDays: input.estimatedDays ?? proposal.estimatedDays,
      })
      .where(eq(proposals.id, proposalId))
      .returning();

    if (!updated) {
      throw new Error("Failed to update proposal");
    }

    return updated;
  }

  /**
   * Delete proposal
   */
  async deleteProposal(proposalId: string, freelancerId: string): Promise<void> {
    // Verify ownership
    const proposal = await this.getProposalById(proposalId);
    if (proposal.freelancerId !== freelancerId) {
      throw new AuthorizationError("You can only delete your own proposals");
    }

    // Check if proposal is still pending
    if (proposal.status !== "pending") {
      throw new ValidationError("You can only delete pending proposals");
    }

    await db.delete(proposals).where(eq(proposals.id, proposalId));
  }

  /**
   * Get proposals for a project
   */
  async getProposalsByProject(projectId: string, limit: number = 20, offset: number = 0) {
    const items = await db
      .select()
      .from(proposals)
      .where(eq(proposals.projectId, projectId))
      .orderBy(desc(proposals.createdAt))
      .limit(limit)
      .offset(offset);

    return items;
  }

  /**
   * Get proposals by freelancer
   */
  async getProposalsByFreelancer(freelancerId: string, limit: number = 20, offset: number = 0) {
    const items = await db
      .select()
      .from(proposals)
      .where(eq(proposals.freelancerId, freelancerId))
      .orderBy(desc(proposals.createdAt))
      .limit(limit)
      .offset(offset);

    return items;
  }

  /**
   * Accept proposal
   */
  async acceptProposal(proposalId: string, clientId: string) {
    const proposal = await this.getProposalById(proposalId);

    // Verify that the client owns the project
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, proposal.projectId))
      .limit(1);

    if (!project || project.clientId !== clientId) {
      throw new AuthorizationError("You can only accept proposals on your own projects");
    }

    if (proposal.status !== "pending") {
      throw new ValidationError("This proposal has already been processed");
    }

    const [updated] = await db
      .update(proposals)
      .set({ status: "accepted" })
      .where(eq(proposals.id, proposalId))
      .returning();

    if (!updated) {
      throw new Error("Failed to accept proposal");
    }

    return updated;
  }

  /**
   * Reject proposal
   */
  async rejectProposal(proposalId: string, clientId: string) {
    const proposal = await this.getProposalById(proposalId);

    // Verify that the client owns the project
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, proposal.projectId))
      .limit(1);

    if (!project || project.clientId !== clientId) {
      throw new AuthorizationError("You can only reject proposals on your own projects");
    }

    if (proposal.status !== "pending") {
      throw new ValidationError("This proposal has already been processed");
    }

    const [updated] = await db
      .update(proposals)
      .set({ status: "rejected" })
      .where(eq(proposals.id, proposalId))
      .returning();

    if (!updated) {
      throw new Error("Failed to reject proposal");
    }

    return updated;
  }
}
