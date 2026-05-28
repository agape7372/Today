import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone =
  | "brand"
  | "accent"
  | "warm"
  | "neutral"
  | "rose"
  | "violet"
  | "amber";

const TONE_STYLES: Record<Tone, string> = {
  brand:
    "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  accent:
    "bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300",
  warm:
    "bg-warm-300/30 text-warm-600 dark:bg-warm-500/15 dark:text-warm-300",
  neutral:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  rose:
    "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  amber:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  children: ReactNode;
}

export function Badge({
  tone = "brand",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5",
        "text-xs font-medium",
        TONE_STYLES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
