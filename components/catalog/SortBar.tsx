"use client";

import { ArrowDownWideNarrow } from "lucide-react";
import { TRAIT_KEYS, TRAIT_LABELS } from "@/lib/constants";
import type { TraitKey } from "@/lib/types";
import { cn } from "@/lib/cn";

export interface SortBarProps {
  active?: TraitKey;
  onChange: (next?: TraitKey) => void;
}

export function SortBar({ active, onChange }: SortBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--fg-muted)]">
        <ArrowDownWideNarrow className="h-3.5 w-3.5" />
        특성 정렬 (높은 순)
      </div>
      <div className="flex flex-wrap gap-1.5">
        {TRAIT_KEYS.map((k) => {
          const isActive = active === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => onChange(isActive ? undefined : k)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-brand-500 text-white shadow-soft scale-[1.02]"
                  : "border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--fg)] hover:bg-brand-50 dark:hover:bg-brand-900/30",
              )}
              aria-pressed={isActive}
            >
              {TRAIT_LABELS[k]}
              {isActive && <span className="ml-1">↓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
