import { db } from "@/db";
import {
  services,
  users,
  projects,
  proposals,
  reviews,
} from "@/db/schema";
import {
  eq,
  desc,
  asc,
  ilike,
  or,
  and,
  sql,
  count as countFn,
  isNotNull,
} from "drizzle-orm";
import type { SessionUser } from "@/lib/auth";

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */

export type ServiceListItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  imageUrl: string | null;
  deliveryDays: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  createdAt: Date;
  freelancer: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    rating: number;
    title: string | null;
  };
};

export async function listServices(opts: {
  category?: string;
  search?: string;
  sortBy?: "newest" | "price_low" | "price_high" | "rating";
  limit?: number;
  offset?: number;
}): Promise<{ items: ServiceListItem[]; total: number }> {
  const limit = Math.min(opts.limit ?? 12, 48);
  const offset = opts.offset ?? 0;

  const conditions = [eq(services.isActive, true)];
  if (opts.category) conditions.push(eq(services.category, opts.category));
  if (opts.search) {
    conditions.push(
      or(
        ilike(services.title, `%${opts.search}%`),
        ilike(services.description, `%${opts.search}%`)
      )!
    );
  }
  const where = and(...conditions);

  const order =
    opts.sortBy === "price_low"
      ? asc(services.price)
      : opts.sortBy === "price_high"
      ? desc(services.price)
      : opts.sortBy === "rating"
      ? desc(services.rating)
      : desc(services.createdAt);

  const rows = await db
    .select({
      id: services.id,
      title: services.title,
      description: services.description,
      price: services.price,
      category: services.category,
      tags: services.tags,
      imageUrl: services.imageUrl,
      deliveryDays: services.deliveryDays,
      rating: services.rating,
      reviewCount: services.reviewCount,
      salesCount: services.salesCount,
      createdAt: services.createdAt,
      freelancerId: users.id,
      freelancerName: users.fullName,
      freelancerAvatar: users.avatarUrl,
      freelancerRating: users.rating,
      freelancerTitle: users.title,
    })
    .from(services)
    .innerJoin(users, eq(services.freelancerId, users.id))
    .where(where!)
    .orderBy(order)
    .limit(limit)
    .offset(offset);

  const [totalRow] = await db
    .select({ value: countFn() })
    .from(services)
    .innerJoin(users, eq(services.freelancerId, users.id))
    .where(where!);

  return {
    items: rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      price: r.price,
      category: r.category,
      tags: r.tags ?? [],
      imageUrl: r.imageUrl,
      deliveryDays: r.deliveryDays,
      rating: Number(r.rating),
      reviewCount: r.reviewCount,
      salesCount: r.salesCount,
      createdAt: r.createdAt,
      freelancer: {
        id: r.freelancerId,
        fullName: r.freelancerName,
        avatarUrl: r.freelancerAvatar,
        rating: Number(r.freelancerRating),
        title: r.freelancerTitle,
      },
    })),
    total: totalRow?.value ?? 0,
  };
}

export async function getServiceDetail(id: string) {
  const [row] = await db
    .select({
      id: services.id,
      title: services.title,
      description: services.description,
      price: services.price,
      category: services.category,
      tags: services.tags,
      imageUrl: services.imageUrl,
      deliveryDays: services.deliveryDays,
      rating: services.rating,
      reviewCount: services.reviewCount,
      salesCount: services.salesCount,
      createdAt: services.createdAt,
      freelancerId: users.id,
      freelancerName: users.fullName,
      freelancerAvatar: users.avatarUrl,
      freelancerTitle: users.title,
      freelancerBio: users.bio,
      freelancerRating: users.rating,
      freelancerLocation: users.location,
      freelancerCompleted: users.completedProjects,
      freelancerSkills: users.skills,
    })
    .from(services)
    .innerJoin(users, eq(services.freelancerId, users.id))
    .where(eq(services.id, id))
    .limit(1);

  if (!row) return null;

  const recentReviews = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      authorId: users.id,
      authorName: users.fullName,
      authorAvatar: users.avatarUrl,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.fromUserId, users.id))
    .where(eq(reviews.serviceId, id))
    .orderBy(desc(reviews.createdAt))
    .limit(5);

  return {
    ...row,
    rating: Number(row.rating),
    freelancerRating: Number(row.freelancerRating),
    freelancerSkills: row.freelancerSkills ?? [],
    reviews: recentReviews,
  };
}

