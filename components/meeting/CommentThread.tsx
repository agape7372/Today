"use client";

import { useState } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import type { Comment } from "@/lib/meeting";
import { relativeTime } from "@/lib/meeting";
import { cn } from "@/lib/cn";

interface Props {
  comments: Comment[];
  author: string;
  onAdd: (text: string) => void;
  onRemove: (commentId: string) => void;
}

export function CommentThread({ comments, author, onAdd, onRemove }: Props) {
  const [text, setText] = useState("");

  function submit() {
    const t = text.trim();
    if (!t) return;
    onAdd(t);
    setText("");
  }

  return (
    <div className="mt-3 border-t border-[var(--line)] pt-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[var(--fg-muted)]">
        <MessageSquare className="h-3.5 w-3.5" aria-hidden />
        코멘트
        {comments.length > 0 && (
          <span className="text-brand-600 dark:text-brand-400">{comments.length}</span>
        )}
      </div>

      {comments.length > 0 && (
        <ul className="mb-2.5 space-y-1.5">
          {comments.map((c) => (
            <li
              key={c.id}
              className="group flex items-start gap-2 rounded-[var(--radius-card-inner)] bg-[var(--bg)] px-3 py-2 text-sm"
            >
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-brand-700 dark:text-brand-300">
                  {c.author}
                </span>
                <span className="ml-1.5 text-[10px] text-[var(--fg-muted)]">
                  {relativeTime(c.createdAt)}
                </span>
                <p className="mt-0.5 whitespace-pre-wrap leading-relaxed">{c.text}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(c.id)}
                aria-label="코멘트 삭제"
                className="shrink-0 rounded-full p-1 text-[var(--fg-muted)] opacity-0 transition-opacity hover:bg-rose-100 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-rose-500/15 dark:hover:text-rose-300"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-stretch gap-1.5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          rows={2}
          placeholder="..."
          className="min-h-[3.5rem] flex-1 resize-y rounded-[var(--radius-card-inner)] border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim()}
          aria-label="코멘트 등록"
          className={cn(
            "inline-flex w-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-card-inner)] text-[10px] font-medium transition-colors",
            text.trim()
              ? "bg-brand-500 text-white hover:bg-brand-600"
              : "border border-[var(--line)] text-[var(--fg-muted)]",
          )}
        >
          <Send className="h-3.5 w-3.5" aria-hidden />
          등록
        </button>
      </div>
    </div>
  );
}
