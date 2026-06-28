import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ------------------------------------------------------------------ */
/*  Enums                                                              */
/* ------------------------------------------------------------------ */

export const userTypeEnum = pgEnum("user_type", ["freelancer", "client", "admin"]);

export const projectStatusEnum = pgEnum("project_status", [
  "open",
  "in_progress",
  "completed",
  "cancelled",
]);

export const proposalStatusEnum = pgEnum("proposal_status", [
  "pending",
  "accepted",
  "rejected",
]);

/* ------------------------------------------------------------------ */
/*  Users                                                              */
/* ------------------------------------------------------------------ */

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    fullName: text("full_name").notNull(),
    userType: userTypeEnum("user_type").notNull().default("client"),
    avatarUrl: text("avatar_url"),
    title: text("title"),
    bio: text("bio"),
    location: text("location"),
    skills: text("skills").array().default([]),
    hourlyRate: integer("hourly_rate"),
    completedProjects: integer("completed_projects").default(0).notNull(),
    rating: numeric("rating", { precision: 3, scale: 2 }).default("0").notNull(),
    reviewCount: integer("review_count").default(0).notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    emailVerificationToken: text("email_verification_token"),
    resetPasswordToken: text("reset_password_token"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("users_type_idx").on(t.userType)]
);

export const usersRelations = relations(users, ({ many }) => ({
  services: many(services),
  projects: many(projects),
  proposals: many(proposals),
  reviewsGiven: many(reviews, { relationName: "reviews_given" }),
  reviewsReceived: many(reviews, { relationName: "reviews_received" }),
}));

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */

export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    freelancerId: uuid("freelancer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    price: integer("price").notNull(),
    tags: text("tags").array().default([]),
    imageUrl: text("image_url"),
    deliveryDays: integer("delivery_days").default(3).notNull(),
    rating: numeric("rating", { precision: 3, scale: 2 }).default("0").notNull(),
    reviewCount: integer("review_count").default(0).notNull(),
    salesCount: integer("sales_count").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("services_category_idx").on(t.category),
    index("services_freelancer_idx").on(t.freelancerId),
  ]
);

export const servicesRelations = relations(services, ({ one, many }) => ({
  freelancer: one(users, { fields: [services.freelancerId], references: [users.id] }),
  reviews: many(reviews),
}));

/* ------------------------------------------------------------------ */
/*  Projects                                                           */
/* ------------------------------------------------------------------ */

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    budgetMin: integer("budget_min").notNull(),
    budgetMax: integer("budget_max").notNull(),
    experienceLevel: text("experience_level").default("intermediate").notNull(),
    duration: text("duration"),
    skillsRequired: text("skills_required").array().default([]),
    status: projectStatusEnum("status").default("open").notNull(),
    deadline: timestamp("deadline", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("projects_status_idx").on(t.status),
    index("projects_category_idx").on(t.category),
    index("projects_client_idx").on(t.clientId),
  ]
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(users, { fields: [projects.clientId], references: [users.id] }),
  proposals: many(proposals),
}));

/* ------------------------------------------------------------------ */
/*  Proposals                                                          */
/* ------------------------------------------------------------------ */

export const proposals = pgTable(
  "proposals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    freelancerId: uuid("freelancer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bidAmount: integer("bid_amount").notNull(),
    coverLetter: text("cover_letter").notNull(),
    estimatedDays: integer("estimated_days"),
    status: proposalStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("proposals_project_idx").on(t.projectId),
    index("proposals_freelancer_idx").on(t.freelancerId),
  ]
);

export const proposalsRelations = relations(proposals, ({ one }) => ({
  project: one(projects, { fields: [proposals.projectId], references: [projects.id] }),
  freelancer: one(users, { fields: [proposals.freelancerId], references: [users.id] }),
}));

/* ------------------------------------------------------------------ */
/*  Contact messages                                                   */
/* ------------------------------------------------------------------ */

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  interest: text("interest").notNull(),
  message: text("message").notNull(),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ------------------------------------------------------------------ */
/*  Reviews                                                            */
/* ------------------------------------------------------------------ */

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").references(() => services.id, { onDelete: "cascade" }),
    fromUserId: uuid("from_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    toUserId: uuid("to_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("reviews_to_idx").on(t.toUserId), index("reviews_service_idx").on(t.serviceId)]
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  service: one(services, { fields: [reviews.serviceId], references: [services.id] }),
  fromUser: one(users, { fields: [reviews.fromUserId], references: [users.id], relationName: "reviews_given" }),
  toUser: one(users, { fields: [reviews.toUserId], references: [users.id], relationName: "reviews_received" }),
}));

/* ------------------------------------------------------------------ */
/*  Messages (user-to-user chat)                                       */
/* ------------------------------------------------------------------ */

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fromUserId: uuid("from_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    toUserId: uuid("to_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("messages_to_idx").on(t.toUserId), index("messages_from_idx").on(t.fromUserId)]
);

/* ------------------------------------------------------------------ */
/*  Favorites / wishlist                                               */
/* ------------------------------------------------------------------ */

export const favorites = pgTable(
  "favorites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id").references(() => services.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("favorites_user_idx").on(t.userId)]
);

/* ------------------------------------------------------------------ */
/*  Payments                                                           */
/* ------------------------------------------------------------------ */

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    buyerId: uuid("buyer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sellerId: uuid("seller_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id").references(() => services.id, {
      onDelete: "set null",
    }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    amount: integer("amount").notNull(), // in cents
    currency: text("currency").notNull().default("USD"),
    status: paymentStatusEnum("status").notNull().default("pending"),
    provider: text("provider").notNull().default("paypal"), // paypal | stripe
    providerOrderId: text("provider_order_id"),
    providerCaptureId: text("provider_capture_id"),
    metadata: text("metadata"), // JSON string for extra data
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("payments_buyer_idx").on(t.buyerId),
    index("payments_seller_idx").on(t.sellerId),
    index("payments_status_idx").on(t.status),
  ]
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  buyer: one(users, { fields: [payments.buyerId], references: [users.id], relationName: "payments_made" }),
  seller: one(users, { fields: [payments.sellerId], references: [users.id], relationName: "payments_received" }),
  service: one(services, { fields: [payments.serviceId], references: [services.id] }),
  project: one(projects, { fields: [payments.projectId], references: [projects.id] }),
}));