/* ------------------------------------------------------------------ */
/*  Projects                                                           */
/* ------------------------------------------------------------------ */

export type ProjectListItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  experienceLevel: string;
  duration: string | null;
  skillsRequired: string[];
  status: string;
  createdAt: Date;
  deadline: Date | null;
  proposalCount: number;
  client: { id: string; fullName: string; avatarUrl: string | null };
};

export async function listProjects(opts: {
  status?: string;
  category?: string;
  search?: string;
  limit?: number;
}): Promise<ProjectListItem[]> {
  const limit = Math.min(opts.limit ?? 12, 48);
  const conditions = [];
  if (opts.status) {
    conditions.push(
      eq(
        projects.status,
        opts.status as "open" | "in_progress" | "completed" | "cancelled"
      )
    );
  } else {
    conditions.push(eq(projects.status, "open"));
  }
  if (opts.category) conditions.push(eq(projects.category, opts.category));
  if (opts.search) {
    conditions.push(
      or(
        ilike(projects.title, `%${opts.search}%`),
        ilike(projects.description, `%${opts.search}%`)
      )!
    );
  }

  const rows = await db
    .select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      category: projects.category,
      budgetMin: projects.budgetMin,
      budgetMax: projects.budgetMax,
      experienceLevel: projects.experienceLevel,
      duration: projects.duration,
      skillsRequired: projects.skillsRequired,
      status: projects.status,
      createdAt: projects.createdAt,
      deadline: projects.deadline,
      clientId: users.id,
      clientName: users.fullName,
      clientAvatar: users.avatarUrl,
      proposalCount: countFn(proposals.id),
    })
    .from(projects)
    .innerJoin(users, eq(projects.clientId, users.id))
    .leftJoin(proposals, eq(proposals.projectId, projects.id))
    .where(and(...conditions)!)
    .groupBy(projects.id, users.id)
    .orderBy(desc(projects.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    budgetMin: r.budgetMin,
    budgetMax: r.budgetMax,
    experienceLevel: r.experienceLevel,
    duration: r.duration,
    skillsRequired: r.skillsRequired ?? [],
    status: r.status,
    createdAt: r.createdAt,
    deadline: r.deadline,
    proposalCount: Number(r.proposalCount),
    client: { id: r.clientId, fullName: r.clientName, avatarUrl: r.clientAvatar },
  }));
}

export async function getProjectDetail(id: string) {
  const [row] = await db
    .select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      category: projects.category,
      budgetMin: projects.budgetMin,
      budgetMax: projects.budgetMax,
      experienceLevel: projects.experienceLevel,
      duration: projects.duration,
      skillsRequired: projects.skillsRequired,
      status: projects.status,
      createdAt: projects.createdAt,
      deadline: projects.deadline,
      clientId: users.id,
      clientName: users.fullName,
      clientAvatar: users.avatarUrl,
      clientLocation: users.location,
    })
    .from(projects)
    .innerJoin(users, eq(projects.clientId, users.id))
    .where(eq(projects.id, id))
    .limit(1);

  if (!row) return null;

  const projectProposals = await db
    .select({
      id: proposals.id,
      bidAmount: proposals.bidAmount,
      coverLetter: proposals.coverLetter,
      estimatedDays: proposals.estimatedDays,
      status: proposals.status,
      createdAt: proposals.createdAt,
      freelancerId: users.id,
      freelancerName: users.fullName,
      freelancerAvatar: users.avatarUrl,
      freelancerTitle: users.title,
      freelancerRating: users.rating,
    })
    .from(proposals)
    .innerJoin(users, eq(proposals.freelancerId, users.id))
    .where(eq(proposals.projectId, id))
    .orderBy(desc(proposals.createdAt));

  return {
    ...row,
    skillsRequired: row.skillsRequired ?? [],
    proposals: projectProposals.map((p) => ({ ...p, freelancerRating: Number(p.freelancerRating) })),
  };
}

/* ------------------------------------------------------------------ */
/*  Freelancers                                                        */
/* ------------------------------------------------------------------ */

