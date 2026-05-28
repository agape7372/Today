"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Check, ArrowRight } from "lucide-react";
import type { ToolDef } from "@/lib/tools-master";
import { CATEGORY_LABELS, TYPE_LABELS } from "@/lib/tools-master";
import { useInventory, type InventoryCondition } from "@/lib/inventory";
import type { Game } from "@/lib/types";
import { cn } from "@/lib/cn";

const CONDITION_LABELS: Record<InventoryCondition, string> = {
  good: "양호",
  low: "재고 부족",
  damaged: "수리·교체 필요",
  lost: "분실",
};

const CONDITION_COLOR: Record<InventoryCondition, string> = {
  good: "border-brand-500 text-brand-700 dark:text-brand-300",
  low: "border-warm-500 text-warm-600 dark:text-warm-300",
  damaged: "border-rose-500 text-rose-600 dark:text-rose-300",
  lost: "border-zinc-500 text-zinc-600 dark:text-zinc-300",
};

function formatPriceFull(min: number, max: number): string {
  if (min === 0 && max === 0) return "치료실 기본 구비 (별도 비용 없음)";
  const fmt = (n: number) => n.toLocaleString("ko-KR");
  if (min === max) return `${fmt(min)}원`;
  return `${fmt(min)}–${fmt(max)}원`;
}

export interface ToolDetailProps {
  tool: ToolDef;
  usedInGames: Game[];
  onClose: () => void;
}

export function ToolDetail({ tool, usedInGames, onClose }: ToolDetailProps) {
  const { get, toggleOwned, setEntry } = useInventory();
  const entry = get(tool.id);
  const owned = Boolean(entry?.owned);

  // 메모 자동 저장 인디케이터
  const [justSavedNote, setJustSavedNote] = useState(false);
  const noteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    };
  }, []);
  const handleNoteChange = (value: string) => {
    setEntry(tool.id, { notes: value });
    setJustSavedNote(true);
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    noteTimerRef.current = setTimeout(() => setJustSavedNote(false), 1200);
  };

  return (
    <div
      className="rounded-[var(--radius-card)] border-2 border-brand-500 bg-[var(--bg-elevated)] p-5 shadow-lifted"
      aria-labelledby={`tool-${tool.id}-title`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
            {CATEGORY_LABELS[tool.category]} · {TYPE_LABELS[tool.type]}
          </p>
          <h2
            id={`tool-${tool.id}-title`}
            className="mt-1 text-xl font-bold tracking-tight"
          >
            {tool.name}
          </h2>
          {tool.nameEn && (
            <p className="text-xs text-[var(--fg-muted)]">{tool.nameEn}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="rounded-full p-1 text-[var(--fg-muted)] hover:bg-[var(--line)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {tool.description && (
        <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">
          {tool.description}
        </p>
      )}

      {/* 가격 정보 */}
      <div className="mt-4 rounded-[var(--radius-card-inner)] border border-[var(--line)] bg-[var(--bg)] p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)]">
          가격대
        </p>
        <p className="mt-0.5 text-lg font-bold text-brand-700 dark:text-brand-300">
          {formatPriceFull(tool.priceMin, tool.priceMax)}
        </p>
        {tool.priceNote && (
          <p className="mt-0.5 text-xs text-[var(--fg-muted)]">
            {tool.priceNote}
          </p>
        )}
      </div>

      {/* 보유 토글 */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">현재 보유</span>
          <button
            type="button"
            onClick={() => toggleOwned(tool.id)}
            aria-pressed={owned}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              owned
                ? "bg-brand-500 text-white"
                : "border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--fg)]",
            )}
          >
            {owned ? (
              <>
                <Check className="h-3.5 w-3.5" /> 보유 중
              </>
            ) : (
              <>
                <X className="h-3.5 w-3.5" /> 미보유
              </>
            )}
          </button>
        </div>

        {owned && (
          <>
            <div>
              <p className="mb-1.5 text-xs font-medium text-[var(--fg-muted)]">
                상태
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  Object.keys(CONDITION_LABELS) as InventoryCondition[]
                ).map((c) => {
                  const active = entry?.condition === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        setEntry(tool.id, {
                          condition: active ? undefined : c,
                        })
                      }
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                        active
                          ? CONDITION_COLOR[c]
                          : "border-[var(--line)] text-[var(--fg-muted)] hover:bg-[var(--line)]",
                      )}
                    >
                      {CONDITION_LABELS[c]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--fg-muted)]">
                  메모
                </label>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[10px] transition-opacity",
                    justSavedNote
                      ? "text-brand-600 opacity-100 dark:text-brand-400"
                      : "text-[var(--fg-muted)]/60 opacity-100",
                  )}
                  aria-live="polite"
                >
                  {justSavedNote ? (
                    <>
                      <Check className="h-2.5 w-2.5" />
                      저장됨
                    </>
                  ) : (
                    <>자동 저장 — 입력 즉시 반영</>
                  )}
                </span>
              </div>
              <textarea
                value={entry?.notes ?? ""}
                onChange={(e) => handleNoteChange(e.target.value)}
                rows={2}
                placeholder="보관 위치, 구매 메모 등"
                className="w-full resize-none rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
          </>
        )}
      </div>

      {/* 사용 게임 */}
      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)]">
          이 도구를 사용하는 게임 ({usedInGames.length})
        </p>
        {usedInGames.length === 0 ? (
          <p className="mt-1.5 text-xs italic text-[var(--fg-muted)]">
            매칭되는 게임 없음. 별칭을 추가하면 자동 연결.
          </p>
        ) : (
          <ul className="mt-2 space-y-1">
            {usedInGames.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/games/${g.slug}`}
                  className="group flex items-center justify-between gap-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm transition-colors hover:border-brand-500 hover:bg-brand-50/40 dark:hover:bg-brand-500/10"
                >
                  <span className="truncate">{g.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[var(--fg-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
