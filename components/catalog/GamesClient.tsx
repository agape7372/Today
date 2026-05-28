"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import type { Game } from "@/lib/types";
import {
  applyFilters,
  EMPTY_FILTERS,
  fromQuery,
  toQuery,
  type FilterState,
} from "@/lib/filters";
import { useFavorites } from "@/lib/favorites";
import { useGamesWithOverrides } from "@/lib/trait-overrides";
import { GameCard } from "./GameCard";
import { SortBar } from "./SortBar";
import { SearchBar } from "./SearchBar";
import { ActiveFilters } from "./ActiveFilters";
import { cn } from "@/lib/cn";

export interface GamesClientProps {
  initialGames: Game[];
}

export function GamesClient({ initialGames }: GamesClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const { favs, count: favCount } = useFavorites();

  // Trait override 적용 — 카탈로그·정렬·강점 태그 모두 자동 반영
  const games = useGamesWithOverrides(initialGames);

  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window === "undefined") return EMPTY_FILTERS;
    return fromQuery(params);
  });

  useEffect(() => {
    const qs = toQuery(filters);
    const next = qs ? `?${qs}` : "";
    if (window.location.search !== next) {
      router.replace(`/games${next}`, { scroll: false });
    }
  }, [filters, router]);

  const filtered = useMemo(
    () => applyFilters(games, filters, favs),
    [games, filters, favs],
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          GAME CATALOG
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          오늘의 게임 고르기
        </h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          특성 정렬·즐겨찾기로 오늘의 게임 결정.
        </p>
      </header>

      <div className="mb-4">
        <SearchBar
          value={filters.search}
          onChange={(v) => setFilters({ ...filters, search: v })}
        />
      </div>

      {/* Sticky 정렬 칩 — 헤더 아래(top-14) 고정 */}
      <div className="sticky top-14 z-20 -mx-4 mb-5 border-b border-[var(--line)] bg-[var(--bg)]/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <SortBar
          active={filters.sortBy}
          onChange={(next) => setFilters({ ...filters, sortBy: next })}
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() =>
              setFilters({ ...filters, favOnly: !filters.favOnly })
            }
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
              filters.favOnly
                ? "bg-warm-300/30 text-warm-700 dark:bg-warm-500/20 dark:text-warm-300"
                : "border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
            aria-pressed={filters.favOnly}
          >
            <Star
              className={cn("h-3 w-3", filters.favOnly && "fill-current")}
              aria-hidden
            />
            즐겨찾기{favCount > 0 && ` (${favCount})`}
          </button>
          <p className="text-xs text-[var(--fg-muted)]">
            {filtered.length}개
            {filtered.length === initialGames.length
              ? " (전체)"
              : ` / 전체 ${initialGames.length}개`}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <ActiveFilters filters={filters} onChange={setFilters} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          message={
            filters.favOnly && favCount === 0
              ? "즐겨찾기한 게임이 아직 없음"
              : "조건에 맞는 게임이 없음"
          }
          hint={
            filters.favOnly && favCount === 0
              ? "카드 우상단 별 아이콘으로 추가"
              : "검색어 확인 또는 정렬 해제"
          }
          onReset={() => setFilters(EMPTY_FILTERS)}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((g) => (
            <GameCard
              key={g.slug}
              game={g}
              highlightTrait={filters.sortBy}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({
  message,
  hint,
  onReset,
}: {
  message: string;
  hint: string;
  onReset: () => void;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--line)] p-12 text-center">
      <p className="text-lg font-medium">{message}</p>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">{hint}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-full bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600"
      >
        초기화
      </button>
    </div>
  );
}
