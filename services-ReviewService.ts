import { db } from "@/db";
import { reviews, services, users } from "@/db/schema";
import { eq, and, desc, avg } from "drizzle-orm";
import { NotFoundError, ValidationError, AuthorizationError } from "@/lib/errors";

export interface CreateReviewInput {
  serviceId?: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

/**
 * Review service for managing review operations
 */
export class ReviewService {
  /**
   * Create a new review
   */
  async createReview(input: CreateReviewInput) {
    if (input.rating < 1 || input.rating > 5) {
      throw new ValidationError("Rating must be between 1 and 5");
    }

    if (input.fromUserId === input.toUserId) {
      throw new ValidationError("You cannot review yourself");
    }

    // Check if review already exists
    const [existing] = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.fromUserId, input.fromUserId),
          eq(reviews.toUserId, input.toUserId),
          input.serviceId ? eq(reviews.serviceId, input.serviceId) : undefined
        )
      )
      .limit(1);

    if (existing) {
      throw new ValidationError("You have already reviewed this user");
    }

    const [review] = await db
      .insert(reviews)
      .values({
        serviceId: input.serviceId || null,
        fromUserId: input.fromUserId,
        toUserId: input.toUserId,
        rating: input.rating,
        comment: input.comment || null,
      })
      .returning();

    if (!review) {
      throw new Error("Failed to create review");
    }

    // Update user rating
    await this.updateUserRating(input.toUserId);

    // Update service rating if applicable
    if (input.serviceId) {
      await this.updateServiceRating(input.serviceId);
    }

    return review;
  }

  /**
   * Get review by ID
   */
  async getReviewById(reviewId: string) {
    const [review] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);

    if (!review) {
      throw new NotFoundError("Review");
    }

    return review;
  }

  /**
   * Update review
   */
  async updateReview(reviewId: string, fromUserId: string, input: UpdateReviewInput) {
    // Verify ownership
    const review = await this.getReviewById(reviewId);
    if (review.fromUserId !== fromUserId) {
      throw new AuthorizationError("You can only update your own reviews");
    }

    if (input.rating && (input.rating < 1 || input.rating > 5)) {
      throw new ValidationError("Rating must be between 1 and 5");
    }

    const [updated] = await db
      .update(reviews)
      .set({
        rating: input.rating ?? review.rating,
        comment: input.comment ?? review.comment,
      })
      .where(eq(reviews.id, reviewId))
      .returning();

    if (!updated) {
      throw new Error("Failed to update review");
    }

    // Update user rating
    await this.updateUserRating(review.toUserId);

    // Update service rating if applicable
    if (review.serviceId) {
      await this.updateServiceRating(review.serviceId);
    }

    return updated;
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId: string, fromUserId: string): Promise<void> {
    // Verify ownership
    const review = await this.getReviewById(reviewId);
    if (review.fromUserId !== fromUserId) {
      throw new AuthorizationError("You can only delete your own reviews");
    }

    await db.delete(reviews).where(eq(reviews.id, reviewId));

    // Update user rating
    await this.updateUserRating(review.toUserId);

    // Update service rating if applicable
    if (review.serviceId) {
      await this.updateServiceRating(review.serviceId);
    }
  }

  /**
   * Get reviews for a user
   */
  async getReviewsForUser(userId: string, limit: number = 20, offset: number = 0) {
    const items = await db
      .select()
      .from(reviews)
      .where(eq(reviews.toUserId, userId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    return items;
  }

  /**
   * Get reviews by a user
   */
  async getReviewsByUser(userId: string, limit: number = 20, offset: number = 0) {
    const items = await db
      .select()
      .from(reviews)
      .where(eq(reviews.fromUserId, userId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    return items;
  }

  /**
   * Get reviews for a service
   */
  async getReviewsForService(serviceId: string, limit: number = 20, offset: number = 0) {
    const items = await db
      .select()
      .from(reviews)
      .where(eq(reviews.serviceId, serviceId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    return items;
  }

  /**
   * Update user rating based on reviews
   */
  private async updateUserRating(userId: string): Promise<void> {
    const result = await db
      .select({
        avgRating: avg(reviews.rating),
        count: reviews.id,
      })
      .from(reviews)
      .where(eq(reviews.toUserId, userId));

    const avgRating = result[0]?.avgRating ? parseFloat(result[0].avgRating.toString()) : 0;
    const reviewCount = result.length;

    await db
      .update(users)
      .set({
        rating: avgRating.toString(),
        reviewCount,
      })
      .where(eq(users.id, userId));
  }

  /**
   * Update service rating based on reviews
   */
  private async updateServiceRating(serviceId: string): Promise<void> {
    const result = await db
      .select({
        avgRating: avg(reviews.rating),
        count: reviews.id,
      })
      .from(reviews)
      .where(eq(reviews.serviceId, serviceId));

    const avgRating = result[0]?.avgRating ? parseFloat(result[0].avgRating.toString()) : 0;
    const reviewCount = result.length;

    await db
      .update(services)
      .set({
        rating: avgRating.toString(),
        reviewCount,
      })
      .where(eq(services.id, serviceId));
  }
}
