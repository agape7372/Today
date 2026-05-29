import type { Game, TraitKey } from "./types";
import {
  TRAIT_KEYS,
  TARGET_LABELS,
  DOMAIN_LABELS,
  MOTOR_LABELS,
} from "./constants";

export type NameSortDir = "asc" | "desc";

export interface FilterState {
  search: string;
  sortBy?: TraitKey;
  favOnly?: boolean;
  nameSort?: NameSortDir;
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
      // 이름·요약뿐 아니라 환자타입·치료영역·운동·준비물 라벨까지 검색 대상에 포함
      // → "뇌졸중" "파킨슨" "소근육" "풍선" "집게" 같은 임상 키워드로도 적중
      const haystack = [
        g.name,
        g.nameEn ?? "",
        g.summary,
        ...g.targetGroups.map((t) => TARGET_LABELS[t]),
        ...g.domains.map((d) => DOMAIN_LABELS[d]),
        ...g.motorType.map((m) => MOTOR_LABELS[m]),
        ...g.materials,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  // 이름순 정렬이 활성이면 우선 적용 (특성 정렬과 상호 배타)
  if (f.nameSort) {
    const dir = f.nameSort;
    result = [...result].sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, "ko");
      return dir === "asc" ? cmp : -cmp;
    });
  } else if (f.sortBy) {
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
  if (f.nameSort) n++;
  return n;
}

export function toQuery(f: FilterState): string {
  const p = new URLSearchParams();
  if (f.search.trim()) p.set("q", f.search.trim());
  if (f.sortBy) p.set("sort", f.sortBy);
  if (f.favOnly) p.set("fav", "1");
  if (f.nameSort) p.set("name", f.nameSort);
  return p.toString();
}

export function fromQuery(qs: URLSearchParams): FilterState {
  const sortRaw = qs.get("sort");
  const sortBy = sortRaw && (TRAIT_KEYS as readonly string[]).includes(sortRaw)
    ? (sortRaw as TraitKey)
    : undefined;
  const nameRaw = qs.get("name");
  const nameSort =
    nameRaw === "asc" || nameRaw === "desc" ? nameRaw : undefined;
  return {
    search: qs.get("q") ?? "",
    sortBy,
    favOnly: qs.get("fav") === "1",
    nameSort,
  };
}
