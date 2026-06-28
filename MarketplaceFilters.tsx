"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";

type SortOption = { value: string; label: string };

export function MarketplaceFilters({
  initialSearch = "",
  initialCategory = "all",
  initialSort = "newest",
  categories,
  sortOptions,
}: {
  initialSearch?: string;
  initialCategory?: string;
  initialSort?: string;
  categories: string[];
  sortOptions: SortOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(initialSearch);

  function update(key: string, value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    update("search", search.trim());
  }

  const hasFilters = initialSearch || initialCategory !== "all";

  const selectClass =
    "rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-brand-500/60 focus:outline-none [&>option]:bg-ink-850";

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={submitSearch} className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 focus-within:border-brand-500/60">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                update("search", "");
              }}
              className="text-zinc-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <div className="flex gap-3">
          <select
            value={initialCategory}
            onChange={(e) => update("category", e.target.value)}
            className={`${selectClass} capitalize`}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {sortOptions.length > 0 && (
            <select
              value={initialSort}
              onChange={(e) => update("sort", e.target.value)}
              className={selectClass}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={() => {
            setSearch("");
            router.push(pathname);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white"
        >
          <X className="h-3.5 w-3.5" /> Clear filters
        </button>
      )}
    </div>
  );
}
