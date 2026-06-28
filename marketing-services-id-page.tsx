import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  ArrowLeft,
  Calendar,
  Tag,
} from "lucide-react";
import { getServiceDetail } from "@/lib/queries";
import { Avatar, StarRating, Badge, EmptyState } from "@/components/ui";
import { formatDollars, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getServiceDetail(id);
  if (!service) notFound();

  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto max-w-7xl py-8">
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Main */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{service.category}</Badge>
              {service.tags?.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400"
                >
                  #{t}
                </span>
              ))}
            </div>

            <h1 className="mt-4 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              {service.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              <StarRating value={service.rating} size="md" />
              <span className="text-sm text-zinc-500">
                {service.reviewCount} reviews · {service.salesCount} sales
              </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              {service.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[16/9] w-full place-items-center bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-5xl">
                  🎨
                </div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold text-white">
                About this service
              </h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-zinc-300">
                {service.description}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Source files included",
                "Unlimited revisions until satisfied",
                "Direct communication",
                "Money-back guarantee",
              ].map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {f}
                </div>
              ))}
            </div>

            {/* Reviews */}
            <div className="mt-10">
              <h2 className="font-display text-lg font-semibold text-white">
                Reviews ({service.reviewCount})
              </h2>
              {service.reviews.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-500">
                  No reviews yet — be the first to work with this freelancer.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {service.reviews.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={r.authorName} src={r.authorAvatar} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-white">{r.authorName}</p>
                          <p className="text-xs text-zinc-500">{formatDate(r.createdAt)}</p>
                        </div>
                        <div className="ml-auto">
                          <StarRating value={r.rating} showValue={false} />
                        </div>
                      </div>
                      {r.comment && (
                        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                          {r.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Starting at</p>
                  <p className="font-display text-4xl font-bold text-white">
                    {formatDollars(service.price)}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Clock className="h-4 w-4" /> {service.deliveryDays} days delivery
                </span>
              </div>

              <ul className="mt-5 space-y-2.5 text-sm">
                {[
                  `${service.deliveryDays} days estimated delivery`,
                  "Concept draft included",
                  "Commercial usage rights",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>

              <button className="btn-primary mt-6 w-full rounded-xl py-3 text-sm font-semibold">
                Continue ({formatDollars(service.price)})
              </button>
              <button className="btn-ghost mt-3 w-full rounded-xl py-3 text-sm font-semibold text-white">
                <MessageCircle className="mr-1.5 inline h-4 w-4" /> Contact seller
              </button>

              <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Protected by SARUR escrow
              </div>
            </div>

            {/* Freelancer card */}
            <Link
              href={`/freelancers/${service.freelancerId}`}
              className="block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <Avatar name={service.freelancerName} src={service.freelancerAvatar} size="lg" />
                <div>
                  <p className="font-display text-base font-semibold text-white">
                    {service.freelancerName}
                  </p>
                  <p className="text-sm text-zinc-400">{service.freelancerTitle}</p>
                  <div className="mt-1">
                    <StarRating value={service.freelancerRating} />
                  </div>
                </div>
              </div>
              {service.freelancerBio && (
                <p className="mt-4 line-clamp-3 text-sm text-zinc-400">
                  {service.freelancerBio}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {service.freelancerCompleted} projects
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" /> {service.freelancerLocation ?? "Remote"}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
