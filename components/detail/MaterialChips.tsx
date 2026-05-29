"use client";

import Link from "next/link";
import { Check, X, HelpCircle, Wrench, Activity } from "lucide-react";
import type { Game } from "@/lib/types";
import { useTools, getMaterialMatching } from "@/lib/tools";
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
  unmatchedCount: number,
): PreparationDifficulty {
  if (matched.length === 0 && unmatchedCount === 0) {
    return { level: "easy", label: "쉬움", score: 0, reasons: ["맨손·공간 위주"] };
  }

  const missing = matched.filter((t) => !inv[t.id]?.owned).length;
  const consumables = matched.filter((t) => t.type === "consumable").length;
  const expensive = matched.filter((t) => t.priceMax >= 30000).length;
  const overflowCount = Math.max(0, matched.length - 3);

  // 미등록 장비는 보유 확인 불가 → 미보유와 동일하게 부담으로 계산.
  const score =
    missing * 2 +
    unmatchedCount * 2 +
    consumables * 0.5 +
    expensive * 1 +
    overflowCount;

  const reasons: string[] = [];
  if (missing > 0) reasons.push(`미보유 ${missing}`);
  if (unmatchedCount > 0) reasons.push(`미등록 ${unmatchedCount}`);
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
  const { matched, unmatchedEquipment, ambientCount } = getMaterialMatching(
    game,
    tools,
  );

  // 매칭 도구도, 미등록 장비도 없음 → 맨손·공간 위주 게임.
  if (matched.length === 0 && unmatchedEquipment.length === 0) {
    return (
      <div className="rounded-[var(--radius-card-inner)] border-2 border-brand-500/40 bg-brand-50/40 p-4 dark:bg-brand-500/5">
        <div className="flex items-center gap-2 text-sm font-bold text-brand-700 dark:text-brand-300">
          <Wrench className="h-4 w-4" />
          준비물 매칭
        </div>
        <p className="mt-1.5 text-xs text-[var(--fg-muted)]">
          ✓ 별도 도구가 거의 필요 없는 게임 (맨손·공간·노래 위주).
          {ambientCount > 0 && ` 환경·인력 항목 ${ambientCount}개는 직접 확인.`}
        </p>
      </div>
    );
  }

  const ownedCount = matched.filter((t) => inv[t.id]?.owned).length;
  const missingTools = matched.length - ownedCount;
  const unmatchedCount = unmatchedEquipment.length;
  // "준비 완료" = 매칭 도구 전부 보유 AND 미등록 장비 없음.
  const allReady = missingTools === 0 && unmatchedCount === 0;
  const difficulty = getPreparationDifficulty(matched, inv, unmatchedCount);

  const statusParts: string[] = [];
  if (missingTools > 0) statusParts.push(`도구 ${missingTools}개 부족`);
  if (unmatchedCount > 0) statusParts.push(`미등록 ${unmatchedCount}개`);

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
          {allReady ? <>✓ 진행 준비 완료</> : <>✗ {statusParts.join(" · ")}</>}
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

        {/* 미등록 장비 — 도구 사전에 없어 보유 확인 불가. 직접 챙겨야 함. */}
        {unmatchedEquipment.map((m) => (
          <li key={m}>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--fg-muted)]"
              title="도구 사전에 없는 항목 — 보유 여부를 직접 확인하세요."
            >
              <HelpCircle className="h-3 w-3" aria-hidden />
              <span className="line-clamp-1 max-w-[12rem]">{m}</span>
              <span className="text-[9px] opacity-70">미등록</span>
            </span>
          </li>
        ))}
      </ul>

      {/* 메타 — 도구 수 + 구현 난이도 */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--line)]/60 pt-2.5 text-[11px] text-[var(--fg-muted)]">
        <span>
          도구 {matched.length}개
          {unmatchedCount > 0 && ` · 미등록 ${unmatchedCount}`}
          {ambientCount > 0 && ` · 환경 ${ambientCount}`}
        </span>
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
        {unmatchedCount > 0 ? (
          <>
            <span className="font-semibold">미등록</span> 항목은 도구 사전에 없어
            보유 확인이 안 됩니다 — 직접 챙기세요. 나머지 버튼은 현황 페이지로
            연결됩니다.
          </>
        ) : (
          <>버튼을 누르면 현황 페이지에서 해당 도구의 가격대·사용 게임을 볼 수 있음.</>
        )}
      </p>
    </div>
  );
}
