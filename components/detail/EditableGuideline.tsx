"use client";

import { useMemo, useState } from "react";
import { Pencil, Check, X, RotateCcw, Lock } from "lucide-react";
import { usePinState } from "@/lib/pin";
import { useContentOverrides } from "@/lib/content-overrides";
import { parseBodySections } from "@/lib/markdown-sections";
import { MiniMarkdown } from "./MiniMarkdown";

export function EditableGuideline({
  slug,
  body,
}: {
  slug: string;
  body: string;
}) {
  const { unlocked } = usePinState();
  const { getForGame, setSection, resetSection } = useContentOverrides();
  const { preamble, sections } = useMemo(
    () => parseBodySections(body),
    [body],
  );
  const ov = getForGame(slug);

  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (heading: string, content: string) => {
    setDraft(content);
    setEditing(heading);
  };
  const commit = (heading: string, original: string) => {
    const trimmed = draft.replace(/\s+$/, "");
    if (trimmed && trimmed !== original) setSection(slug, heading, trimmed);
    setEditing(null);
  };

  return (
    <article className="prose-game">
      {preamble && <MiniMarkdown source={preamble} />}

      {sections.map((sec) => {
        const overridden = ov?.sections?.[sec.heading] !== undefined;
        const content = ov?.sections?.[sec.heading] ?? sec.content;
        const isEditing = editing === sec.heading;

        return (
          <div key={sec.heading}>
            {/* 헤더는 고정 틀 — 편집 불가. 우측에 작은 편집 컨트롤만. */}
            <h2>
              {sec.heading}
              {unlocked && !isEditing && (
                <span className="ml-2 inline-flex items-center gap-1 align-middle no-print">
                  <button
                    type="button"
                    onClick={() => startEdit(sec.heading, content)}
                    className="rounded-md p-1 text-[var(--fg-muted)] opacity-60 transition hover:bg-brand-100 hover:text-brand-700 hover:opacity-100 dark:hover:bg-brand-500/15 dark:hover:text-brand-300"
                    aria-label={`${sec.heading} 내용 수정`}
                    title={`${sec.heading} 내용 수정`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  {overridden && (
                    <button
                      type="button"
                      onClick={() => resetSection(slug, sec.heading)}
                      className="inline-flex items-center gap-0.5 rounded-full bg-warm-300/30 px-1.5 py-0.5 text-[10px] font-medium text-warm-700 hover:bg-warm-300/50 dark:bg-warm-500/15 dark:text-warm-300"
                      title="원래 내용으로 되돌리기"
                    >
                      <RotateCcw className="h-2.5 w-2.5" /> 수정됨
                    </button>
                  )}
                </span>
              )}
            </h2>

            {isEditing ? (
              <div className="no-print not-prose my-3 space-y-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={Math.max(4, draft.split("\n").length + 1)}
                  className="w-full rounded-lg border border-brand-500/50 bg-[var(--bg)] p-3 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-brand-500"
                  aria-label={`${sec.heading} 마크다운 편집`}
                />
                <p className="text-[11px] text-[var(--fg-muted)]">
                  마크다운 지원: <code>- 불릿</code>, <code>1. 번호</code>,{" "}
                  <code>**굵게**</code>, <code>&gt; 인용</code>.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => commit(sec.heading, sec.content)}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600"
                  >
                    <Check className="h-3 w-3" /> 저장
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  >
                    <X className="h-3 w-3" /> 취소
                  </button>
                </div>
              </div>
            ) : (
              <MiniMarkdown source={content} />
            )}
          </div>
        );
      })}

      {unlocked && (
        <p className="not-prose mt-6 flex items-center gap-1.5 rounded-lg bg-brand-50/60 px-3 py-2 text-[11px] text-brand-700 no-print dark:bg-brand-500/10 dark:text-brand-300">
          <Lock className="h-3 w-3" />
          개발자 모드 — 연필 아이콘으로 각 섹션 내용을 수정할 수 있습니다. 섹션
          제목(준비·진행 단계 등)은 고정입니다.
        </p>
      )}
    </article>
  );
}
