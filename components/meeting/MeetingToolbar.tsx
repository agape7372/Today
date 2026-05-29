"use client";

import { useRef, useState } from "react";
import {
  Search,
  Download,
  Upload,
  Printer,
  Copy,
  ClipboardCheck,
  Trash2,
  UserRound,
  FileText,
} from "lucide-react";
import type { AgendaItem, ItemStatus } from "@/lib/meeting";
import { toMarkdown, toExportPayload, parseImport } from "@/lib/meeting";
import { cn } from "@/lib/cn";

type StatusFilter = "all" | ItemStatus;

interface Props {
  items: AgendaItem[];
  author: string;
  onAuthorChange: (name: string) => void;
  search: string;
  onSearchChange: (q: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (s: StatusFilter) => void;
  onImport: (items: AgendaItem[]) => void;
  onClearAll: () => void;
}

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "open", label: "열림" },
  { id: "active", label: "논의중" },
  { id: "done", label: "완료" },
];

export function MeetingToolbar({
  items,
  author,
  onAuthorChange,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onImport,
  onClearAll,
}: Props) {
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
      {/* 1행: 이름 + 검색 */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <label className="relative flex items-center sm:w-56">
          <UserRound className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--fg-muted)]" aria-hidden />
          <input
            value={author}
            onChange={(e) => onAuthorChange(e.target.value)}
            placeholder="내 이름 (코멘트·공감에 표시)"
            className="w-full rounded-full border border-[var(--line)] bg-[var(--bg)] py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
        </label>
        <label className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--fg-muted)]" aria-hidden />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="안건·코멘트 검색"
            className="w-full rounded-full border border-[var(--line)] bg-[var(--bg)] py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
        </label>
      </div>

      {/* 2행: 상태 필터 + 액션 */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-full bg-[var(--bg)] p-0.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onStatusFilterChange(s.id)}
              aria-pressed={statusFilter === s.id}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                statusFilter === s.id
                  ? "bg-brand-500 text-white"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-1.5">
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
