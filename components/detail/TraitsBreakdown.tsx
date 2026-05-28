import type { Game } from "@/lib/types";
import { TRAIT_LABELS, TRAIT_KEYS } from "@/lib/constants";
import { StrengthBadges } from "@/components/catalog/StrengthBadges";

export function TraitsBreakdown({ game }: { game: Game }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-6 shadow-soft">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
        Strengths
      </p>
      <h2 className="mt-1 text-xl font-bold">이 게임이 특히 강한 부분</h2>

      <StrengthBadges
        traits={game.traits}
        max={3}
        size="md"
        className="mt-4"
      />

      <ul className="mt-6 space-y-2.5">
        {TRAIT_KEYS.map((k) => (
          <li key={k} className="flex items-center gap-3 text-sm">
            <span className="w-20 text-[var(--fg-muted)]">
              {TRAIT_LABELS[k]}
            </span>
            <div className="flex flex-1 items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={
                    n <= game.traits[k]
                      ? "h-1.5 flex-1 rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                      : "h-1.5 flex-1 rounded-full bg-[var(--line)]"
                  }
                />
              ))}
            </div>
            <span className="w-6 text-right text-xs font-medium text-[var(--fg-muted)]">
              {game.traits[k]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
