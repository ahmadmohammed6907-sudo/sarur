import Link from "next/link";
import { Clock, Users, TrendingUp, MapPin, BadgeCheck, ArrowUpRight } from "lucide-react";
import { Avatar, StarRating, Badge } from "@/components/ui";
import { formatDollars, timeAgo } from "@/lib/utils";
import type { ServiceListItem, ProjectListItem } from "@/lib/queries";

export function ServiceCard({ service }: { service: ServiceListItem }) {
  return (
    <Link
      href={`/services/${service.id}`}
      className="group lift flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {service.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.imageUrl}
            alt={service.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-3xl">
            🎨
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-brand-400">
          {service.title}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <Avatar name={service.freelancer.fullName} src={service.freelancer.avatarUrl} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-zinc-200">
              {service.freelancer.fullName}
            </p>
            <p className="truncate text-[11px] text-zinc-500">{service.freelancer.title}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <StarRating value={service.rating} />
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-zinc-500">From</p>
            <p className="font-display text-base font-bold text-white">
              {formatDollars(service.price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group lift flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-center justify-between">
        <Badge>{project.category}</Badge>
        <span className="flex items-center gap-1 text-xs text-zinc-500">
          <Clock className="h-3.5 w-3.5" /> {timeAgo(project.createdAt)}
        </span>
      </div>

      <h3 className="mt-3 line-clamp-2 font-display text-base font-semibold text-white group-hover:text-brand-400">
        {project.title}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-zinc-400">{project.description}</p>

      {project.skillsRequired.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.skillsRequired.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-zinc-300"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-zinc-500">Budget</p>
          <p className="text-sm font-semibold text-white">
            {formatDollars(project.budgetMin)} – {formatDollars(project.budgetMax)}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-400">
          <Users className="h-3.5 w-3.5" />
          {project.proposalCount} {project.proposalCount === 1 ? "bid" : "bids"}
        </div>
      </div>
    </Link>
  );
}

export function FreelancerCard({
  freelancer,
}: {
  freelancer: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    title: string | null;
    bio: string | null;
    location: string | null;
    skills: string[];
    hourlyRate: number | null;
    rating: number;
    reviewCount: number;
    completedProjects: number;
  };
}) {
  return (
    <Link
      href={`/freelancers/${freelancer.id}`}
      className="group lift flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-start gap-3">
        <Avatar name={freelancer.fullName} src={freelancer.avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-display text-base font-semibold text-white group-hover:text-brand-400">
              {freelancer.fullName}
            </h3>
          </div>
          <p className="truncate text-sm text-zinc-400">{freelancer.title}</p>
          <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {freelancer.location ?? "Remote"}
            </span>
            {freelancer.rating > 0 && (
              <span className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-brand-400" /> {freelancer.rating.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 transition group-hover:text-white" />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-zinc-400">{freelancer.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {freelancer.skills.slice(0, 4).map((s) => (
          <span key={s} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-zinc-300">
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="flex items-center gap-1 text-xs text-zinc-400">
          <TrendingUp className="h-3.5 w-3.5" />
          {freelancer.completedProjects} projects
        </span>
        {freelancer.hourlyRate && (
          <p className="text-sm font-semibold text-white">
            {formatDollars(freelancer.hourlyRate)}
            <span className="text-xs font-normal text-zinc-500">/hr</span>
          </p>
        )}
      </div>
    </Link>
  );
}
