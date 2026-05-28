"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium shadow-soft hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
    >
      <Printer className="h-4 w-4" />
      가이드라인 인쇄
    </button>
  );
}
