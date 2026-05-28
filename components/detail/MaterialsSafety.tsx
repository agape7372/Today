import { Package, AlertTriangle, ShieldAlert } from "lucide-react";
import type { Game } from "@/lib/types";

export function MaterialsSafety({ game }: { game: Game }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-[var(--radius-card-inner)] border border-[var(--line)] bg-[var(--bg-elevated)] p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--fg-muted)]">
            준비물
          </h3>
        </div>
        <ul className="mt-3 space-y-1.5 text-sm">
          {game.materials.map((m, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[var(--radius-card-inner)] border border-[var(--line)] bg-[var(--bg-elevated)] p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warm-600 dark:text-warm-500" />
          <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--fg-muted)]">
            안전 주의
          </h3>
        </div>
        <ul className="mt-3 space-y-1.5 text-sm">
          {game.safetyNotes.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warm-500" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
        {game.contraindications && game.contraindications.length > 0 && (
          <div className="mt-4 rounded-lg bg-rose-50 p-3 dark:bg-rose-500/10">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-600 dark:text-rose-300" />
              <p className="text-xs font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300">
                금기사항
              </p>
            </div>
            <ul className="mt-1.5 space-y-1 text-xs text-rose-700 dark:text-rose-200">
              {game.contraindications.map((c, i) => (
                <li key={i}>• {c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
