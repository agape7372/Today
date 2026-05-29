"use client";

import { Star } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/cn";

export interface FavoriteButtonProps {
  slug: string;
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({
  slug,
  className,
  size = "sm",
}: FavoriteButtonProps) {
  const { has, toggle } = useFavorites();
  const isFav = has(slug);
  const wh = size === "md" ? "h-9 w-9" : "h-8 w-8";
  const ih = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-label={isFav ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      aria-pressed={isFav}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all hover:bg-[var(--line)]",
        wh,
        isFav
          ? "text-warm-500 dark:text-warm-300"
          : "text-[var(--fg-muted)] hover:text-warm-600",
        className,
      )}
    >
      <Star
        className={cn(ih, isFav && "fill-current")}
        aria-hidden
      />
    </button>
  );
}
