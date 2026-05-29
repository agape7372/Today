"use client";

import { Plus, Check } from "lucide-react";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/cn";

export interface SessionButtonProps {
  slug: string;
  className?: string;
  size?: "sm" | "md";
  /** 아이콘만(카드용) vs 라벨 포함(상세용) */
  withLabel?: boolean;
}

export function SessionButton({
  slug,
  className,
  size = "sm",
  withLabel = false,
}: SessionButtonProps) {
  const { has, toggle } = useSession();
  const inSession = has(slug);
  const ih = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(slug);
        }}
        aria-pressed={inSession}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors no-print",
          inSession
            ? "bg-brand-500 text-white hover:bg-brand-600"
            : "border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--fg)] hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400",
          className,
        )}
      >
        {inSession ? (
          <Check className={ih} aria-hidden />
        ) : (
          <Plus className={ih} aria-hidden />
        )}
        {inSession ? "세션에 담음" : "오늘 세션에 담기"}
      </button>
    );
  }

  const wh = size === "md" ? "h-9 w-9" : "h-8 w-8";
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-label={inSession ? "오늘 세션에서 빼기" : "오늘 세션에 담기"}
      aria-pressed={inSession}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all no-print",
        wh,
        inSession
          ? "bg-brand-500 text-white hover:bg-brand-600"
          : "bg-transparent text-[var(--fg-muted)] hover:bg-[var(--line)] hover:text-brand-600",
        className,
      )}
    >
      {inSession ? (
        <Check className={ih} aria-hidden />
      ) : (
        <Plus className={ih} aria-hidden />
      )}
    </button>
  );
}
