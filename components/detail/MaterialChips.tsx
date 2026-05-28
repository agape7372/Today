"use client";

import Link from "next/link";
import { Check, X, HelpCircle, Wrench, Activity } from "lucide-react";
import type { Game } from "@/lib/types";
import { useTools, getToolsForGame } from "@/lib/tools";
import { useInventory, type InventoryMap } from "@/lib/inventory";
import { CATEGORY_LABELS, type ToolDef } from "@/lib/tools-master";
import { cn } from "@/lib/cn";

type DifficultyLevel = "easy" | "medium" | "hard";

interface PreparationDifficulty {
  level: DifficultyLevel;
  label: string;
  score: number;
  reasons: string[];
}

function getPreparationDifficulty(
  matched: ToolDef[],
  inv: InventoryMap,
): PreparationDifficulty {
  if (matched.length === 0) {
    return { level: "easy", label: "쉬움", score: 0, reasons: ["도구 없음"] };
  }

  const missing = matched.filter((t) => !inv[t.id]?.owned).length;
  const consumables = matched.filter((t) => t.type === "consumable").length;
  const expensive = matched.filter((t) => t.priceMax >= 30000).length;
  const overflowCount = Math.max(0, matched.length - 3);

  const score =
    missing * 2 + consumables * 0.5 + expensive * 1 + overflowCount;

  const reasons: string[] = [];
  if (missing > 0) reasons.push(`미보유 ${missing}`);
  if (consumables > 0) reasons.push(`소비재 ${consumables}`);
  if (expensive > 0) reasons.push(`고가 ${expensive}`);
  if (matched.length > 3) reasons.push(`도구 ${matched.length}개`);
  if (reasons.length === 0) reasons.push("모두 보유 · 영구재 위주");

  let level: DifficultyLevel;
  let label: string;
  if (score <= 1.5) {
    level = "easy";
    label = "쉬움";
  } else if (score <= 4) {
    level = "medium";
    label = "보통";
  } else {
    level = "hard";
    label = "어려움";
  }

  return { level, label, score, reasons };
}

const DIFFICULTY_STYLE: Record<DifficultyLevel, string> = {
  easy: "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  medium:
    "bg-warm-300/30 text-warm-700 dark:bg-warm-500/15 dark:text-warm-300",
  hard: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

export function MaterialChips({ game }: { game: Game }) {
  const tools = useTools();
  const { inv } = useInventory();
  const matched = getToolsForGame(game, tools);

  if (matched.length === 0) {
    return (
      <div className="rounded-[var(--radius-card-inner)] border border-dashed border-[var(--line)] bg-[var(--bg-elevated)] p-4">
        <div className="flex items-center gap-2 text-xs text-[var(--fg-muted)]">
          <HelpCircle className="h-3.5 w-3.5" />
          매칭된 도구 없음 — 위 준비물 목록을 직접 확인.
        </div>
      </div>
    );
  }

  const ownedCount = matched.filter((t) => inv[t.id]?.owned).length;
  const allReady = ownedCount === matched.length;
  const missingCount = matched.length - ownedCount;
  const difficulty = getPreparationDifficulty(matched, inv);

  return (
    <div
      className={cn(
        "rounded-[var(--radius-card-inner)] border-2 p-4 transition-colors",
        allReady
          ? "border-brand-500/40 bg-brand-50/40 dark:bg-brand-500/5"
          : "border-warm-500/40 bg-warm-300/10 dark:bg-warm-500/5",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-bold uppercase tracking-wide">
            준비물 매칭
          </h3>
        </div>
        <p
          className={cn(
            "text-xs font-bold",
            allReady
              ? "text-brand-700 dark:text-brand-300"
              : "text-warm-600 dark:text-warm-300",
          )}
        >
          {allReady ? <>✓ 진행 준비 완료</> : <>✗ {missingCount}개 부족</>}
        </p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {matched.map((t) => {
          const owned = Boolean(inv[t.id]?.owned);
          const StatusIcon = owned ? Check : X;
          return (
            <li key={t.id}>
              <Link
                href={`/inventory?tool=${t.id}`}
                className={cn(
                  "group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  "border shadow-soft hover:-translate-y-0.5 hover:shadow-lifted",
                  owned
                    ? "border-brand-500/40 bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-200"
                    : "border-rose-500/40 bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
                )}
              >
                <StatusIcon className="h-3 w-3" aria-hidden />
                <span>{t.name}</span>
                <span className="text-[9px] opacity-70">
                  {CATEGORY_LABELS[t.category]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 메타 — 도구 수 + 구현 난이도 */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--line)]/60 pt-2.5 text-[11px] text-[var(--fg-muted)]">
        <span>도구 {matched.length}개</span>
        <span className="opacity-50">·</span>
        <span className="inline-flex items-center gap-1.5">
          <Activity className="h-3 w-3" aria-hidden />
          구현 난이도
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
              DIFFICULTY_STYLE[difficulty.level],
            )}
          >
            {difficulty.label}
          </span>
        </span>
        <span className="opacity-50">·</span>
        <span className="text-[10px] opacity-80">
          {difficulty.reasons.join(" · ")}
        </span>
      </div>

      <p className="mt-2 text-[10px] text-[var(--fg-muted)]">
        버튼을 누르면 현황 페이지에서 해당 도구의 가격대·사용 게임을 볼 수 있음.
      </p>
    </div>
  );
}
