"use client";

import { cn } from "@/lib/cn";

export type NameSortDir = "asc" | "desc" | undefined;

export interface NameSortToggleProps {
  value: NameSortDir;
  onChange: (next: NameSortDir) => void;
  className?: string;
  label?: string;
}

/**
 * 글자순 정렬 토글 — 3단계 사이클:
 * 미정렬 → 오름차(↑) → 내림차(↓) → 미정렬
 *
 * 카탈로그·인벤토리에서 공통으로 사용.
 */
export function NameSortToggle({
  value,
  onChange,
  className,
  label = "이름순",
}: NameSortToggleProps) {
  const cycle = () => {
    if (value === "asc") onChange("desc");
    else if (value === "desc") onChange(undefined);
    else onChange("asc");
  };

  const symbol = value === "asc" ? "↑" : value === "desc" ? "↓" : "↕";
  const ariaLabel =
    value === "asc"
      ? `${label} 오름차순 (다음: 내림차순)`
      : value === "desc"
        ? `${label} 내림차순 (다음: 해제)`
        : `${label} 정렬 (다음: 오름차순)`;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={ariaLabel}
      aria-pressed={Boolean(value)}
      title={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all",
        value
          ? "bg-brand-500 text-white shadow-soft"
          : "border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--fg-muted)] hover:bg-[var(--line)] hover:text-[var(--fg)]",
        className,
      )}
    >
      <span>{label}</span>
      <span className="font-mono leading-none" aria-hidden>
        {symbol}
      </span>
    </button>
  );
}
