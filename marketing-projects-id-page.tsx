import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Wallet,
  Clock,
  Users,
  ArrowLeft,
  CalendarDays,
  Gauge,
  CheckCircle2,
} from "lucide-react";
import { getProjectDetail } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import { Avatar, Badge, EmptyState } from "@/components/ui";
import { ProposalForm } from "@/components/ProposalForm";
import { formatDollars, formatDate, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectDetail(id);
  if (!project) notFound();

  const me = await getCurrentUser();
  const canApply = me?.userType === "freelancer" && project.clientId !== me?.id;
  const isOwner = me?.id === project.clientId;

  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto max-w-7xl py-8">
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{project.category}</Badge>
              <Badge className="capitalize">{project.status.replace("_", " ")}</Badge>
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Clock className="h-3.5 w-3.5" /> Posted {timeAgo(project.createdAt)}
              </span>
            </div>

            <h1 className="mt-4 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              {project.title}
            </h1>

            <p className="mt-4 whitespace-pre-line leading-relaxed text-zinc-300">
              {project.description}
            </p>

            {project.skillsRequired.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Skills required
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.skillsRequired.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Proposals */}
            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-white">
                  Proposals ({project.proposals.length})
                </h2>
              </div>
              {project.proposals.length === 0 ? (
                <EmptyState
                  title="No proposals yet"
                  description={isOwner ? "Freelancers will apply soon." : "Be the first to apply!"}
                />
              ) : (
                <div className="mt-4 space-y-4">
                  {project.proposals.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={p.freelancerName} src={p.freelancerAvatar} />
                        <div>
                          <p className="font-semibold text-white">{p.freelancerName}</p>
                          <p className="text-xs text-zinc-400">
                            {p.freelancerTitle} · ⭐ {p.freelancerRating.toFixed(2)}
                          </p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="font-display text-lg font-bold text-white">
                            {formatDollars(p.bidAmount)}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {p.estimatedDays ? `${p.estimatedDays} days` : timeAgo(p.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                        {p.coverLetter}
                      </p>
                      <div className="mt-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                            p.status === "accepted"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : p.status === "rejected"
                              ? "bg-red-500/15 text-red-300"
                              : "bg-white/10 text-zinc-300"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-2 text-zinc-400">
                <Wallet className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Budget</span>
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-white">
                {formatDollars(project.budgetMin)} – {formatDollars(project.budgetMax)}
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <Row icon={<Gauge className="h-4 w-4" />} label="Experience">
                  <span className="capitalize">{project.experienceLevel}</span>
                </Row>
                <Row icon={<Clock className="h-4 w-4" />} label="Duration">
                  {project.duration ?? "Flexible"}
                </Row>
                {project.deadline && (
                  <Row icon={<CalendarDays className="h-4 w-4" />} label="Deadline">
                    {formatDate(project.deadline)}
                  </Row>
                )}
                <Row icon={<Users className="h-4 w-4" />} label="Proposals">
                  {project.proposals.length} received
                </Row>
              </div>
            </div>

            {/* Client */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Posted by
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={project.clientName} src={project.clientAvatar} size="lg" />
                <div>
                  <p className="font-semibold text-white">{project.clientName}</p>
                  <p className="text-xs text-zinc-400">
                    {project.clientLocation ?? "Remote"}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Verified client
                  </p>
                </div>
              </div>
            </div>

            {!isOwner && <ProposalForm projectId={project.id} canApply={canApply} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-t border-white/10 pt-3">
      <span className="flex items-center gap-2 text-zinc-400">
        {icon} {label}
      </span>
      <span className="font-medium text-white">{children}</span>
    </div>
  );
}