export async function listFreelancers(opts: {
  search?: string;
  category?: string;
  limit?: number;
}) {
  const limit = Math.min(opts.limit ?? 12, 48);
  const conditions = [eq(users.userType, "freelancer")];
  if (opts.search) {
    conditions.push(
      or(
        ilike(users.fullName, `%${opts.search}%`),
        ilike(users.title, `%${opts.search}%`),
        sql`${users.skills}::text ILIKE ${`%${opts.search}%`}`
      )!
    );
  }

  const rows = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      avatarUrl: users.avatarUrl,
      title: users.title,
      bio: users.bio,
      location: users.location,
      skills: users.skills,
      hourlyRate: users.hourlyRate,
      rating: users.rating,
      reviewCount: users.reviewCount,
      completedProjects: users.completedProjects,
    })
    .from(users)
    .where(and(...conditions)!)
    .orderBy(desc(users.rating), desc(users.completedProjects))
    .limit(limit);

  return rows.map((r) => ({
    ...r,
    skills: r.skills ?? [],
    rating: Number(r.rating),
    hourlyRate: r.hourlyRate,
  }));
}

export async function getFreelancerDetail(id: string) {
  const [row] = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      avatarUrl: users.avatarUrl,
      title: users.title,
      bio: users.bio,
      location: users.location,
      skills: users.skills,
      hourlyRate: users.hourlyRate,
      rating: users.rating,
      reviewCount: users.reviewCount,
      completedProjects: users.completedProjects,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(eq(users.id, id), eq(users.userType, "freelancer")))
    .limit(1);

  if (!row) return null;

  const allServices = await db
    .select({
      id: services.id,
      title: services.title,
      price: services.price,
      imageUrl: services.imageUrl,
      rating: services.rating,
      reviewCount: services.reviewCount,
    })
    .from(services)
    .where(eq(services.freelancerId, id))
    .orderBy(desc(services.createdAt))
    .limit(6);

  return {
    ...row,
    skills: row.skills ?? [],
    rating: Number(row.rating),
    services: allServices.map((s) => ({ ...s, rating: Number(s.rating) })),
  };
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */

export async function getFreelancerDashboard(user: SessionUser) {
  const myServices = await db
    .select({
      id: services.id,
      title: services.title,
      price: services.price,
      rating: services.rating,
      reviewCount: services.reviewCount,
      salesCount: services.salesCount,
      createdAt: services.createdAt,
    })
    .from(services)
    .where(eq(services.freelancerId, user.id))
    .orderBy(desc(services.createdAt));

  const myProposals = await db
    .select({
      id: proposals.id,
      bidAmount: proposals.bidAmount,
      status: proposals.status,
      coverLetter: proposals.coverLetter,
      createdAt: proposals.createdAt,
      projectId: projects.id,
      projectTitle: projects.title,
      projectBudgetMin: projects.budgetMin,
      projectBudgetMax: projects.budgetMax,
      projectStatus: projects.status,
    })
    .from(proposals)
    .innerJoin(projects, eq(proposals.projectId, projects.id))
    .where(eq(proposals.freelancerId, user.id))
    .orderBy(desc(proposals.createdAt));

  const totalSales = myServices.reduce((sum, s) => sum + s.salesCount, 0);
  const acceptedProposals = myProposals.filter((p) => p.status === "accepted").length;

  return {
    stats: {
      activeServices: myServices.length,
      totalSales,
      proposalsSent: myProposals.length,
      acceptedProposals,
    },
    services: myServices.map((s) => ({ ...s, rating: Number(s.rating) })),
    proposals: myProposals,
  };
}

export async function getClientDashboard(user: SessionUser) {
  const myProjects = await db
    .select({
      id: projects.id,
      title: projects.title,
      budgetMin: projects.budgetMin,
      budgetMax: projects.budgetMax,
      status: projects.status,
      category: projects.category,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .where(eq(projects.clientId, user.id))
    .orderBy(desc(projects.createdAt));

  const proposalCounts = await db
    .select({
      projectId: proposals.projectId,
      count: countFn(proposals.id),
    })
    .from(proposals)
    .where(isNotNull(proposals.projectId))
    .groupBy(proposals.projectId);

  const countMap = new Map(proposalCounts.map((p) => [p.projectId, Number(p.count)]));

  const totalProposals = myProjects.reduce((sum, p) => sum + (countMap.get(p.id) ?? 0), 0);
  const activeProjects = myProjects.filter((p) => p.status !== "completed").length;
  const totalBudget = myProjects.reduce((sum, p) => sum + p.budgetMax, 0);

  return {
    stats: {
      totalProjects: myProjects.length,
      activeProjects,
      totalProposals,
      totalBudget,
    },
    projects: myProjects.map((p) => ({ ...p, proposalCount: countMap.get(p.id) ?? 0 })),
  };
}
