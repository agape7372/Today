import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Game } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "games");

// Module-level memoization — same-process reads stay cheap during SSG build.
let cache: Game[] | null = null;

export function getAllGames(): Game[] {
  if (cache) return cache;
  if (!fs.existsSync(CONTENT_DIR)) {
    cache = [];
    return cache;
  }
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  const games: Game[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      ...(data as Omit<Game, "body">),
      body: content.trim(),
    } satisfies Game;
  });

  cache = games;
  return cache;
}

export function getGameBySlug(slug: string): Game | undefined {
  return getAllGames().find((g) => g.slug === slug);
}

export function getAllSlugs(): string[] {
  return getAllGames().map((g) => g.slug);
}

// 준비물 문자열 → 의미 토큰 Set (재료 유사도 비교용).
// 거의 모든 게임에 공통으로 등장하는 일반어는 노이즈라 제외.
const MATERIAL_STOPWORDS = new Set([
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

function materialTokens(materials: string[]): Set<string> {
  const set = new Set<string>();
  for (const m of materials) {
    const tokens = m.toLowerCase().match(/[가-힣a-z0-9]{2,}/g) ?? [];
    for (const t of tokens) {
      if (!MATERIAL_STOPWORDS.has(t)) set.add(t);
    }
  }
  return set;
}

// 빌드타임 '관련 게임' 추천 — 환자타입·치료영역·운동기능·준비물 겹침으로 점수화.
// SSG에서 정적 계산되므로 런타임 비용 0.
export function getRelatedGames(game: Game, limit = 4): Game[] {
  const myTargets = new Set(game.targetGroups);
  const myDomains = new Set(game.domains);
  const myMotor = new Set(game.motorType);
  const myMat = materialTokens(game.materials);

  const scored = getAllGames()
    .filter((g) => g.slug !== game.slug)
    .map((g) => {
      const sharedTargets = g.targetGroups.filter((t) =>
        myTargets.has(t),
      ).length;
      const sharedMotor = g.motorType.filter((m) => myMotor.has(m)).length;
      const sharedDomains = g.domains.filter((d) => myDomains.has(d)).length;
      let sharedMaterials = 0;
      for (const t of materialTokens(g.materials)) {
        if (myMat.has(t)) sharedMaterials += 1;
      }
      // 환자군·운동기능 일치를 가장 크게, 재료 유사도를 그다음으로 가중
      const score =
        sharedTargets * 3 +
        sharedMotor * 3 +
        sharedMaterials * 2 +
        sharedDomains * 1;
      return { game: g, score, sharedMaterials, sharedMotor };
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || a.game.name.localeCompare(b.game.name, "ko"),
    )
    .slice(0, limit);

  return scored.map((x) => x.game);
}
