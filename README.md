# SARUR Platform — Merged Codebase

A full-stack freelance marketplace built with **Next.js 16**, **PostgreSQL** (Drizzle ORM), and the **SARUR design system**.

This project merges:
- **sarur-platform-build** — SARUR UI design system (shadcn/ui components, brand tokens, landing sections)
- **sarur-platform-implementation** — Full-stack backend (Auth, DB schema, API routes, Dashboard)

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + tw-animate-css |
| UI Components | shadcn/ui (SARUR design tokens) |
| Database | PostgreSQL via Drizzle ORM |
| Auth | JWT (jose) + bcryptjs |
| Email | Resend |
| Animation | Framer Motion |
| Analytics | Vercel Analytics |

---

## Project Structure

```
src/
├── app/
│   ├── (marketing)/       # Public pages (home, services, projects, freelancers…)
│   │   ├── page.tsx       # Home — SARUR landing + live DB data
│   │   ├── services/
│   │   ├── projects/
│   │   ├── freelancers/
│   │   ├── about/
│   │   ├── contact/
│   │   └── pricing/
│   ├── api/               # REST API routes
│   │   ├── auth/          # login, logout, register, me
│   │   ├── services/
│   │   ├── projects/
│   │   ├── freelancers/
│   │   ├── proposals/
│   │   └── dashboard/
│   ├── auth/              # Login & register pages
│   └── dashboard/         # Protected dashboard
├── components/
│   ├── landing/           # SARUR landing sections (hero, categories, how-it-works…)
│   ├── ui/                # shadcn/ui component library
│   ├── AuthProvider.tsx   # React auth context
│   ├── DashboardShell.tsx
│   ├── Navbar.tsx         # Site header (auth-aware)
│   └── …
├── db/
│   ├── schema.ts          # Drizzle schema (users, services, projects, proposals)
│   ├── index.ts           # DB connection
│   └── seed.ts            # Seed data
├── lib/
│   ├── auth.ts            # JWT session helpers
│   ├── queries.ts         # Typed DB query helpers
│   ├── validation.ts      # Zod schemas
│   ├── constants.ts       # App constants & categories
│   ├── api.ts             # Client-side fetch helpers
│   └── utils.ts           # cn(), formatDollars(), timeAgo()…
└── middleware.ts           # Route protection
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
# or
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Fill in DATABASE_URL and JWT_SECRET
```

### 3. Set up the database

```bash
npm run db:push    # Push schema to DB
npm run db:seed    # Seed sample data
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Key Features

- **SARUR design system** — cream/teal brand palette, neo-skeuomorphic shadows, shadcn/ui
- **JWT authentication** — httpOnly cookie sessions, 7-day TTL, route middleware protection
- **Full marketplace** — services, projects, proposals, freelancer profiles
- **Real-time DB** — all pages server-rendered with live PostgreSQL data
- **Dark mode** — SARUR dark palette, system preference detection via next-themes
- **Animations** — Framer Motion (mobile nav, reveal), CSS keyframe utilities
