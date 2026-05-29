import type { GameLite } from "./types";

// 세션에 담긴 게임들과 "재료·요구 기능이 비슷한" 게임을 추천 — 릴레이 바스켓의 핵심.
// lib/games.ts getRelatedGames와 같은 점수식이되, 서버 fs 없이 GameLite[]만으로 동작(클라이언트).
const STOPWORDS = new Set([
  "의자",
  "매트",
  "바닥",
  "공간",
  "테이프",
  "보조자",
  "선택",
  "사람",
  "미끄럼",
  "방지",
  "점수",
  "표시",
  "준비",
  "또는",
  "이상",
  "여러",
  "다양",
]);

function tokens(materials: string[]): Set<string> {
  const set = new Set<string>();
  for (const m of materials) {
    for (const t of m.toLowerCase().match(/[가-힣a-z0-9]{2,}/g) ?? []) {
      if (!STOPWORDS.has(t)) set.add(t);
    }
  }
  return set;
}

export function recommendForSession(
  sessionSlugs: string[],
  all: GameLite[],
  limit = 3,
): GameLite[] {
  if (sessionSlugs.length === 0) return [];
  const inSession = new Set(sessionSlugs);
  const sessionGames = all.filter((g) => inSession.has(g.slug));

  const targets = new Set<string>();
  const motor = new Set<string>();
  const mats = new Set<string>();
  for (const g of sessionGames) {
    g.targetGroups.forEach((t) => targets.add(t));
    g.motorType.forEach((m) => motor.add(m));
    for (const tok of tokens(g.materials)) mats.add(tok);
  }

  return all
    .filter((g) => !inSession.has(g.slug))
    .map((g) => {
      const st = g.targetGroups.filter((t) => targets.has(t)).length;
      const sm = g.motorType.filter((m) => motor.has(m)).length;
      let smat = 0;
      for (const tok of tokens(g.materials)) if (mats.has(tok)) smat += 1;
      return { g, score: st * 3 + sm * 3 + smat * 2 };
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.g.name.localeCompare(b.g.name, "ko"),
    )
    .slice(0, limit)
    .map((x) => x.g);
}
