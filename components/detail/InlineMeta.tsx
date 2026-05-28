import { Users, Clock, Armchair, UsersRound } from "lucide-react";
import type { Game } from "@/lib/types";
import {
  POSITION_LABELS,
  GROUP_LABELS,
  INTERACTION_LABELS,
} from "@/lib/constants";

export function InlineMeta({ game }: { game: Game }) {
  const items = [
    {
      icon: Users,
      text: `${game.participants.min}–${game.participants.max}명`,
    },
    {
      icon: Clock,
      text: `${game.durationMin}–${game.durationMax}분`,
    },
    {
      icon: Armchair,
      text: game.position.map((p) => POSITION_LABELS[p]).join("·"),
    },
    {
      icon: UsersRound,
      text: `${GROUP_LABELS[game.groupStructure]} · ${INTERACTION_LABELS[game.interaction]}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--fg-muted)]">
      {items.map(({ icon: Icon, text }, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5" />
          {text}
        </span>
      ))}
    </div>
  );
}
