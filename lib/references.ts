import { getAllGames } from "./games";

export interface AggregatedReference {
  citation: string;
  doi?: string;
  url?: string;
  /** 이 문헌을 인용하는 게임들 */
  games: { slug: string; name: string }[];
  /** 게임별 relevance 한 줄 설명 (중복 제거) */
  relevances: string[];
}

// 같은 논문이 "et al." / 전체 저자명 등 다른 문자열로 인용돼도 합치기 위한
// 정규화 키: 첫 저자 성 + 발행연도. 매칭 실패 시 전체 문자열로 폴백.
function normalizeKey(citation: string): string {
  const yearMatch = citation.match(/\((\d{4})\)/);
  const surname = citation.split(",")[0].split("(")[0].trim().toLowerCase();
  if (yearMatch && surname) return `${surname}-${yearMatch[1]}`;
  return citation.trim().toLowerCase();
}

// 모든 게임의 references를 논문 기준으로 합쳐 중복 제거.
// /references 페이지·통계의 단일 진실의 원천. 게임 추가 시 자동 반영.
export function getAggregatedReferences(): AggregatedReference[] {
  const map = new Map<string, AggregatedReference>();

  for (const g of getAllGames()) {
    for (const ref of g.references) {
      const key = normalizeKey(ref.citation);
      let agg = map.get(key);
      if (!agg) {
        agg = {
          citation: ref.citation.trim(),
          doi: ref.doi,
          url: ref.url,
          games: [],
          relevances: [],
        };
        map.set(key, agg);
      }
      // 더 완전한(긴) citation 문자열을 대표로 유지
      if (ref.citation.trim().length > agg.citation.length) {
        agg.citation = ref.citation.trim();
      }
      if (!agg.games.some((x) => x.slug === g.slug)) {
        agg.games.push({ slug: g.slug, name: g.name });
      }
      if (ref.relevance && !agg.relevances.includes(ref.relevance)) {
        agg.relevances.push(ref.relevance);
      }
      if (!agg.doi && ref.doi) agg.doi = ref.doi;
      if (!agg.url && ref.url) agg.url = ref.url;
    }
  }

  // 많이 인용된 문헌 우선
  return Array.from(map.values()).sort(
    (a, b) => b.games.length - a.games.length || a.citation.localeCompare(b.citation),
  );
}

export interface ReferenceStats {
  uniqueCount: number;
  totalCitations: number;
  withDoiOrUrl: number;
}

export function getReferenceStats(): ReferenceStats {
  const aggregated = getAggregatedReferences();
  let total = 0;
  let withLink = 0;
  for (const r of aggregated) {
    total += r.games.length;
    if (r.doi || r.url) withLink += 1;
  }
  return {
    uniqueCount: aggregated.length,
    totalCitations: total,
    withDoiOrUrl: withLink,
  };
}
