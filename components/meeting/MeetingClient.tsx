"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings as SettingsIcon, Users, HardDrive } from "lucide-react";
import { PinGate } from "@/components/settings/PinGate";
import {
  useMeeting,
  useMeetingAuthor,
  SECTIONS,
  type AgendaItem,
  type ItemStatus,
} from "@/lib/meeting";
import { MeetingToolbar } from "./MeetingToolbar";
import { MeetingActions } from "./MeetingActions";
import { AgendaSection } from "./AgendaSection";

type StatusFilter = "all" | ItemStatus;

function matchesSearch(it: AgendaItem, q: string): boolean {
  if (!q) return true;
  const hay = [
    it.title,
    it.body ?? "",
    it.link ?? "",
    it.author,
    ...it.comments.map((c) => `${c.author} ${c.text}`),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q.toLowerCase());
}

export function MeetingClient() {
  return (
    <PinGate>
      <MeetingBoard />
    </PinGate>
  );
}

function MeetingBoard() {
  const m = useMeeting();
  const [author, setAuthor] = useMeetingAuthor();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = search.trim();
    return m.items.filter(
      (it) =>
        (statusFilter === "all" || it.status === statusFilter) &&
        matchesSearch(it, q),
    );
  }, [m.items, search, statusFilter]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* 헤더 */}
      <header className="no-print mb-6">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            MEETING ROOM
          </p>
          <div className="flex items-center gap-1.5">
            <Link
              href="/settings"
              className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              <SettingsIcon className="h-3.5 w-3.5" aria-hidden />
              설정
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              홈
            </Link>
          </div>
        </div>
        <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight sm:text-4xl">
          <Users className="h-7 w-7 text-brand-600 dark:text-brand-400" aria-hidden />
          회의
        </h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          안건별로 의견·코멘트를 남기고, 회의록은 Markdown으로 내보내 공유. 모든
          내용은 이 기기에 저장됩니다.
        </p>
      </header>

      <div className="mb-5">
        <MeetingToolbar
          author={author}
          onAuthorChange={setAuthor}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      {(search.trim() || statusFilter !== "all") && (
        <p className="no-print mb-3 text-xs text-[var(--fg-muted)]">
          필터 적용 중 · {filtered.length}건 표시
        </p>
      )}

      <div className="space-y-4">
        {SECTIONS.map((meta) => (
          <AgendaSection
            key={meta.id}
            meta={meta}
            items={filtered.filter((it) => it.section === meta.id)}
            author={author}
            onAdd={(input) => m.addItem({ ...input, section: meta.id, author })}
            onUpdate={m.updateItem}
            onRemove={m.removeItem}
            onTogglePin={m.togglePin}
            onSetStatus={m.setStatus}
            onToggleVote={(id) => m.toggleVote(id, author)}
            onAddComment={(id, text) => m.addComment(id, author, text)}
            onRemoveComment={m.removeComment}
          />
        ))}
      </div>

      {/* 내보내기·백업 액션 — 페이지 맨 밑 */}
      <div className="mt-8">
        <MeetingActions
          items={m.items}
          onImport={(incoming) => {
            // 가져온 항목을 기존과 병합 (id 중복은 가져온 쪽 우선)
            const map = new Map<string, AgendaItem>();
            for (const it of m.items) map.set(it.id, it);
            for (const it of incoming) map.set(it.id, it);
            m.replaceAll(Array.from(map.values()));
          }}
          onClearAll={m.clearAll}
        />
      </div>

      <p className="no-print mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-[var(--fg-muted)]">
        <HardDrive className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>
          데이터는 이 브라우저(localStorage)에만 저장됩니다. 다른 기기와
          공유하려면 <strong>JSON 내보내기/가져오기</strong>를, 회의록 배포는{" "}
          <strong>MD 복사/저장</strong>을 사용하세요.
        </span>
      </p>
    </div>
  );
}
