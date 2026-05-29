"use client";

import type { Game } from "@/lib/types";
import { PinGate } from "./PinGate";
import { MeetingEntry } from "./MeetingEntry";
import { TraitEditor } from "./TraitEditor";
import { AppearanceSection } from "./AppearanceSection";
import { DataManager } from "./DataManager";
import { PinSection } from "./PinSection";

export interface SettingsClientProps {
  games: Game[];
}

export function SettingsClient({ games }: SettingsClientProps) {
  return (
    <PinGate>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            SETTINGS
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            설정 (관리자 모드)
          </h1>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            게임 특성·표시 옵션·데이터 백업·PIN 관리.
          </p>
        </header>

        <div className="space-y-5">
          <MeetingEntry />
          <TraitEditor games={games} />
          <AppearanceSection />
          <DataManager />
          <PinSection />
        </div>
      </div>
    </PinGate>
  );
}
