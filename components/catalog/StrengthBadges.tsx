import {
  Sparkles,
  Lightbulb,
  Flame,
  TrendingUp,
  Brain,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";
import type { GameTraits, TraitKey } from "@/lib/types";
import { getStrengths, getStrengthLabel } from "@/lib/strengths";
import { cn } from "@/lib/cn";

const ICON: Record<TraitKey, LucideIcon> = {
  fun: Sparkles,
  novelty: Lightbulb,
  engagement: Flame,
  difficulty: TrendingUp,
  cognitiveLoad: Brain,
  functionalLevel: Dumbbell,
};

const TONE: Record<TraitKey, string> = {
  fun: "bg-warm-300/30 text-warm-700 dark:bg-warm-500/15 dark:text-warm-300",
  novelty:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  engagement:
    "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  difficulty:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  cognitiveLoad:
    "bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300",
  functionalLevel:
    "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
};

export interface StrengthBadgesProps {
  traits: GameTraits;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function StrengthBadges({
  traits,
  max = 2,
  size = "sm",
  className,
}: StrengthBadgesProps) {
  const strengths = getStrengths(traits, max);
  if (strengths.length === 0) return null;

  const sizeClass =
    size === "md"
      ? "text-xs px-2.5 py-1 gap-1.5"
      : "text-[10px] px-2 py-0.5 gap-1";
  const iconSize = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3";

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {strengths.map((k) => {
        const Icon = ICON[k];
        return (
          <span
            key={k}
            className={cn(
              "inline-flex items-center rounded-full font-medium",
              sizeClass,
              TONE[k],
            )}
          >
            <Icon className={iconSize} aria-hidden />
            {getStrengthLabel(k)}
          </span>
        );
      })}
    </div>
  );
}
