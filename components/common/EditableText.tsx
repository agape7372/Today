"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Check, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";

interface EditableTextProps {
  value: string;
  unlocked: boolean;
  isOverridden: boolean;
  onSave: (next: string) => void;
  onReset: () => void;
  as?: "h1" | "p" | "span";
  multiline?: boolean;
  label?: string;
  className?: string;
  inputClassName?: string;
}

// 개발자(PIN 해제) 모드에서만 연필 아이콘 노출. 클릭 시 인라인 편집.
// 기본(잠금) 상태에서는 평범한 텍스트로만 렌더 — 일반 사용자에겐 변화 없음.
export function EditableText({
  value,
  unlocked,
  isOverridden,
  onSave,
  onReset,
  as = "span",
  multiline = false,
  label = "내용",
  className,
  inputClassName,
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing) {
      setDraft(value);
      inputRef.current?.focus();
    }
  }, [editing, value]);

  const Tag = as;

  if (!unlocked) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (editing) {
    const commit = () => {
      const trimmed = draft.trim();
      if (trimmed && trimmed !== value) onSave(trimmed);
      setEditing(false);
    };
    return (
      <div className="space-y-2">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            className={cn(
              "w-full rounded-lg border border-brand-500/50 bg-[var(--bg)] p-2 text-base leading-relaxed outline-none focus:ring-2 focus:ring-brand-500",
              inputClassName,
            )}
            aria-label={`${label} 편집`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
            className={cn(
              "w-full rounded-lg border border-brand-500/50 bg-[var(--bg)] p-2 outline-none focus:ring-2 focus:ring-brand-500",
              inputClassName,
            )}
            aria-label={`${label} 편집`}
          />
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={commit}
            className="inline-flex items-center gap-1 rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white hover:bg-brand-600"
          >
            <Check className="h-3 w-3" /> 저장
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)]"
          >
            <X className="h-3 w-3" /> 취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <span className="group/edit inline-flex items-start gap-1.5">
      <Tag className={className}>{value}</Tag>
      <span className="mt-1 inline-flex shrink-0 items-center gap-1 no-print">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-md p-1 text-[var(--fg-muted)] opacity-60 transition hover:bg-brand-100 hover:text-brand-700 hover:opacity-100 dark:hover:bg-brand-500/15 dark:hover:text-brand-300"
          aria-label={`${label} 수정`}
          title={`${label} 수정`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        {isOverridden && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-0.5 rounded-full bg-warm-300/30 px-1.5 py-0.5 text-[10px] font-medium text-warm-700 hover:bg-warm-300/50 dark:bg-warm-500/15 dark:text-warm-300"
            title="원래 내용으로 되돌리기"
          >
            <RotateCcw className="h-2.5 w-2.5" /> 수정됨
          </button>
        )}
      </span>
    </span>
  );
}
