"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export interface TraitSliderProps {
  label: string;
  value: number;
  original: number;
  onChange: (v: number) => void;
  onReset?: () => void;
}

export function TraitSlider({
  label,
  value,
  original,
  onChange,
  onReset,
}: TraitSliderProps) {
  const changed = value !== original;
  const dec = () => onChange(Math.max(1, value - 1));
  const inc = () => onChange(Math.min(5, value + 1));
  const pct = (value / 5) * 100;

  return (
    <div>
      {/* 라벨 + 점수 */}
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {label}
          {changed && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-warm-500"
              aria-label="수정됨"
            />
          )}
        </span>
        <span
          className={cn(
            "font-mono text-base font-bold tabular-nums",
            changed
              ? "text-warm-600 dark:text-warm-300"
              : "text-brand-600 dark:text-brand-400",
          )}
        >
          {value}
        </span>
      </div>

      {/* 컨트롤 라인 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={dec}
          disabled={value <= 1}
          aria-label={`${label} 감소`}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg)] text-[var(--fg-muted)] transition-colors hover:bg-[var(--line)] hover:text-[var(--fg)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Minus className="h-2.5 w-2.5" />
        </button>

        {/* 한 줄 트랙 + 투명 5등분 클릭 영역 */}
        <div className="relative flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-[var(--line)]">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-150",
                changed ? "bg-warm-500" : "bg-brand-500",
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* 5등분 투명 클릭 영역 */}
          <div className="absolute inset-0 flex">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                aria-label={`${label} ${n}점으로 설정`}
                aria-pressed={value === n}
                className="flex-1 cursor-pointer rounded-full"
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={inc}
          disabled={value >= 5}
          aria-label={`${label} 증가`}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg)] text-[var(--fg-muted)] transition-colors hover:bg-[var(--line)] hover:text-[var(--fg)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus className="h-2.5 w-2.5" />
        </button>
      </div>

      {/* 변경 메타 — 작게 아래 */}
      {changed && (
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[var(--fg-muted)]">
          <span>원본 {original}</span>
          {onReset && (
            <>
              <span className="opacity-50">·</span>
              <button
                type="button"
                onClick={onReset}
                className="underline-offset-2 hover:text-[var(--fg)] hover:underline"
              >
                되돌리기
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
