"use client";

import { X, Star } from "lucide-react";
import { TRAIT_LABELS } from "@/lib/constants";
import type { FilterState } from "@/lib/filters";
import { EMPTY_FILTERS, countActive } from "@/lib/filters";

export interface ActiveFiltersProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}

export function ActiveFilters({ filters, onChange }: ActiveFiltersProps) {
  const active = countActive(filters);
  if (active === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.search.trim() && (
        <Chip onRemove={() => onChange({ ...filters, search: "" })}>
          검색: {filters.search}
        </Chip>
      )}
      {filters.sortBy && (
        <Chip onRemove={() => onChange({ ...filters, sortBy: undefined })}>
          {TRAIT_LABELS[filters.sortBy]} 높은 순
        </Chip>
      )}
      {filters.favOnly && (
        <Chip onRemove={() => onChange({ ...filters, favOnly: false })}>
          <Star className="h-3 w-3 fill-current" /> 즐겨찾기만
        </Chip>
      )}
      {filters.nameSort && (
        <Chip onRemove={() => onChange({ ...filters, nameSort: undefined })}>
          이름순 {filters.nameSort === "asc" ? "↑" : "↓"}
        </Chip>
      )}

      {active > 1 && (
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="ml-1 text-xs text-[var(--fg-muted)] underline-offset-4 hover:underline"
        >
          모두 지우기
        </button>
      )}
    </div>
  );
}

function Chip({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
      {children}
      <button
        type="button"
        onClick={onRemove}
        aria-label="필터 제거"
        className="ml-0.5 rounded-full hover:bg-brand-200/60 dark:hover:bg-brand-500/30"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
