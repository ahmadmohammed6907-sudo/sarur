import type { Metadata } from "next";
import { listFreelancers } from "@/lib/queries";
import { CATEGORY_NAMES } from "@/lib/constants";
import { FreelancerCard } from "@/components/cards";
import { MarketplaceFilters } from "@/components/MarketplaceFilters";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hire freelancers",
  description: "Browse and hire top-rated freelance talent vetted by SARUR.",
};

export default async function FreelancersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const search = sp.search || undefined;
  const category = sp.category && sp.category !== "all" ? sp.category : undefined;

  const freelancers = await listFreelancers({ search, category, limit: 12 });

  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto max-w-7xl py-10">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Top-rated talent
          </h1>
          <p className="mt-3 text-zinc-400">
            Hire vetted professionals with proven track records across every discipline.
          </p>
        </div>

        <div className="mt-8">
          <MarketplaceFilters
            initialSearch={search ?? ""}
            initialCategory={category ?? "all"}
            categories={CATEGORY_NAMES}
            sortOptions={[]}
          />
        </div>

        {freelancers.length === 0 ? (
          <EmptyState
            title="No freelancers found"
            description="Try a different search term or category."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {freelancers.map((f) => (
              <FreelancerCard key={f.id} freelancer={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
