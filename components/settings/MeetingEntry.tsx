"use client";

import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { useMeeting } from "@/lib/meeting";

export function MeetingEntry() {
  const { items, hydrated } = useMeeting();
  const open = items.filter((it) => it.status !== "done").length;

  return (
    <section className="rounded-[var(--radius-card)] border border-brand-500/30 bg-gradient-to-br from-brand-50/60 to-accent-50/40 p-5 shadow-soft dark:from-brand-500/10 dark:to-accent-500/5 sm:p-6">
      <div className="flex items-start gap-4">
        <span
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft"
          aria-hidden
        >
          <Users className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Meeting Room
          </p>
          <h2 className="mt-0.5 text-lg font-bold">회의 보드</h2>
          <p className="mt-1 text-sm leading-relaxed text-[var(--fg-muted)]">
            기대 효과·문제점·활성화 방안·자유 아이디어·게임 요청을 안건별로
            논의하고 코멘트를 남기는 관리자 전용 공간.
          </p>
          {hydrated && items.length > 0 && (
            <p className="mt-2 text-xs text-[var(--fg-muted)]">
              안건 <strong className="font-mono text-[var(--fg)]">{items.length}</strong>건
              {open > 0 && (
                <>
                  {" · "}진행 중{" "}
                  <strong className="font-mono text-[var(--fg)]">{open}</strong>건
                </>
              )}
            </p>
          )}
          <Link
            href="/meeting"
            className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-brand-600"
          >
            회의실 입장
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
