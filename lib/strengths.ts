import type { GameTraits, TraitKey } from "./types";

// 각 특성별 강점 임계값과 표시 라벨.
// 난이도는 5일 때만 강점(고난도), 나머지는 4 이상에서 강점.
const STRENGTH_CONFIG: Record<
  TraitKey,
  { label: string; threshold: number }
> = {
  fun: { label: "재미", threshold: 4 },
  novelty: { label: "독창성", threshold: 4 },
  engagement: { label: "참여", threshold: 4 },
  difficulty: { label: "난도", threshold: 5 },
  cognitiveLoad: { label: "인지부하", threshold: 4 },
  functionalLevel: { label: "기능", threshold: 4 },
};

export function getStrengths(traits: GameTraits, max = 2): TraitKey[] {
  const candidates: { key: TraitKey; score: number }[] = [];
  for (const [k, cfg] of Object.entries(STRENGTH_CONFIG) as [
    TraitKey,
    { label: string; threshold: number },
  ][]) {
    if (traits[k] >= cfg.threshold) {
      candidates.push({ key: k, score: traits[k] });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, max).map((c) => c.key);
}

export function getStrengthLabel(key: TraitKey): string {
  return STRENGTH_CONFIG[key].label;
}
