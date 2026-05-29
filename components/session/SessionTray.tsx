"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Layers,
  X,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Clock,
  Users,
  Sparkles,
} from "lucide-react";
import type { GameLite } from "@/lib/types";
import { useSession } from "@/lib/session";
import { recommendForSession } from "@/lib/session-recommend";
import { cn } from "@/lib/cn";

export interface SessionTrayProps {
  games: GameLite[];
}

const TONE: Record<string, string> = {
  brand:
    "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  sky: "bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300",
  amber:
    "bg-warm-300/30 text-warm-700 dark:bg-warm-500/20 dark:text-warm-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

export function SessionTray({ games }: SessionTrayProps) {
  const { slugs, remove, move, reorder, clear } = useSession();
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const bySlug = useMemo(() => {
    const m = new Map<string, GameLite>();
    for (const g of games) m.set(g.slug, g);
    return m;
  }, [games]);

  const items = useMemo(
    () => slugs.map((s) => bySlug.get(s)).filter((g): g is GameLite => !!g),
    [slugs, bySlug],
  );

  const summary = useMemo(() => {
    if (items.length === 0) return null;
    const totalMin = items.reduce((a, g) => a + g.durationMin, 0);
    const totalMax = items.reduce((a, g) => a + g.durationMax, 0);
    const typical = Math.round(
      items.reduce((a, g) => a + (g.durationMin + g.durationMax) / 2, 0),
    );
    let fit = { label: "30분 한 타임 적정", tone: "brand" };
    if (typical < 12) fit = { label: "여유 — 더 담아도 됨", tone: "sky" };
    else if (typical <= 30) fit = { label: "30분 한 타임 적정", tone: "brand" };
    else if (typical <= 40)
      fit = { label: "빠듯 — 마무리 시간 고려", tone: "amber" };
    else fit = { label: "초과 — 게임 빼기", tone: "rose" };

    const pMin = Math.max(...items.map((g) => g.participants.min));
    const pMax = Math.min(...items.map((g) => g.participants.max));
    const materials = new Set(items.flatMap((g) => g.materials)).size;
    return {
      totalMin,
      totalMax,
      typical,
      fit,
      pMin,
      pMax,
      pOk: pMin <= pMax,
      materials,
    };
  }, [items]);

  const recommendations = useMemo(
    () => recommendForSession(slugs, games, 3),
    [slugs, games],
  );

  // 세션이 비어 있으면 트레이 자체를 숨김 (담는 순간 등장)
  if (items.length === 0 || !summary) return null;

  return (
    <div className="no-print fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2">
      {!open ? (
        // ── 접힌 상태: 개수 + 합계 시간 알약 ──
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mx-auto flex items-center gap-2.5 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lifted transition-colors hover:bg-brand-700"
        >
          <Layers className="h-4 w-4" aria-hidden />
          오늘 세션 {items.length}개
          <span className="opacity-80">·</span>
          <span className="inline-flex items-center gap-1 font-medium opacity-90">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {summary.totalMin}–{summary.totalMax}분
          </span>
          <ChevronUp className="h-4 w-4 opacity-80" aria-hidden />
        </button>
      ) : (
        // ── 펼친 상태: 목록 + 요약 + 추천 ──
        <div className="flex max-h-[72vh] flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] shadow-lifted">
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
            <p className="inline-flex items-center gap-2 font-bold">
              <Layers className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden />
              오늘 세션 {items.length}개
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs text-[var(--fg-muted)] hover:text-rose-600"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                비우기
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="트레이 접기"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--fg-muted)] hover:bg-[var(--line)]"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>

          {/* 요약 바 */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
                TONE[summary.fit.tone],
              )}
            >
              <Clock className="h-3 w-3" aria-hidden />
              {summary.totalMin}–{summary.totalMax}분 · {summary.fit.label}
            </span>
            <span className="inline-flex items-center gap-1 text-[var(--fg-muted)]">
              <Users className="h-3 w-3" aria-hidden />
              {summary.pOk
                ? `공통 ${summary.pMin}–${summary.pMax}명`
                : "공통 인원 없음 (개별 조정)"}
            </span>
            <span className="text-[var(--fg-muted)]">
              준비물 {summary.materials}항목
            </span>
          </div>

          {/* 게임 목록 (드래그 + 위/아래 재정렬) */}
          <ul className="flex-1 overflow-y-auto px-2 py-2">
            {items.map((g, i) => (
              <li
                key={g.slug}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null) reorder(dragIndex, i);
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
                className={cn(
                  "flex items-center gap-2 rounded-[var(--radius-card-inner)] px-2 py-2",
                  dragIndex === i
                    ? "bg-brand-50 dark:bg-brand-500/10"
                    : "hover:bg-[var(--bg)]",
                )}
              >
                <GripVertical
                  className="h-4 w-4 shrink-0 cursor-grab text-[var(--fg-muted)]"
                  aria-hidden
                />
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/games/${g.slug}`}
                    className="block truncate text-sm font-medium hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    {g.name}
                  </Link>
                  <span className="text-[11px] text-[var(--fg-muted)]">
                    {g.durationMin}–{g.durationMax}분
                  </span>
                </div>
                <div className="flex shrink-0 items-center">
                  <button
                    type="button"
                    onClick={() => move(g.slug, -1)}
                    disabled={i === 0}
                    aria-label="위로"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--fg-muted)] hover:bg-[var(--line)] disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(g.slug, 1)}
                    disabled={i === items.length - 1}
                    aria-label="아래로"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--fg-muted)] hover:bg-[var(--line)] disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(g.slug)}
                    aria-label="세션에서 빼기"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--fg-muted)] hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/15"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* 릴레이 추천 — 재료·기능 비슷한 게임 더 담기 */}
          {recommendations.length > 0 && (
            <div className="border-t border-[var(--line)] px-4 py-3">
              <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-muted)]">
                <Sparkles className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden />
                비슷한 게임 더 담기 (릴레이 후보)
              </p>
              <ul className="space-y-1">
                {recommendations.map((g) => (
                  <RecommendRow key={g.slug} game={g} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RecommendRow({ game }: { game: GameLite }) {
  const { add } = useSession();
  return (
    <li className="flex items-center gap-2">
      <Link
        href={`/games/${game.slug}`}
        className="min-w-0 flex-1 truncate text-sm hover:text-brand-600 dark:hover:text-brand-400"
      >
        {game.name}
        <span className="ml-2 text-[11px] text-[var(--fg-muted)]">
          {game.durationMin}–{game.durationMax}분
        </span>
      </Link>
      <button
        type="button"
        onClick={() => add(game.slug)}
        aria-label={`${game.name} 세션에 담기`}
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-[var(--fg-muted)] hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </li>
  );
}
