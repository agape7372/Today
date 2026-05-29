import Link from "next/link";
import { Users, Clock, Sparkles } from "lucide-react";
import type { Game, TraitKey } from "@/lib/types";
import { TRAIT_LABELS } from "@/lib/constants";
import { StrengthBadges } from "./StrengthBadges";
import { FavoriteButton } from "./FavoriteButton";

export interface GameCardProps {
  game: Game;
  highlightTrait?: TraitKey;
}

export function GameCard({ game, highlightTrait }: GameCardProps) {
  return (
    <div className="group relative">
      <Link
        href={`/games/${game.slug}`}
        className="block h-full rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lifted focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
      >
        {/* 제목 — 가장 큰 시각 요소 (위계 1순위) */}
        <h3 className="pr-10 text-xl font-bold tracking-tight leading-tight">
          {game.name}
        </h3>

        {/* 강점 태그 — 위계 2순위 (제목 바로 아래, 색감으로 부각) */}
        <StrengthBadges
          traits={game.traits}
          max={2}
          size="sm"
          className="mt-2.5"
        />

        {/* 요약 — 위계 3순위 (작고 흐림, 스캔 시 건너뛸 수 있음) */}
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[var(--fg-muted)]">
          {game.summary}
        </p>

        {/* 메타 — 위계 4순위 (가장 작고 회색) */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--fg-muted)]">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" aria-hidden />
            {game.participants.min}-{game.participants.max}명
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {game.durationMin}-{game.durationMax}분
          </span>
          {highlightTrait && (
            <span className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400">
              <Sparkles className="h-3 w-3" aria-hidden />
              {TRAIT_LABELS[highlightTrait]} {game.traits[highlightTrait]}/5
            </span>
          )}
        </div>
      </Link>

      {/* 즐겨찾기 — 카드 우상단 절대 배치 (Link 외부, 별도 클릭 영역) */}
      <FavoriteButton
        slug={game.slug}
        size="sm"
        className="absolute right-3 top-3"
      />
    </div>
  );
}
