"use client";

import { useState } from "react";
import {
  Pin,
  PinOff,
  Pencil,
  Trash2,
  ThumbsUp,
  ExternalLink,
  Check,
  X,
} from "lucide-react";
import type { AgendaItem, ItemStatus } from "@/lib/meeting";
import {
  STATUSES,
  statusLabel,
  statusTone,
  relativeTime,
  sectionMeta,
} from "@/lib/meeting";
import { Badge } from "@/components/ui/Badge";
import { CommentThread } from "./CommentThread";
import { cn } from "@/lib/cn";

interface Props {
  item: AgendaItem;
  author: string;
  onUpdate: (patch: Partial<AgendaItem>) => void;
  onRemove: () => void;
  onTogglePin: () => void;
  onSetStatus: (status: ItemStatus) => void;
  onToggleVote: () => void;
  onAddComment: (text: string) => void;
  onRemoveComment: (commentId: string) => void;
}

export function AgendaItemCard({
  item,
  author,
  onUpdate,
  onRemove,
  onTogglePin,
  onSetStatus,
  onToggleVote,
  onAddComment,
  onRemoveComment,
}: Props) {
  const meta = sectionMeta(item.section);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [body, setBody] = useState(item.body ?? "");
  const [link, setLink] = useState(item.link ?? "");
  const [confirmDel, setConfirmDel] = useState(false);

  const voted = author.trim() ? item.votes.includes(author.trim()) : false;

  function saveEdit() {
    const t = title.trim();
    if (!t) return;
    onUpdate({
      title: t,
      body: body.trim() || undefined,
      link: meta.withLink ? link.trim() || undefined : item.link,
    });
    setEditing(false);
  }

  function cancelEdit() {
    setTitle(item.title);
    setBody(item.body ?? "");
    setLink(item.link ?? "");
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="rounded-[var(--radius-card-inner)] border border-brand-500/40 bg-[var(--bg-elevated)] p-3.5 shadow-soft">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm font-semibold outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          placeholder="상세 내용 (선택)"
          className="mt-2 w-full resize-y rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
        {meta.withLink && (
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="참고 링크 (https://…)"
            inputMode="url"
            className="mt-2 w-full rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
        )}
        <div className="mt-2.5 flex justify-end gap-2">
          <button
            type="button"
            onClick={cancelEdit}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)]"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            취소
          </button>
          <button
            type="button"
            onClick={saveEdit}
            disabled={!title.trim()}
            className="inline-flex items-center gap-1 rounded-full bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-60"
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
            저장
          </button>
        </div>
      </li>
    );
  }

  return (
    <li
      className={cn(
        "rounded-[var(--radius-card-inner)] border bg-[var(--bg-elevated)] p-3.5 shadow-soft transition-colors",
        item.pinned ? "border-brand-500/40" : "border-[var(--line)]",
      )}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {item.pinned && (
              <Pin className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden />
            )}
            <h3 className="text-[15px] font-semibold leading-snug">{item.title}</h3>
          </div>
          {item.body && (
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[var(--fg-muted)]">
              {item.body}
            </p>
          )}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex max-w-full items-center gap-1 truncate text-xs font-medium text-accent-700 hover:underline dark:text-accent-300"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{item.link}</span>
            </a>
          )}
          <p className="mt-1.5 text-[11px] text-[var(--fg-muted)]">
            {item.author} · {relativeTime(item.createdAt)}
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex shrink-0 items-center gap-0.5">
          <IconBtn label={item.pinned ? "고정 해제" : "상단 고정"} onClick={onTogglePin} active={item.pinned}>
            {item.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
          </IconBtn>
          <IconBtn label="편집" onClick={() => setEditing(true)}>
            <Pencil className="h-3.5 w-3.5" />
          </IconBtn>
          {confirmDel ? (
            <button
              type="button"
              onClick={onRemove}
              onBlur={() => setConfirmDel(false)}
              autoFocus
              className="rounded-full bg-rose-500 px-2 py-1 text-[10px] font-bold text-white hover:bg-rose-600"
            >
              삭제?
            </button>
          ) : (
            <IconBtn label="삭제" onClick={() => setConfirmDel(true)} danger>
              <Trash2 className="h-3.5 w-3.5" />
            </IconBtn>
          )}
        </div>
      </div>

      {/* 하단 컨트롤 줄: 상태 + 공감 */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-0.5 rounded-full bg-[var(--bg)] p-0.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSetStatus(s)}
              aria-pressed={item.status === s}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                item.status === s
                  ? s === "done"
                    ? "bg-brand-500 text-white"
                    : s === "active"
                      ? "bg-accent-500 text-white"
                      : "bg-zinc-600 text-white dark:bg-zinc-500"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
              )}
            >
              {statusLabel(item.section, s)}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onToggleVote}
          aria-pressed={voted}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
            voted
              ? "bg-warm-300/40 text-warm-700 dark:bg-warm-500/20 dark:text-warm-300"
              : "border border-[var(--line)] text-[var(--fg-muted)] hover:text-[var(--fg)]",
          )}
          title={item.votes.length > 0 ? item.votes.join(", ") : "공감 추가"}
        >
          <ThumbsUp className={cn("h-3.5 w-3.5", voted && "fill-current")} aria-hidden />
          공감 {item.votes.length > 0 && item.votes.length}
        </button>

        {/* 상태 배지 (작게, 우측) */}
        <span className="ml-auto">
          <Badge tone={statusTone(item.status)}>{statusLabel(item.section, item.status)}</Badge>
        </span>
      </div>

      <CommentThread
        comments={item.comments}
        author={author}
        onAdd={onAddComment}
        onRemove={onRemoveComment}
      />
    </li>
  );
}

function IconBtn({
  label,
  onClick,
  children,
  active,
  danger,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-full p-1.5 transition-colors",
        active
          ? "text-brand-600 dark:text-brand-400"
          : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
        danger && "hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/15 dark:hover:text-rose-300",
        !danger && "hover:bg-[var(--line)]/50",
      )}
    >
      {children}
    </button>
  );
}
