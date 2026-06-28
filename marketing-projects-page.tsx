import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Briefcase } from "lucide-react";
import { listProjects } from "@/lib/queries";
import { CATEGORY_NAMES } from "@/lib/constants";
import { ProjectCard } from "@/components/cards";
import { MarketplaceFilters } from "@/components/MarketplaceFilters";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find freelance projects",
  description: "Browse open projects from clients around the world and submit proposals.",
};

const STATUS_OPTIONS = ["open", "in_progress", "completed"];

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status && STATUS_OPTIONS.includes(sp.status) ? sp.status : "open";
  const category = sp.category && sp.category !== "all" ? sp.category : undefined;
  const search = sp.search || undefined;

  const projects = await listProjects({ status, category, search, limit: 12 });

  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto max-w-7xl py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Open projects
            </h1>
            <p className="mt-3 text-zinc-400">
              Browse real opportunities from clients and submit your proposal in minutes.
            </p>
          </div>
          <Link
            href="/projects/new"
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> Post a project
          </Link>
        </div>

        {/* Status tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <Link
              key={s}
              href={`/projects?status=${s}`}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                status === s
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {s.replace("_", " ")}
            </Link>
          ))}
        </div>

        <div className="mt-6">
          <MarketplaceFilters
            initialSearch={search ?? ""}
            initialCategory={category ?? "all"}
            categories={CATEGORY_NAMES}
            sortOptions={[]}
          />
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="Try a different category or check back soon — new projects are posted daily."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
