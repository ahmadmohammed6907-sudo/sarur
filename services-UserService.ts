import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { NotFoundError, ConflictError, ValidationError } from "@/lib/errors";
import type { SessionUser } from "@/lib/auth";

export interface CreateUserInput {
  fullName: string;
  email: string;
  password: string;
  userType: "freelancer" | "client";
}

export interface UpdateUserInput {
  fullName?: string;
  title?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  skills?: string[];
  hourlyRate?: number;
}

/**
 * User service for managing user operations
 */
export class UserService {
  /**
   * Create a new user
   */
  async createUser(input: CreateUserInput): Promise<SessionUser> {
    // Check if user already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictError("Email already registered");
    }

    // Hash password
    const passwordHash = await hashPassword(input.password);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        email: input.email.toLowerCase(),
        passwordHash,
        fullName: input.fullName,
        userType: input.userType,
      })
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        userType: users.userType,
        avatarUrl: users.avatarUrl,
      });

    if (!user) {
      throw new Error("Failed to create user");
    }

    return user as SessionUser;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<SessionUser | null> {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        userType: users.userType,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    return user ?? null;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<SessionUser | null> {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        userType: users.userType,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  }

  /**
   * Verify user password
   */
  async verifyUserPassword(email: string, password: string): Promise<SessionUser | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      userType: user.userType,
      avatarUrl: user.avatarUrl,
    };
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, input: UpdateUserInput): Promise<SessionUser> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    const [updated] = await db
      .update(users)
      .set({
        fullName: input.fullName ?? user.fullName,
        title: input.title,
        bio: input.bio,
        location: input.location,
        avatarUrl: input.avatarUrl ?? user.avatarUrl,
        skills: input.skills,
        hourlyRate: input.hourlyRate,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        userType: users.userType,
        avatarUrl: users.avatarUrl,
      });

    if (!updated) {
      throw new Error("Failed to update user");
    }

    return updated as SessionUser;
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundError("User");
    }

    // Verify old password
    const isValid = await verifyPassword(oldPassword, user.passwordHash);
    if (!isValid) {
      throw new ValidationError("Current password is incorrect");
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  /**
   * Get user with full profile
   */
  async getUserProfile(userId: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundError("User");
    }

    return user;
  }

  /**
   * List users with pagination
   */
  async listUsers(
    limit: number = 10,
    offset: number = 0,
    userType?: "freelancer" | "client"
  ) {
    let query = db.select().from(users);

    if (userType) {
      query = query.where(eq(users.userType, userType)) as any;
    }

    const items = await query.limit(limit).offset(offset);
    return items;
  }
}
