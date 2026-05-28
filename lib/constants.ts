import type {
  FunctionalDomain,
  MotorType,
  Position,
  GroupStructure,
  Interaction,
  TargetGroup,
  TraitKey,
} from "./types";

export const DOMAIN_LABELS: Record<FunctionalDomain, string> = {
  cognitive: "인지",
  physical: "신체",
  social: "사회",
  emotional: "정서",
};

export const MOTOR_LABELS: Record<MotorType, string> = {
  gross: "대근육",
  fine: "소근육",
  balance: "균형",
  endurance: "지구력",
  rom: "관절가동범위",
};

export const POSITION_LABELS: Record<Position, string> = {
  sitting: "앉아서",
  standing: "서서",
  wheelchair: "휠체어",
  mixed: "혼합",
};

export const GROUP_LABELS: Record<GroupStructure, string> = {
  individual: "개인",
  pairs: "짝",
  small: "소집단",
  large: "대집단",
};

export const INTERACTION_LABELS: Record<Interaction, string> = {
  competitive: "경쟁",
  cooperative: "협력",
  mixed: "혼합",
};

export const TARGET_LABELS: Record<TargetGroup, string> = {
  stroke: "뇌졸중",
  sci: "척수손상",
  parkinson: "파킨슨",
  disuse: "비사용증후군",
  elderly: "노인",
  general: "일반",
};

export const TRAIT_LABELS: Record<TraitKey, string> = {
  fun: "재미",
  novelty: "독창성",
  engagement: "참여도",
  difficulty: "난이도",
  cognitiveLoad: "인지부하",
  functionalLevel: "기능수준",
};

// 차트 꼭지점 순서 (12시부터 시계방향)
export const TRAIT_KEYS: readonly TraitKey[] = [
  "fun",
  "novelty",
  "engagement",
  "difficulty",
  "cognitiveLoad",
  "functionalLevel",
] as const;

export const TARGET_TONE_MAP: Record<
  TargetGroup,
  "brand" | "accent" | "warm" | "rose" | "violet" | "amber" | "neutral"
> = {
  stroke: "rose",
  sci: "violet",
  parkinson: "amber",
  disuse: "warm",
  elderly: "brand",
  general: "neutral",
};
