import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  value: number | string;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function StarRating({
  value,
  max = 5,
  size = "md",
  showValue = true,
  className,
}: StarRatingProps) {
  const rating = typeof value === "string" ? parseFloat(value) : value;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const isFull = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;

          return (
            <div key={i} className="relative">
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  isFull || isHalf
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-zinc-600"
                )}
              />
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs text-zinc-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
