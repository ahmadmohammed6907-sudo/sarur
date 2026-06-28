/* Database seed for the SARUR platform.
 * Run with:  npx tsx src/db/seed.ts
 */
import "dotenv/config";
import { db } from "./index";
import * as schema from "./schema";
import { hashPassword } from "../lib/auth";

const PASSWORD = "Password123";
const NOW = new Date();

async function main() {
  console.log("→ Truncating existing data…");
  await db.execute(
    `TRUNCATE TABLE
       users, services, projects, proposals, contact_messages,
       reviews, messages, favorites
     RESTART IDENTITY CASCADE;`
  );

  /* ----------------------------------------------------------------
   * Users
   * ---------------------------------------------------------------- */
  console.log("→ Seeding users…");

  type SeedUser = {
    id?: string;
    email: string;
    fullName: string;
    userType: "freelancer" | "client";
    avatarUrl: string;
    title: string;
    bio: string;
    location: string;
    skills?: string[];
    hourlyRate?: number;
    completedProjects?: number;
    rating?: string;
    reviewCount?: number;
  };

  const seedUsers: SeedUser[] = [
    {
      email: "freelancer@sarur.app",
      fullName: "Amira Hassan",
      userType: "freelancer",
      avatarUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces",
      title: "Senior Product Designer",
      bio: "Award-winning product designer with 8+ years crafting delightful interfaces for fintech and SaaS startups. I turn complex problems into clean, conversion-driving products.",
      location: "Cairo, Egypt",
      skills: ["UI/UX Design", "Figma", "Design Systems", "Prototyping", "Webflow"],
      hourlyRate: 85,
      completedProjects: 142,
      rating: "4.96",
      reviewCount: 128,
    },
    {
      email: "david@sarur.app",
      fullName: "David Chen",
      userType: "freelancer",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces",
      title: "Full-Stack Engineer",
      bio: "I build fast, scalable web apps with React, Next.js and Node. Former staff engineer at a YC startup — I ship production code, not demos.",
      location: "Singapore",
      skills: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
      hourlyRate: 110,
      completedProjects: 98,
      rating: "4.91",
      reviewCount: 87,
    },
    {
      email: "sofia@sarur.app",
      fullName: "Sofia Ramirez",
      userType: "freelancer",
      avatarUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=faces",
      title: "Brand & Motion Designer",
      bio: "I help bold brands stand out. From logo systems to animated brand films, I create identities that feel alive and memorable.",
      location: "Mexico City, Mexico",
      skills: ["Branding", "Logo Design", "Motion Graphics", "After Effects", "Illustration"],
      hourlyRate: 70,
      completedProjects: 76,
      rating: "4.88",
      reviewCount: 64,
    },
    {
      email: "marcus@sarur.app",
      fullName: "Marcus Johnson",
      userType: "freelancer",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces",
      title: "Growth Marketing Strategist",
      bio: "Performance marketer who has managed $12M+ in ad spend across DTC and B2B. I obsess over ROAS and clean attribution.",
      location: "Austin, USA",
      skills: ["Paid Ads", "SEO", "Growth Strategy", "Analytics", "Copywriting"],
      hourlyRate: 95,
      completedProjects: 54,
      rating: "4.84",
      reviewCount: 49,
    },
    {
      email: "lena@sarur.app",
      fullName: "Lena Petrova",
      userType: "freelancer",
      avatarUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=faces",
      title: "UX Researcher & Writer",
      bio: "I make products make sense. Research-driven UX writing and content design that guides users and lifts conversion.",
      location: "Berlin, Germany",
      skills: ["UX Writing", "Content Design", "User Research", "Information Architecture"],
      hourlyRate: 65,
      completedProjects: 61,
      rating: "4.9",
      reviewCount: 52,
    },
    {
      email: "omar@sarur.app",
      fullName: "Omar Farouk",
      userType: "freelancer",
      avatarUrl:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&crop=faces",
      title: "ML & Data Engineer",
      bio: "I design data pipelines and ship ML products to production. Specializing in LLM apps, RAG systems and automation.",
      location: "Dubai, UAE",
      skills: ["Python", "Machine Learning", "LLMs", "Data Pipelines", "LangChain"],
      hourlyRate: 130,
      completedProjects: 43,
      rating: "4.97",
      reviewCount: 38,
    },
    {
      email: "maya@sarur.app",
      fullName: "Maya Tanaka",
      userType: "freelancer",
      avatarUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=faces",
      title: "Mobile App Developer",
      bio: "Native and cross-platform mobile developer. I've shipped 20+ apps with millions of downloads on iOS and Android.",
      location: "Tokyo, Japan",
      skills: ["React Native", "Swift", "Kotlin", "Flutter"],
      hourlyRate: 100,
      completedProjects: 47,
      rating: "4.86",
      reviewCount: 41,
    },
    {
      email: "client@sarur.app",
      fullName: "James Wilson",
      userType: "client",
      avatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces",
      title: "Founder & CEO",
      bio: "Building Lumen — a B2B analytics platform. Always looking for great talent.",
      location: "London, UK",
      completedProjects: 12,
      rating: "4.9",
      reviewCount: 8,
    },
    {
      email: "sara@lumen.io",
      fullName: "Sara Brooks",
      userType: "client",
      avatarUrl:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=faces",
      title: "Head of Product",
      bio: "Product leader scaling a Series B SaaS company.",
      location: "San Francisco, USA",
      completedProjects: 9,
      rating: "4.85",
      reviewCount: 6,
    },
  ];

  const passwordHash = await hashPassword(PASSWORD);

  const insertedUsers = await db
    .insert(schema.users)
    .values(
      seedUsers.map((u) => ({
        email: u.email,
        passwordHash,
        fullName: u.fullName,
        userType: u.userType,
        avatarUrl: u.avatarUrl,
        title: u.title,
        bio: u.bio,
        location: u.location,
        skills: u.skills ?? [],
        hourlyRate: u.hourlyRate ?? null,
        completedProjects: u.completedProjects ?? 0,
        rating: u.rating ?? "0",
        reviewCount: u.reviewCount ?? 0,
        isVerified: true,
      }))
    )
    .returning({ id: schema.users.id, email: schema.users.email, fullName: schema.users.fullName });

  const byEmail = new Map(insertedUsers.map((u) => [u.email, u.id]));
  const byName = new Map(insertedUsers.map((u) => [u.fullName, u.id]));

  /* ----------------------------------------------------------------
   * Services
   * ---------------------------------------------------------------- */
  console.log("→ Seeding services…");

  const serviceSeeds = [
    {
      freelancer: "Amira Hassan",
      title: "I will design a premium SaaS dashboard UI in Figma",
      description:
        "Get a pixel-perfect, developer-ready dashboard design for your SaaS. Includes up to 8 screens, a reusable component library, dark/light themes, and a clickable prototype. Delivered with clean layer naming and dev specs.",
      category: "Design & Creative",
      price: 850,
      deliveryDays: 7,
      tags: ["UI/UX", "Figma", "Dashboard", "SaaS"],
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
      sales: 64,
      rating: "4.96",
    },
    {
      freelancer: "Amira Hassan",
      title: "I will build a complete design system from scratch",
      description:
        "A scalable design system with tokens, components, and documentation. Perfect for product teams that want consistency and speed. Includes Figma library + usage guidelines.",
      category: "Design & Creative",
      price: 1200,
      deliveryDays: 10,
      tags: ["Design System", "Figma", "Tokens"],
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop",
      sales: 38,
      rating: "4.98",
    },
    {
      freelancer: "David Chen",
      title: "I will develop a full-stack Next.js web application",
      description:
        "Production-grade web app with Next.js App Router, TypeScript, Drizzle ORM, auth, and deployment. Clean architecture, tested code, and a full handover. Ideal for MVPs and scale.",
      category: "Development & IT",
      price: 2500,
      deliveryDays: 14,
      tags: ["Next.js", "TypeScript", "Full-Stack"],
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
      sales: 52,
      rating: "4.94",
    },
    {
      freelancer: "David Chen",
      title: "I will build a REST or GraphQL API with Node.js",
      description:
        "Robust, well-documented backend API with authentication, validation, rate limiting, and tests. Includes Postman collection and OpenAPI docs.",
      category: "Development & IT",
      price: 1400,
      deliveryDays: 9,
      tags: ["Node.js", "API", "Backend"],
      image:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=500&fit=crop",
      sales: 41,
      rating: "4.9",
    },
    {
      freelancer: "Sofia Ramirez",
      title: "I will create a modern brand identity and logo package",
      description:
        "Complete brand identity: logo variations, color palette, typography, social kit, and a brand guidelines PDF. Memorable, versatile, and print-ready.",
      category: "Design & Creative",
      price: 650,
      deliveryDays: 6,
      tags: ["Branding", "Logo", "Identity"],
      image:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=500&fit=crop",
      sales: 71,
      rating: "4.95",
    },
    {
      freelancer: "Sofia Ramirez",
      title: "I will produce an animated brand or explainer video",
      description:
        "Engaging 2D motion graphics video (up to 60s) with custom illustration, voiceover sync, and sound design. Perfect for product launches and social.",
      category: "Video & Animation",
      price: 1100,
      deliveryDays: 12,
      tags: ["Motion", "Animation", "After Effects"],
      image:
        "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=500&fit=crop",
      sales: 29,
      rating: "4.89",
    },
    {
      freelancer: "Marcus Johnson",
      title: "I will set up and manage your Google & Meta ad campaigns",
      description:
        "Full-funnel paid social and search setup: account audit, audience research, ad creative direction, tracking, and weekly optimization reports focused on ROAS.",
      category: "Digital Marketing",
      price: 900,
      deliveryDays: 5,
      tags: ["Paid Ads", "Google Ads", "Meta"],
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
      sales: 47,
      rating: "4.87",
    },
    {
      freelancer: "Marcus Johnson",
      title: "I will perform a technical SEO audit and fix plan",
      description:
        "Deep technical SEO audit covering Core Web Vitals, indexability, structured data, and content gaps. Includes a prioritized action plan you (or I) can execute.",
      category: "Digital Marketing",
      price: 450,
      deliveryDays: 4,
      tags: ["SEO", "Audit", "Growth"],
      image:
        "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=500&fit=crop",
      sales: 58,
      rating: "4.83",
    },
    {
      freelancer: "Lena Petrova",
      title: "I will write UX copy that boosts your conversion rate",
      description:
        "Conversion-focused UX writing for your app or website — onboarding flows, empty states, microcopy, and CTAs. Research-backed and on-brand.",
      category: "Writing & Translation",
      price: 550,
      deliveryDays: 6,
      tags: ["UX Writing", "Copy", "Conversion"],
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop",
      sales: 33,
      rating: "4.92",
    },
    {
      freelancer: "Lena Petrova",
      title: "I will run user research and deliver actionable insights",
      description:
        "Moderated interviews, surveys, and usability tests with synthesized findings and prioritized recommendations. Know exactly what to build next.",
      category: "Writing & Translation",
      price: 800,
      deliveryDays: 10,
      tags: ["Research", "Usability", "Insights"],
      image:
        "https://images.unsplash.com/photo-1554435493-93422e8d1a41?w=800&h=500&fit=crop",
      sales: 24,
      rating: "4.9",
    },
    {
      freelancer: "Omar Farouk",
      title: "I will build a custom RAG / LLM application",
      description:
        "Production RAG system over your data with retrieval, citations, evals, and a clean API. Built with Python, vector DBs, and modern LLM frameworks.",
      category: "AI & Data",
      price: 3200,
      deliveryDays: 18,
      tags: ["LLM", "RAG", "Python"],
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
      sales: 18,
      rating: "4.99",
    },
    {
      freelancer: "Omar Farouk",
      title: "I will design and build your data pipeline",
      description:
        "End-to-end ETL/ELT pipelines, data warehousing, and dashboards. Reliable, documented, and observable. Built for scale and low maintenance.",
      category: "AI & Data",
      price: 2200,
      deliveryDays: 15,
      tags: ["Data", "ETL", "Analytics"],
      image:
        "https://images.unsplash.com/photo-1551288049-494648a33b7c?w=800&h=500&fit=crop",
      sales: 21,
      rating: "4.95",
    },
    {
      freelancer: "Maya Tanaka",
      title: "I will build a cross-platform mobile app with React Native",
      description:
        "Polished iOS + Android app from a single codebase. Includes auth, push notifications, offline support, and App Store / Play Store submission.",
      category: "Development & IT",
      price: 3800,
      deliveryDays: 21,
      tags: ["React Native", "Mobile", "iOS"],
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop",
      sales: 27,
      rating: "4.9",
    },
    {
      freelancer: "Amira Hassan",
      title: "I will design a high-converting landing page",
      description:
        "Conversion-optimized landing page design with strong visual hierarchy, clear CTAs, and responsive layouts. Delivered in Figma, ready to build.",
      category: "Design & Creative",
      price: 420,
      deliveryDays: 4,
      tags: ["Landing Page", "Conversion", "Figma"],
      image:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=500&fit=crop",
      sales: 88,
      rating: "4.93",
    },
  ];

  const insertedServices = await db
    .insert(schema.services)
    .values(
      serviceSeeds.map((s) => ({
        freelancerId: byName.get(s.freelancer)!,
        title: s.title,
        description: s.description,
        category: s.category,
        price: s.price,
        tags: s.tags,
        imageUrl: s.image,
        deliveryDays: s.deliveryDays,
        rating: s.rating,
        reviewCount: Math.floor(s.sales * 0.7),
        salesCount: s.sales,
      }))
    )
    .returning({ id: schema.services.id, title: schema.services.title });
  const serviceByTitle = new Map(insertedServices.map((s) => [s.title, s.id]));

  /* ----------------------------------------------------------------
   * Projects
   * ---------------------------------------------------------------- */
  console.log("→ Seeding projects…");

  const projectSeeds = [
    {
      client: "James Wilson",
      title: "Redesign our analytics dashboard (React + design)",
      description:
        "We need a senior product designer + front-end developer to redesign our core analytics dashboard. Goal: improve usability and conversion to paid plans. You'll work from existing research and ship in Next.js.",
      category: "Development & IT",
      budgetMin: 4000,
      budgetMax: 8000,
      experienceLevel: "expert",
      duration: "1 to 3 months",
      skills: ["React", "UI/UX", "Next.js"],
      status: "open" as const,
    },
    {
      client: "Sara Brooks",
      title: "Build a brand identity for our new B2B product",
      description:
        "Launching a new vertical and need a complete brand identity — logo, palette, type, and guidelines. Looking for a designer with strong B2B portfolio.",
      category: "Design & Creative",
      budgetMin: 1500,
      budgetMax: 3000,
      experienceLevel: "intermediate",
      duration: "Less than 1 month",
      skills: ["Branding", "Logo Design"],
      status: "open" as const,
    },
    {
      client: "James Wilson",
      title: "Set up and manage Meta + Google ads for SaaS launch",
      description:
        "We're launching a new feature and need a growth marketer to plan, launch, and optimize paid campaigns across Meta and Google for 6 weeks.",
      category: "Digital Marketing",
      budgetMin: 2000,
      budgetMax: 5000,
      experienceLevel: "intermediate",
      duration: "1 to 3 months",
      skills: ["Paid Ads", "Google Ads", "Meta"],
      status: "open" as const,
    },
    {
      client: "Sara Brooks",
      title: "Build an AI chatbot over our help docs (RAG)",
      description:
        "Need an ML engineer to build a RAG-based support assistant over our documentation. Must include evals and a clean API we can integrate.",
      category: "AI & Data",
      budgetMin: 5000,
      budgetMax: 12000,
      experienceLevel: "expert",
      duration: "1 to 3 months",
      skills: ["Python", "LLMs", "RAG"],
      status: "open" as const,
    },
    {
      client: "James Wilson",
      title: "Mobile app prototype for our MVP (React Native)",
      description:
        "Looking for a mobile developer to build a clickable MVP of our app in React Native, with auth and a few core screens. Fast turnaround preferred.",
      category: "Development & IT",
      budgetMin: 3000,
      budgetMax: 6000,
      experienceLevel: "intermediate",
      duration: "Less than 1 month",
      skills: ["React Native", "Mobile"],
      status: "open" as const,
    },
  ];

  const insertedProjects = await db
    .insert(schema.projects)
    .values(
      projectSeeds.map((p) => ({
        clientId: byName.get(p.client)!,
        title: p.title,
        description: p.description,
        category: p.category,
        budgetMin: p.budgetMin,
        budgetMax: p.budgetMax,
        experienceLevel: p.experienceLevel,
        duration: p.duration,
        skillsRequired: p.skills,
        status: p.status,
        deadline: new Date(NOW.getTime() + 30 * 86400000),
      }))
    )
    .returning({ id: schema.projects.id, title: schema.projects.title });
  const projectByTitle = new Map(insertedProjects.map((p) => [p.title, p.id]));

  /* ----------------------------------------------------------------
   * Proposals
   * ---------------------------------------------------------------- */
  console.log("→ Seeding proposals…");

  const proposalSeeds = [
    {
      project: "Redesign our analytics dashboard (React + design)",
      freelancer: "Amira Hassan",
      bid: 6500,
      days: 35,
      letter:
        "I've redesigned dashboards for three fintech SaaS companies, each lifting activation. I can ship this end-to-end in Figma + Next.js with a strong focus on conversion. Excited to share my portfolio.",
    },
    {
      project: "Redesign our analytics dashboard (React + design)",
      freelancer: "David Chen",
      bid: 7200,
      days: 40,
      letter:
        "I'm a full-stack engineer who has shipped analytics products at scale. I can implement the redesign in Next.js with clean, tested code and a fast turnaround.",
    },
    {
      project: "Build a brand identity for our new B2B product",
      freelancer: "Sofia Ramirez",
      bid: 2400,
      days: 18,
      letter:
        "Branding for B2B is my specialty. I'll deliver a full identity system with guidelines and a social kit, grounded in positioning research.",
    },
    {
      project: "Set up and manage Meta + Google ads for SaaS launch",
      freelancer: "Marcus Johnson",
      bid: 4200,
      days: 42,
      letter:
        "I've managed over $12M in SaaS ad spend. I'll run full-funnel campaigns with clean attribution and weekly ROAS reporting.",
    },
    {
      project: "Build an AI chatbot over our help docs (RAG)",
      freelancer: "Omar Farouk",
      bid: 9000,
      days: 50,
      letter:
        "I've shipped multiple production RAG systems with evals and citations. I'll integrate with your docs and provide a clean API with monitoring.",
    },
  ];

  await db.insert(schema.proposals).values(
    proposalSeeds.map((p) => ({
      projectId: projectByTitle.get(p.project)!,
      freelancerId: byName.get(p.freelancer)!,
      bidAmount: p.bid,
      coverLetter: p.letter,
      estimatedDays: p.days,
      status: "pending" as const,
    }))
  );

  /* ----------------------------------------------------------------
   * Reviews
   * ---------------------------------------------------------------- */
  console.log("→ Seeding reviews…");

  const reviewSeeds = [
    { service: "I will design a premium SaaS dashboard UI in Figma", author: "Sara Brooks", to: "Amira Hassan", rating: 5, comment: "Incredible work. The dashboard redesign lifted our activation by 23%. Amira is a true professional." },
    { service: "I will design a premium SaaS dashboard UI in Figma", author: "James Wilson", to: "Amira Hassan", rating: 5, comment: "Pixel-perfect, on time, and a joy to work with. Will hire again." },
    { service: "I will develop a full-stack Next.js web application", author: "James Wilson", to: "David Chen", rating: 5, comment: "David shipped a complex app fast and the code quality is excellent. Highly recommend." },
    { service: "I will create a modern brand identity and logo package", author: "Sara Brooks", to: "Sofia Ramirez", rating: 5, comment: "Our new brand finally feels like us. Sofia nailed the brief." },
    { service: "I will set up and manage your Google & Meta ad campaigns", author: "James Wilson", to: "Marcus Johnson", rating: 4, comment: "Great results and clear reporting. ROAS improved within two weeks." },
    { service: "I will write UX copy that boosts your conversion rate", author: "Sara Brooks", to: "Lena Petrova", rating: 5, comment: "The new microcopy made our onboarding feel effortless. Conversion is up." },
    { service: "I will build a custom RAG / LLM application", author: "James Wilson", to: "Omar Farouk", rating: 5, comment: "Omar delivered a robust AI assistant with evals. Outstanding engineering." },
  ];

  await db.insert(schema.reviews).values(
    reviewSeeds.map((r) => ({
      serviceId: serviceByTitle.get(r.service)!,
      fromUserId: byName.get(r.author)!,
      toUserId: byName.get(r.to)!,
      rating: r.rating,
      comment: r.comment,
    }))
  );

  /* ----------------------------------------------------------------
   * Contact messages
   * ---------------------------------------------------------------- */
  console.log("→ Seeding contact messages…");
  await db.insert(schema.contactMessages).values([
    { fullName: "Priya Nair", email: "priya@brightlabs.io", company: "BrightLabs", interest: "Enterprise solutions", message: "We're a 200-person company looking for a managed freelance talent pool. Can someone reach out?" },
    { fullName: "Tom Becker", email: "tom@example.com", company: "", interest: "Partnership / affiliate", message: "Interested in your affiliate program. What are the commission rates?" },
  ]);

  /* ----------------------------------------------------------------
   * Admin user (separate — not in seedUsers to keep type safety)
   * ---------------------------------------------------------------- */
  console.log("→ Seeding admin user…");
  const ADMIN_PASSWORD = "Admin@Sarur2026";
  await db.insert(schema.users).values({
    email: "admin@sarur.app",
    passwordHash: await hashPassword(ADMIN_PASSWORD),
    fullName: "مدير المنصة",
    userType: "admin",
    avatarUrl: null,
    title: "مدير النظام",
    bio: "حساب إدارة منصة سرور",
    location: "Cairo, Egypt",
    skills: [],
    isVerified: true,
  });

  console.log("\n✅ Seed complete!");
  console.log("   Demo accounts (password for all):", PASSWORD);
  console.log("   - freelancer@sarur.app  (freelancer)");
  console.log("   - client@sarur.app      (client)");
  console.log("   - david@sarur.app, sofia@sarur.app, omar@sarur.app ...");
  console.log("   Admin account:");
  console.log("   - admin@sarur.app       (admin) — password:", ADMIN_PASSWORD);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
