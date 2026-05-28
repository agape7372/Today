import type { Game, TraitKey } from "./types";
import { TRAIT_KEYS } from "./constants";

export interface FilterState {
  search: string;
  sortBy?: TraitKey;
  favOnly?: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  search: "",
};

export function applyFilters(
  games: Game[],
  f: FilterState,
  favorites?: Set<string>,
): Game[] {
  let result = games;

  if (f.favOnly && favorites) {
    result = result.filter((g) => favorites.has(g.slug));
  }

  if (f.search.trim()) {
    const q = f.search.trim().toLowerCase();
    result = result.filter((g) => {
      const haystack = `${g.name} ${g.nameEn ?? ""} ${g.summary}`.toLowerCase();
      return haystack.includes(q);
    });
  }

  if (f.sortBy) {
    const key = f.sortBy;
    result = [...result].sort((a, b) => b.traits[key] - a.traits[key]);
  }

  return result;
}

export function countActive(f: FilterState): number {
  let n = 0;
  if (f.search.trim()) n++;
  if (f.sortBy) n++;
  if (f.favOnly) n++;
  return n;
}

export function toQuery(f: FilterState): string {
  const p = new URLSearchParams();
  if (f.search.trim()) p.set("q", f.search.trim());
  if (f.sortBy) p.set("sort", f.sortBy);
  if (f.favOnly) p.set("fav", "1");
  return p.toString();
}

export function fromQuery(qs: URLSearchParams): FilterState {
  const sortRaw = qs.get("sort");
  const sortBy = sortRaw && (TRAIT_KEYS as readonly string[]).includes(sortRaw)
    ? (sortRaw as TraitKey)
    : undefined;
  return {
    search: qs.get("q") ?? "",
    sortBy,
    favOnly: qs.get("fav") === "1",
  };
}
