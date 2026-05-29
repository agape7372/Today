"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { AgendaItem, ItemStatus, SectionMeta } from "@/lib/meeting";
import { sortItems } from "@/lib/meeting";
import { AgendaItemCard } from "./AgendaItemCard";
import { cn } from "@/lib/cn";

const TONE_BORDER: Record<SectionMeta["tone"], string> = {
  brand: "border-l-brand-500",
  rose: "border-l-rose-500",
  accent: "border-l-accent-500",
  warm: "border-l-warm-500",
  violet: "border-l-violet-500",
};

const TONE_TEXT: Record<SectionMeta["tone"], string> = {
  brand: "text-brand-600 dark:text-brand-400",
  rose: "text-rose-600 dark:text-rose-400",
  accent: "text-accent-600 dark:text-accent-400",
  warm: "text-warm-600 dark:text-warm-300",
  violet: "text-violet-600 dark:text-violet-400",
};

interface Props {
  meta: SectionMeta;
  items: AgendaItem[];
  author: string;
  onAdd: (input: { title: string; body?: string; link?: string }) => void;
  onUpdate: (id: string, patch: Partial<AgendaItem>) => void;
  onRemove: (id: string) => void;
  onTogglePin: (id: string) => void;
  onSetStatus: (id: string, status: ItemStatus) => void;
  onToggleVote: (id: string) => void;
  onAddComment: (id: string, text: string) => void;
  onRemoveComment: (id: string, commentId: string) => void;
}

export function AgendaSection({
  meta,
  items,
  author,
  onAdd,
  onUpdate,
  onRemove,
  onTogglePin,
  onSetStatus,
  onToggleVote,
  onAddComment,
  onRemoveComment,
}: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");

  const sorted = sortItems(items);

  function submit() {
    const t = title.trim();
    if (!t) return;
    onAdd({
      title: t,
      body: body.trim() || undefined,
      link: meta.withLink ? link.trim() || undefined : undefined,
    });
    setTitle("");
    setBody("");
    setLink("");
    setOpen(false);
  }

  return (
    <section
      id={`section-${meta.id}`}
      className="scroll-mt-20 rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-4 shadow-soft sm:p-5"
    >
      {/* 헤더 */}
      <div className={cn("border-l-[3px] pl-3", TONE_BORDER[meta.tone])}>
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold tracking-tight sm:text-xl">
            <span className={cn("mr-1 font-mono text-sm", TONE_TEXT[meta.tone])}>
              {String(meta.index).padStart(2, "0")}
            </span>
            <span aria-hidden className="mr-1">{meta.emoji}</span>
            {meta.label}
          </h2>
          <span className="shrink-0 font-mono text-xs text-[var(--fg-muted)]">
            {items.length}건
          </span>
        </div>
        <p className="mt-0.5 text-xs text-[var(--fg-muted)]">{meta.hint}</p>
      </div>

      {/* 안건 추가 */}
      <div className="mt-3.5">
        {open ? (
          <div className="rounded-[var(--radius-card-inner)] border border-[var(--line)] bg-[var(--bg)] p-3">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !meta.withLink) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder={meta.placeholder}
              className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-medium outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={2}
              placeholder="상세 내용 (선택)"
              className="mt-2 w-full resize-y rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
            />
            {meta.withLink && (
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="참고 링크 (예: 유튜브/블로그 URL) — 개발자가 새 게임 제작에 활용"
                inputMode="url"
                className="mt-2 w-full rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              />
            )}
            <div className="mt-2.5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setTitle("");
                  setBody("");
                  setLink("");
                }}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)]"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                취소
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!title.trim()}
                className="inline-flex items-center gap-1 rounded-full bg-brand-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-60"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden />
                추가
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-card-inner)] border border-dashed border-[var(--line)] px-4 py-2.5 text-sm font-medium text-[var(--fg-muted)] transition-colors hover:border-brand-500/50 hover:text-brand-600 dark:hover:text-brand-400"
          >
            <Plus className="h-4 w-4" aria-hidden />
            안건 추가
          </button>
        )}
      </div>

      {/* 아이템 리스트 */}
      {sorted.length > 0 ? (
        <ul className="mt-3 space-y-2.5">
          {sorted.map((it) => (
            <AgendaItemCard
              key={it.id}
              item={it}
              author={author}
              onUpdate={(patch) => onUpdate(it.id, patch)}
              onRemove={() => onRemove(it.id)}
              onTogglePin={() => onTogglePin(it.id)}
              onSetStatus={(s) => onSetStatus(it.id, s)}
              onToggleVote={() => onToggleVote(it.id)}
              onAddComment={(text) => onAddComment(it.id, text)}
              onRemoveComment={(cid) => onRemoveComment(it.id, cid)}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-[var(--radius-card-inner)] border border-dashed border-[var(--line)] px-4 py-6 text-center text-xs text-[var(--fg-muted)]">
          아직 안건이 없음 · 위 버튼으로 첫 안건을 추가하세요
        </p>
      )}
    </section>
  );
}
