import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  title: string;
  description?: string;
  eyebrow?: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({
  title,
  description,
  eyebrow,
  subtitle,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-white">
        {title}
      </h2>
      {(description || subtitle) && (
        <p className="text-lg text-zinc-400">
          {description || subtitle}
        </p>
      )}
    </div>
  );
}
