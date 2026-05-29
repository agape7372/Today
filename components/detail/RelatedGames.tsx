import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Game } from "@/lib/types";
import { MOTOR_LABELS } from "@/lib/constants";

export interface RelatedGamesProps {
  games: Game[];
}

// 상세 페이지 하단 '관련 게임' — 막다른 페이지를 다음 행동으로 잇는 빌드타임 추천.
// 환자타입·운동기능·준비물이 비슷한 게임을 보여줘 세션 조립(릴레이 후보 탐색)을 돕는다.
export function RelatedGames({ games }: RelatedGamesProps) {
  if (games.length === 0) return null;

  return (
    <section className="no-print">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          Related Games
        </p>
        <span className="text-xs text-[var(--fg-muted)]">
          환자·운동·준비물이 비슷한 게임
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {games.map((g) => (
          <Link
            key={g.slug}
            href={`/games/${g.slug}`}
            className="group rounded-[var(--radius-card-inner)] border border-[var(--line)] bg-[var(--bg-elevated)] p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lifted"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold leading-snug">{g.name}</p>
              <ArrowRight
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--fg-muted)] transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400"
                aria-hidden
              />
            </div>
            <p className="mt-1 line-clamp-1 text-xs text-[var(--fg-muted)]">
              {g.summary}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
              {g.motorType.slice(0, 3).map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                >
                  {MOTOR_LABELS[m]}
                </span>
              ))}
              <span className="ml-auto text-[var(--fg-muted)]">
                {g.durationMin}–{g.durationMax}분
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
