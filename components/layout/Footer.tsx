export function Footer() {
  return (
    <footer className="no-print border-t border-[var(--line)] bg-[var(--bg-elevated)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-sm text-[var(--fg-muted)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[var(--fg)]">오늘 뭐하지</p>
            <p className="mt-1">참여형 재활 그룹 세션을 위한 근거기반 게임 카탈로그.</p>
          </div>
          <div className="flex flex-col gap-1 sm:items-end">
            <p>학술 근거 — 논문 10+ 편 인용</p>
            <p>치료사를 위한 도구 · 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
