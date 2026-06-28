import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, and, or, like, desc } from "drizzle-orm";
import { NotFoundError, ValidationError, AuthorizationError } from "@/lib/errors";

export interface CreateServiceInput {
  freelancerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryDays?: number;
  tags?: string[];
  imageUrl?: string;
}

export interface UpdateServiceInput {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  deliveryDays?: number;
  tags?: string[];
  imageUrl?: string;
  isActive?: boolean;
}

export interface ListServicesOptions {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  freelancerId?: string;
}

/**
 * Service service for managing service operations
 */
export class ServiceService {
  /**
   * Create a new service
   */
  async createService(input: CreateServiceInput) {
    if (input.price < 5) {
      throw new ValidationError("Price must be at least $5");
    }

    const [service] = await db
      .insert(services)
      .values({
        freelancerId: input.freelancerId,
        title: input.title,
        description: input.description,
        category: input.category,
        price: input.price,
        deliveryDays: input.deliveryDays || 3,
        tags: input.tags || [],
        imageUrl: input.imageUrl || null,
      })
      .returning();

    if (!service) {
      throw new Error("Failed to create service");
    }

    return service;
  }

  /**
   * Get service by ID
   */
  async getServiceById(serviceId: string) {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);

    if (!service) {
      throw new NotFoundError("Service");
    }

    return service;
  }

  /**
   * Update service
   */
  async updateService(serviceId: string, freelancerId: string, input: UpdateServiceInput) {
    // Verify ownership
    const service = await this.getServiceById(serviceId);
    if (service.freelancerId !== freelancerId) {
      throw new AuthorizationError("You can only update your own services");
    }

    if (input.price && input.price < 5) {
      throw new ValidationError("Price must be at least $5");
    }

    const [updated] = await db
      .update(services)
      .set({
        title: input.title ?? service.title,
        description: input.description ?? service.description,
        category: input.category ?? service.category,
        price: input.price ?? service.price,
        deliveryDays: input.deliveryDays ?? service.deliveryDays,
        tags: input.tags ?? service.tags,
        imageUrl: input.imageUrl ?? service.imageUrl,
        isActive: input.isActive ?? service.isActive,
      })
      .where(eq(services.id, serviceId))
      .returning();

    if (!updated) {
      throw new Error("Failed to update service");
    }

    return updated;
  }

  /**
   * Delete service
   */
  async deleteService(serviceId: string, freelancerId: string): Promise<void> {
    // Verify ownership
    const service = await this.getServiceById(serviceId);
    if (service.freelancerId !== freelancerId) {
      throw new AuthorizationError("You can only delete your own services");
    }

    await db.delete(services).where(eq(services.id, serviceId));
  }

  /**
   * List services with filters
   */
  async listServices(options: ListServicesOptions = {}) {
    const { category, search, limit = 20, offset = 0, freelancerId } = options;

    const conditions: any[] = [eq(services.isActive, true)];

    if (category) {
      conditions.push(eq(services.category, category));
    }

    if (freelancerId) {
      conditions.push(eq(services.freelancerId, freelancerId));
    }

    if (search) {
      conditions.push(
        or(
          like(services.title, `%${search}%`),
          like(services.description, `%${search}%`)
        )
      );
    }

    const items = await db
      .select()
      .from(services)
      .where(and(...conditions))
      .orderBy(desc(services.createdAt))
      .limit(limit)
      .offset(offset);

    return items;
  }

  /**
   * Get services by freelancer
   */
  async getServicesByFreelancer(freelancerId: string, limit: number = 20, offset: number = 0) {
    const items = await db
      .select()
      .from(services)
      .where(eq(services.freelancerId, freelancerId))
      .orderBy(desc(services.createdAt))
      .limit(limit)
      .offset(offset);

    return items;
  }

  /**
   * Toggle service active status
   */
  async toggleServiceStatus(serviceId: string, freelancerId: string, isActive: boolean) {
    // Verify ownership
    const service = await this.getServiceById(serviceId);
    if (service.freelancerId !== freelancerId) {
      throw new AuthorizationError("You can only toggle your own services");
    }

    const [updated] = await db
      .update(services)
      .set({ isActive })
      .where(eq(services.id, serviceId))
      .returning();

    if (!updated) {
      throw new Error("Failed to toggle service status");
    }

    return updated;
  }

  /**
   * Increment sales count
   */
  async incrementSalesCount(serviceId: string): Promise<void> {
    const service = await this.getServiceById(serviceId);

    await db
      .update(services)
      .set({ salesCount: service.salesCount + 1 })
      .where(eq(services.id, serviceId));
  }
}
