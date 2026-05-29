export type FunctionalDomain = "cognitive" | "physical" | "social" | "emotional";
export type MotorType = "gross" | "fine" | "balance" | "endurance" | "rom";
export type Position = "sitting" | "standing" | "wheelchair" | "mixed";
export type GroupStructure = "individual" | "pairs" | "small" | "large";
export type Interaction = "competitive" | "cooperative" | "mixed";
export type TargetGroup =
  | "stroke"
  | "sci"
  | "parkinson"
  | "disuse"
  | "elderly"
  | "general";

export interface GameTraits {
  fun: number; // 1-5, IMI subscale 참고
  novelty: number; // 1-5
  engagement: number; // 1-5, Witmer-Singer / Flow
  difficulty: number; // 1-5, Just-right challenge
  cognitiveLoad: number; // 1-5, Sweller
  functionalLevel: number; // 1-5, ADL relevance
}

export interface Reference {
  citation: string;
  doi?: string;
  url?: string;
  relevance: string;
}

export interface Game {
  slug: string;
  name: string;
  nameEn?: string;
  summary: string;
  domains: FunctionalDomain[];
  motorType: MotorType[];
  position: Position[];
  groupStructure: GroupStructure;
  interaction: Interaction;
  targetGroups: TargetGroup[];
  participants: { min: number; max: number };
  durationMin: number;
  durationMax: number;
  traits: GameTraits;
  materials: string[];
  videoUrl?: string;
  videoSearchQuery?: string;
  safetyNotes: string[];
  contraindications?: string[];
  references: Reference[];
  body: string; // MDX 본문 (frontmatter 제외)
}

export type TraitKey = keyof GameTraits;

// 클라이언트(세션 트레이)에 넘기는 경량 게임 투영 — 본문·인용 등 무거운 필드 제외.
export interface GameLite {
  slug: string;
  name: string;
  durationMin: number;
  durationMax: number;
  participants: { min: number; max: number };
  motorType: MotorType[];
  targetGroups: TargetGroup[];
  materials: string[];
}
