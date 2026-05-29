"use client";

import { Search, UserRound } from "lucide-react";
import type { ItemStatus } from "@/lib/meeting";
import { cn } from "@/lib/cn";

type StatusFilter = "all" | ItemStatus;

interface Props {
  author: string;
  onAuthorChange: (name: string) => void;
  search: string;
  onSearchChange: (q: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (s: StatusFilter) => void;
}

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "open", label: "열림" },
  { id: "active", label: "논의중" },
  { id: "done", label: "완료" },
];

export function MeetingToolbar({
  author,
  onAuthorChange,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: Props) {
  return (
    <div className="no-print rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-4 shadow-soft sm:p-5">
      {/* 1행: 이름 + 검색 */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <label className="relative flex items-center sm:w-56">
          <UserRound className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--fg-muted)]" aria-hidden />
          <input
            value={author}
            onChange={(e) => onAuthorChange(e.target.value)}
            placeholder="내 이름 (코멘트·공감에 표시)"
            className="w-full rounded-full border border-[var(--line)] bg-[var(--bg)] py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
        </label>
        <label className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--fg-muted)]" aria-hidden />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="안건·코멘트 검색"
            className="w-full rounded-full border border-[var(--line)] bg-[var(--bg)] py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
        </label>
      </div>

      {/* 2행: 상태 필터 */}
      <div className="mt-3 flex items-center gap-0.5 self-start rounded-full bg-[var(--bg)] p-0.5">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onStatusFilterChange(s.id)}
            aria-pressed={statusFilter === s.id}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              statusFilter === s.id
                ? "bg-brand-500 text-white"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
