import type { Metadata } from "next";
import { listServices } from "@/lib/queries";
import { CATEGORIES, CATEGORY_NAMES } from "@/lib/constants";
import { ServiceCard } from "@/components/cards";
import { MarketplaceFilters } from "@/components/MarketplaceFilters";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse services",
  description: "Explore thousands of vetted freelance services across design, development, marketing and more.",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top rated" },
  { value: "price_low", label: "Price: low to high" },
  { value: "price_high", label: "Price: high to low" },
];

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const category = sp.category && sp.category !== "all" ? sp.category : undefined;
  const search = sp.search || undefined;
  const sortBy = (sp.sort as "newest" | "rating" | "price_low" | "price_high") || "newest";
  const page = Math.max(1, Number(sp.page) || 1);

  const { items, total } = await listServices({
    category,
    search,
    sortBy,
    limit: 12,
    offset: (page - 1) * 12,
  });

  const activeCategory = CATEGORIES.find((c) => c.name === category);

  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto max-w-7xl py-10">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {activeCategory ? activeCategory.name : "Explore services"}
          </h1>
          <p className="mt-3 text-zinc-400">
            {activeCategory?.description ??
              "Discover vetted freelancers offering professional services across every category."}
          </p>
        </div>

        <div className="mt-8">
          <MarketplaceFilters
            initialSearch={search ?? ""}
            initialCategory={category ?? "all"}
            initialSort={sortBy}
            categories={CATEGORY_NAMES}
            sortOptions={SORT_OPTIONS}
          />
        </div>

        <div className="mb-4 flex items-center justify-between text-sm text-zinc-500">
          <span>
            {total} {total === 1 ? "service" : "services"} available
          </span>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="No services found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
