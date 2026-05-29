"use client";

import { useMemo, useState } from "react";
import { Search, RotateCcw, Video } from "lucide-react";
import type { Game, TraitKey } from "@/lib/types";
import { TRAIT_KEYS, TRAIT_LABELS } from "@/lib/constants";
import { useTraitOverrides } from "@/lib/trait-overrides";
import { useVideoOverrides } from "@/lib/video-overrides";
import { TraitSlider } from "./TraitSlider";
import { VideoRow } from "./VideoRow";
import { cn } from "@/lib/cn";

export interface TraitEditorProps {
  games: Game[];
}

export function TraitEditor({ games }: TraitEditorProps) {
  const { overrides, setTrait, resetTrait, resetGame, countOverrides } =
    useTraitOverrides();
  const {
    overrides: videoOverrides,
    set: setVideo,
    reset: resetVideo,
    count: videoCount,
  } = useVideoOverrides();
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    games[0]?.slug ?? null,
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return games;
    return games.filter((g) =>
      `${g.name} ${g.nameEn ?? ""}`.toLowerCase().includes(q),
    );
  }, [games, search]);

  const selected = games.find((g) => g.slug === selectedSlug) ?? games[0];
  const traitOverride = selected ? overrides[selected.slug] : undefined;
  const hasTraitOverride =
    traitOverride && Object.keys(traitOverride).length > 0;
  const videoOverride = selected ? videoOverrides[selected.slug] : undefined;

  if (!selected) return null;

  const currentTrait = (k: TraitKey) =>
    traitOverride?.[k] ?? selected.traits[k];

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-5 shadow-soft sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Override
          </p>
          <h2 className="mt-0.5 text-lg font-bold">게임 특성·영상 조절</h2>
          <p className="mt-1 text-xs text-[var(--fg-muted)]">
            게임 선택 후 특성 점수와 첨부 영상 링크를 함께 조정. 카탈로그·상세
            페이지에 즉시 반영.
          </p>
        </div>
        <div className="shrink-0">
          {(countOverrides > 0 || videoCount > 0) && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warm-300/20 px-2.5 py-1 text-[10px] font-bold text-warm-700 dark:bg-warm-500/15 dark:text-warm-300">
              <span className="h-1.5 w-1.5 rounded-full bg-warm-500" />
              특성 {countOverrides} · 영상 {videoCount} 수정
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
        {/* 게임 리스트 */}
        <div className="min-w-0">
          <label className="mb-1.5 flex h-9 items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 focus-within:border-brand-500">
            <Search className="h-3.5 w-3.5 text-[var(--fg-muted)]" />
            <input
              type="text"
              placeholder="게임 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-[var(--fg-muted)]"
            />
          </label>
          <div className="max-h-64 overflow-y-auto rounded-lg border border-[var(--line)] sm:max-h-96">
            <ul>
              {filtered.map((g) => {
                const trait = overrides[g.slug];
                const video = videoOverrides[g.slug];
                const traitCount = trait ? Object.keys(trait).length : 0;
                const hasVideo = Boolean(video);
                return (
                  <li key={g.slug}>
                    <button
                      type="button"
                      onClick={() => setSelectedSlug(g.slug)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 border-b border-[var(--line)] px-3 py-2 text-left text-xs transition-colors last:border-0",
                        selectedSlug === g.slug
                          ? "bg-brand-100 font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                          : "hover:bg-[var(--line)]/50",
                      )}
                    >
                      <span className="min-w-0 truncate">{g.name}</span>
                      <span className="flex shrink-0 items-center gap-0.5">
                        {traitCount > 0 && (
                          <span className="rounded-full bg-warm-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                            {traitCount}
                          </span>
                        )}
                        {hasVideo && (
                          <span
                            className="rounded-full bg-warm-500 px-1 py-0.5 text-[9px] font-bold text-white"
                            title="영상 수정됨"
                          >
                            <Video className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* 우측: 슬라이더 + 영상 */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="min-w-0 truncate text-base font-bold tracking-tight">
              {selected.name}
            </h3>
            {hasTraitOverride && (
              <button
                type="button"
                onClick={() => resetGame(selected.slug)}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-2.5 py-1 text-[11px] text-[var(--fg-muted)] hover:bg-[var(--line)] hover:text-[var(--fg)]"
              >
                <RotateCcw className="h-3 w-3" />
                특성 원본 복원
              </button>
            )}
          </div>

          <div className="space-y-3">
            {TRAIT_KEYS.map((k) => (
              <TraitSlider
                key={k}
                label={TRAIT_LABELS[k]}
                value={currentTrait(k)}
                original={selected.traits[k]}
                onChange={(v) => setTrait(selected.slug, k, v)}
                onReset={() => resetTrait(selected.slug, k)}
              />
            ))}
          </div>

          {/* 영상 링크 — 슬라이더 바로 아래 */}
          <div className="mt-5 border-t border-[var(--line)] pt-4">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)]">
              <Video className="h-3 w-3" />
              첨부 영상 링크
            </div>
            <VideoRow
              game={selected}
              override={videoOverride}
              onSave={(url) => setVideo(selected.slug, url)}
              onReset={() => resetVideo(selected.slug)}
              compact
            />
          </div>
        </div>
      </div>
    </section>
  );
}
