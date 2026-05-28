"use client";

import { Check, X, Package, type LucideIcon } from "lucide-react";
import type { ToolDef } from "@/lib/tools-master";
import type { InventoryEntry } from "@/lib/inventory";
import { cn } from "@/lib/cn";

export interface ToolCardProps {
  tool: ToolDef;
  entry?: InventoryEntry;
  usedInGameCount: number;
  onClick: () => void;
  selected?: boolean;
}

export function ToolCard({
  tool,
  entry,
  usedInGameCount,
  onClick,
  selected,
}: ToolCardProps) {
  const owned = Boolean(entry?.owned);
  const status: { icon: LucideIcon; color: string; label: string } = owned
    ? {
        icon: Check,
        color:
          "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300",
        label: "보유",
      }
    : {
        icon: X,
        color:
          "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
        label: "미보유",
      };
  const StatusIcon = status.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative w-full rounded-[var(--radius-card-inner)] border p-3.5 text-left transition-all",
        "shadow-soft hover:-translate-y-0.5 hover:shadow-lifted",
        "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none",
        selected
          ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10"
          : "border-[var(--line)] bg-[var(--bg-elevated)]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 truncate text-lg font-bold tracking-tight">
          {tool.name}
        </h3>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
            status.color,
          )}
        >
          <StatusIcon className="h-3 w-3" aria-hidden />
          {status.label}
        </span>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2 text-xs text-[var(--fg-muted)]">
        <span className="inline-flex items-center gap-1">
          <Package className="h-3 w-3" aria-hidden />
          {usedInGameCount > 0
            ? `${usedInGameCount}게임 사용`
            : "사용 게임 없음"}
        </span>
        {entry?.condition && (
          <span className="rounded-full bg-[var(--line)] px-1.5 py-0.5 text-[10px] font-medium">
            {entry.condition === "good"
              ? "양호"
              : entry.condition === "low"
                ? "재고 부족"
                : entry.condition === "damaged"
                  ? "수리 필요"
                  : "분실"}
          </span>
        )}
      </div>
    </button>
  );
}
