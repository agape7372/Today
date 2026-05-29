"use client";

import { useRef, useState } from "react";
import {
  Download,
  Upload,
  Printer,
  Copy,
  ClipboardCheck,
  Trash2,
  FileText,
} from "lucide-react";
import type { AgendaItem } from "@/lib/meeting";
import { toMarkdown, toExportPayload, parseImport } from "@/lib/meeting";
import { cn } from "@/lib/cn";

interface Props {
  items: AgendaItem[];
  onImport: (items: AgendaItem[]) => void;
  onClearAll: () => void;
}

export function MeetingActions({ items, onImport, onClearAll }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  function download(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const today = new Date().toISOString().slice(0, 10);

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(toMarkdown(items));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setMsg("✗ 클립보드 복사 실패 (권한 확인)");
    }
  }

  async function handleImportFile(file: File) {
    setMsg(null);
    const text = await file.text();
    const parsed = parseImport(text);
    if (!parsed) {
      setMsg("✗ 가져오기 실패: 형식 오류");
      return;
    }
    onImport(parsed);
    setMsg(`✓ ${parsed.length}건 가져옴`);
  }

  return (
    <div className="no-print rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-4 shadow-soft sm:p-5">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
        내보내기 · 백업
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <ToolBtn onClick={copyMarkdown}>
          {copied ? (
            <>
              <ClipboardCheck className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden />
              복사됨
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden />
              MD 복사
            </>
          )}
        </ToolBtn>
        <ToolBtn onClick={() => download(`회의록-${today}.md`, toMarkdown(items), "text/markdown")}>
          <FileText className="h-3.5 w-3.5" aria-hidden />
          MD 저장
        </ToolBtn>
        <ToolBtn
          onClick={() =>
            download(
              `meeting-backup-${today}.json`,
              JSON.stringify(toExportPayload(items), null, 2),
              "application/json",
            )
          }
        >
          <Download className="h-3.5 w-3.5" aria-hidden />
          JSON
        </ToolBtn>
        <ToolBtn onClick={() => fileRef.current?.click()}>
          <Upload className="h-3.5 w-3.5" aria-hidden />
          가져오기
        </ToolBtn>
        <ToolBtn onClick={() => window.print()}>
          <Printer className="h-3.5 w-3.5" aria-hidden />
          인쇄
        </ToolBtn>
        {confirmClear ? (
          <button
            type="button"
            onClick={() => {
              onClearAll();
              setConfirmClear(false);
            }}
            onBlur={() => setConfirmClear(false)}
            autoFocus
            className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-600"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            전체 삭제?
          </button>
        ) : (
          <ToolBtn onClick={() => setConfirmClear(true)} danger>
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            비우기
          </ToolBtn>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImportFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {msg && (
        <p
          className={cn(
            "mt-2.5 rounded-lg px-3 py-1.5 text-xs",
            msg.startsWith("✓")
              ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
              : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
          )}
        >
          {msg}
        </p>
      )}
    </div>
  );
}

function ToolBtn({
  onClick,
  children,
  danger,
}: {
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium transition-colors",
        danger
          ? "text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/15"
          : "text-[var(--fg)] hover:bg-[var(--line)]/40",
      )}
    >
      {children}
    </button>
  );
}
