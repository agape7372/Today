import { getAllGames } from "./games";
import { TARGET_LABELS, TRAIT_KEYS } from "./constants";

export interface SiteStats {
  gameCount: number;
  citationCount: number;
  targetGroupCount: number;
  traitCount: number;
}

// 모든 페이지에서 공유하는 단일 진실의 원천. 게임 추가/제거 시 자동 갱신.
export function getSiteStats(): SiteStats {
  const games = getAllGames();

  // unique citation 카운트 — 같은 논문을 여러 게임에서 인용해도 1로 계산
  const uniqueCitations = new Set<string>();
  for (const g of games) {
    for (const ref of g.references) {
      uniqueCitations.add(ref.citation);
    }
  }

  return {
    gameCount: games.length,
    citationCount: uniqueCitations.size,
    targetGroupCount: Object.keys(TARGET_LABELS).length,
    traitCount: TRAIT_KEYS.length,
  };
}
