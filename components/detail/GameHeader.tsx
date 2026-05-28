import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Game } from "@/lib/types";
import {
  DOMAIN_LABELS,
  TARGET_LABELS,
  TARGET_TONE_MAP,
} from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export function GameHeader({ game }: { game: Game }) {
  return (
    <header>
      <Link
        href="/games"
        className="inline-flex items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-brand-600 dark:hover:text-brand-400"
      >
        <ChevronLeft className="h-4 w-4" />
        카탈로그로 돌아가기
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        {game.name}
      </h1>
      {game.nameEn && (
        <p className="mt-1 text-sm text-[var(--fg-muted)]">{game.nameEn}</p>
      )}

      <p className="mt-4 text-lg text-[var(--fg)] leading-relaxed">
        {game.summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {game.domains.map((d) => (
          <Badge key={d} tone="brand" className="text-[13px] px-3 py-1">
            {DOMAIN_LABELS[d]}
          </Badge>
        ))}
        {game.targetGroups.map((t) => (
          <Badge
            key={t}
            tone={TARGET_TONE_MAP[t]}
            className="text-[13px] px-3 py-1"
          >
            #{TARGET_LABELS[t]}
          </Badge>
        ))}
      </div>
    </header>
  );
}
