import { getAllGames } from "./games";
import { getAggregatedReferences } from "./references";
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

  // 정규화(저자+연도) 기준 고유 논문 수 — /references 페이지와 동일 집계
  const citationCount = getAggregatedReferences().length;

  return {
    gameCount: games.length,
    citationCount,
    targetGroupCount: Object.keys(TARGET_LABELS).length,
    traitCount: TRAIT_KEYS.length,
  };
}
