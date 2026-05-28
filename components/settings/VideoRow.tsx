"use client";

import { useState } from "react";
import { Video, ExternalLink, Check, X, RotateCcw } from "lucide-react";
import type { Game } from "@/lib/types";
import { isValidVideoUrl } from "@/lib/video-overrides";
import { cn } from "@/lib/cn";

function detectPlatform(url?: string): "youtube" | "instagram" | "none" {
  if (!url) return "none";
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/instagram\.com|instagr\.am/i.test(url)) return "instagram";
  return "none";
}

function shortenUrl(url: string): string {
  if (url.length <= 50) return url;
  return url.slice(0, 30) + "…" + url.slice(-15);
}

function PlatformBadge({
  platform,
}: {
  platform: "youtube" | "instagram" | "none";
}) {
  if (platform === "none")
    return <Video className="h-3 w-3 shrink-0 opacity-50" aria-hidden />;
  const color =
    platform === "instagram"
      ? "text-rose-500"
      : "text-red-600 dark:text-red-400";
  return <Video className={cn("h-3 w-3 shrink-0", color)} aria-hidden />;
}

export interface VideoRowProps {
  game: Game;
  override?: string;
  onSave: (url: string) => void;
  onReset: () => void;
  compact?: boolean; // TraitEditor 내부 임베드용 — 게임명 표시 생략
}

export function VideoRow({
  game,
  override,
  onSave,
  onReset,
  compact = false,
}: VideoRowProps) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(override ?? game.videoUrl ?? "");
  const [error, setError] = useState<string | null>(null);

  const effectiveUrl = override?.trim() ? override : game.videoUrl;
  const platform = detectPlatform(effectiveUrl);
  const hasOverride = Boolean(override?.trim());

  function startEdit() {
    setInput(override ?? game.videoUrl ?? "");
    setError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setError(null);
  }

  function save() {
    if (!isValidVideoUrl(input)) {
      setError("Instagram·YouTube URL만 허용 (빈 값은 원본 복원)");
      return;
    }
    const trimmed = input.trim();
    if (trimmed === (game.videoUrl ?? "")) {
      onReset();
    } else {
      onSave(trimmed);
    }
    setEditing(false);
    setError(null);
  }

  return (
    <div
      className={cn(
        "rounded-[var(--radius-card-inner)] border border-[var(--line)] bg-[var(--bg)] p-3",
        compact && "border-0 bg-transparent p-0",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {!compact && (
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-bold">{game.name}</h3>
              {hasOverride && (
                <span className="shrink-0 rounded-full bg-warm-300/30 px-1.5 py-0.5 text-[9px] font-bold text-warm-700 dark:bg-warm-500/15 dark:text-warm-300">
                  수정됨
                </span>
              )}
            </div>
          )}
          {compact && hasOverride && (
            <span className="mb-1 inline-block rounded-full bg-warm-300/30 px-1.5 py-0.5 text-[9px] font-bold text-warm-700 dark:bg-warm-500/15 dark:text-warm-300">
              영상 수정됨
            </span>
          )}
          {!editing && (
            <p
              className={cn(
                "flex items-center gap-1 text-[11px] text-[var(--fg-muted)]",
                !compact && "mt-0.5",
              )}
            >
              <PlatformBadge platform={platform} />
              <span className="truncate font-mono">
                {effectiveUrl ? shortenUrl(effectiveUrl) : "영상 없음"}
              </span>
            </p>
          )}
        </div>

        {!editing && (
          <div className="flex shrink-0 gap-1">
            {effectiveUrl && (
              <a
                href={effectiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="새 탭에서 열기"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] text-[var(--fg-muted)] hover:bg-[var(--line)]"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <button
              type="button"
              onClick={startEdit}
              className="inline-flex h-7 items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-2.5 text-[11px] font-medium hover:bg-[var(--line)]"
            >
              수정
            </button>
          </div>
        )}
      </div>

      {editing && (
        <div className="mt-2 space-y-2">
          <input
            type="url"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder="https://www.instagram.com/sc_sportsacademy_/reel/..."
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 font-mono text-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
            autoFocus
          />
          {error && (
            <p className="text-[11px] text-rose-600 dark:text-rose-300">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={save}
              className="inline-flex h-7 items-center gap-1 rounded-full bg-brand-500 px-3 text-[11px] font-medium text-white hover:bg-brand-600"
            >
              <Check className="h-3 w-3" />
              저장
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex h-7 items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-3 text-[11px] font-medium hover:bg-[var(--line)]"
            >
              <X className="h-3 w-3" />
              취소
            </button>
            {hasOverride && (
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setEditing(false);
                  setError(null);
                }}
                className="inline-flex h-7 items-center gap-1 rounded-full border border-[var(--line)] px-3 text-[11px] font-medium text-[var(--fg-muted)] hover:bg-[var(--line)] hover:text-[var(--fg)]"
              >
                <RotateCcw className="h-3 w-3" />
                원본 복원
              </button>
            )}
          </div>
          {game.videoUrl && (
            <p className="text-[10px] leading-relaxed text-[var(--fg-muted)]">
              <span className="font-bold">원본:</span>{" "}
              <span className="font-mono">{shortenUrl(game.videoUrl)}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
