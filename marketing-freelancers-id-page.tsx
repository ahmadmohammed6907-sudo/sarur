import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  BadgeCheck,
  Briefcase,
  Star,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { getFreelancerDetail } from "@/lib/queries";
import { Avatar, StarRating, Badge } from "@/components/ui";
import { formatDollars } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function FreelancerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const freelancer = await getFreelancerDetail(id);
  if (!freelancer) notFound();

  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto max-w-7xl py-8">
        <Link
          href="/freelancers"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to talent
        </Link>

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar name={freelancer.fullName} src={freelancer.avatarUrl} size="lg" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  {freelancer.fullName}
                </h1>
                {freelancer.isVerified && (
                  <BadgeCheck className="h-5 w-5 text-brand-400" />
                )}
              </div>
              <p className="mt-1 text-lg text-zinc-300">{freelancer.title}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-zinc-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {freelancer.location ?? "Remote"}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {freelancer.rating.toFixed(2)} ({freelancer.reviewCount})
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" /> {freelancer.completedProjects} projects
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              {freelancer.hourlyRate && (
                <p className="font-display text-2xl font-bold text-white">
                  {formatDollars(freelancer.hourlyRate)}
                  <span className="text-sm font-normal text-zinc-400">/hr</span>
                </p>
              )}
              <button className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold">
                <MessageCircle className="h-4 w-4" /> Contact
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">About</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-zinc-300">
              {freelancer.bio ?? "No bio provided yet."}
            </p>

            <h2 className="mt-8 font-display text-lg font-semibold text-white">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {freelancer.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-200"
                >
                  {s}
                </span>
              ))}
            </div>

            {freelancer.services.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-semibold text-white">
                  Services by {freelancer.fullName.split(" ")[0]}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {freelancer.services.map((s) => (
                    <Link
                      key={s.id}
                      href={`/services/${s.id}`}
                      className="group lift flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:border-white/20"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        {s.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.imageUrl} alt={s.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full w-full place-items-center bg-white/5">🎨</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-white group-hover:text-brand-400">
                          {s.title}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <StarRating value={Number(s.rating)} />
                          <span className="text-sm font-semibold text-white">
                            {formatDollars(s.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-display text-base font-semibold text-white">At a glance</h3>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["Completed projects", freelancer.completedProjects],
                  ["Total reviews", freelancer.reviewCount],
                  ["Average rating", freelancer.rating.toFixed(2)],
                  ["Member since", new Date(freelancer.createdAt).getFullYear()],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-t border-white/10 pt-3">
                    <dt className="text-zinc-400">{label}</dt>
                    <dd className="font-semibold text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-display text-base font-semibold text-white">Why hire me?</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
                {[
                  "Responds within 2 hours",
                  "Top-rated, vetted professional",
                  "Secure escrow on every order",
                  "Revisions until you're happy",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
