"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  return (
    <label
      className={cn(
        "flex h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-4 shadow-soft focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30 transition-colors",
        className,
      )}
    >
      <Search className="h-4 w-4 text-[var(--fg-muted)]" />
      <input
        type="text"
        placeholder="게임 이름·요약으로 검색"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--fg-muted)]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg)]"
          aria-label="검색 지우기"
        >
          ×
        </button>
      )}
    </label>
  );
}
