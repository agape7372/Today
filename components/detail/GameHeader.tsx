"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Game } from "@/lib/types";
import { usePinState } from "@/lib/pin";
import { useContentOverrides } from "@/lib/content-overrides";
import { EditableText } from "@/components/common/EditableText";
import { SessionButton } from "@/components/session/SessionButton";
import { FavoriteButton } from "@/components/catalog/FavoriteButton";

export function GameHeader({ game }: { game: Game }) {
  const { unlocked } = usePinState();
  const { getForGame, setField, resetField } = useContentOverrides();
  const ov = getForGame(game.slug);
  const name = ov?.name ?? game.name;
  const summary = ov?.summary ?? game.summary;

  return (
    <header>
      <div className="flex items-center justify-between gap-3 no-print">
        <Link
          href="/games"
          className="inline-flex items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-brand-600 dark:hover:text-brand-400"
        >
          <ChevronLeft className="h-4 w-4" />
          카탈로그로 돌아가기
        </Link>
        <div className="flex items-center gap-2">
          <SessionButton slug={game.slug} withLabel />
          <FavoriteButton slug={game.slug} size="md" />
        </div>
      </div>

      <div className="mt-4">
        <EditableText
          as="h1"
          value={name}
          unlocked={unlocked}
          isOverridden={ov?.name !== undefined}
          onSave={(v) => setField(game.slug, "name", v)}
          onReset={() => resetField(game.slug, "name")}
          label="게임 이름"
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        />
      </div>

      {game.nameEn && (
        <p className="mt-1 text-sm text-[var(--fg-muted)]">{game.nameEn}</p>
      )}

      <div className="mt-4">
        <EditableText
          as="p"
          value={summary}
          unlocked={unlocked}
          isOverridden={ov?.summary !== undefined}
          onSave={(v) => setField(game.slug, "summary", v)}
          onReset={() => resetField(game.slug, "summary")}
          label="요약"
          multiline
          className="text-lg text-[var(--fg)] leading-relaxed"
        />
      </div>
    </header>
  );
}
