import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ExternalLink, BookOpen } from "lucide-react";
import { getAggregatedReferences, getReferenceStats } from "@/lib/references";

export const metadata: Metadata = {
  title: "학술 근거 모음",
  description:
    "참여형 재활 게임 카탈로그의 모든 학술 인용을 한곳에. 문헌별로 어떤 게임의 근거인지 함께 표시.",
};

function linkFor(ref: { doi?: string; url?: string }): string | null {
  if (ref.doi) return `https://doi.org/${ref.doi}`;
  if (ref.url) return ref.url;
  return null;
}

export default function ReferencesPage() {
  const refs = getAggregatedReferences();
  const stats = getReferenceStats();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/games"
        className="inline-flex items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-brand-600 dark:hover:text-brand-400"
      >
        <ChevronLeft className="h-4 w-4" />
        카탈로그로 돌아가기
      </Link>

      <header className="mt-4">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          Academic Foundation
        </p>
        <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight sm:text-4xl">
          <BookOpen className="h-7 w-7 text-brand-500" />
          학술 근거 모음
        </h1>
        <p className="mt-3 text-[var(--fg-muted)] leading-relaxed">
          모든 게임의 학술 인용을 한곳에 모았습니다. 각 문헌이 어떤 게임의
          근거인지, 왜 관련 있는지 함께 표시합니다. 임상 근거를 한눈에 검토하고
          출처를 확인하세요.
        </p>

        <dl className="mt-5 grid grid-cols-3 gap-2">
          <Stat label="고유 문헌" value={stats.uniqueCount} />
          <Stat label="총 인용" value={stats.totalCitations} />
          <Stat label="DOI·링크" value={stats.withDoiOrUrl} />
        </dl>
      </header>

      <ol className="mt-8 space-y-4">
        {refs.map((ref, i) => {
          const href = linkFor(ref);
          return (
            <li
              key={ref.citation}
              className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-5 shadow-soft"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 font-mono text-sm font-bold text-brand-500/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-relaxed">
                    {ref.citation}
                  </p>

                  {href && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-xs text-brand-600 hover:underline dark:text-brand-400"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {ref.doi ? `doi:${ref.doi}` : "원문 링크"}
                    </a>
                  )}

                  {ref.relevances.length > 0 && (
                    <ul className="mt-2.5 space-y-1">
                      {ref.relevances.map((r) => (
                        <li
                          key={r}
                          className="flex gap-1.5 text-xs text-[var(--fg-muted)]"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                          <span className="leading-relaxed">{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--fg-muted)]">
                      근거 게임 {ref.games.length}
                    </span>
                    {ref.games.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/games/${g.slug}`}
                        className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-2 py-0.5 text-[11px] text-[var(--fg-muted)] transition-colors hover:border-brand-500/40 hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        {g.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-center text-xs text-[var(--fg-muted)]">
        DOI·URL이 있는 문헌은 클릭하면 원문으로 이동합니다. 일부 단행본·표준
        문서는 링크가 없을 수 있습니다.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-card-inner)] border border-[var(--line)] bg-[var(--bg-elevated)] p-3 text-center">
      <p className="font-mono text-2xl font-bold">{value}</p>
      <p className="text-[10px] text-[var(--fg-muted)]">{label}</p>
    </div>
  );
}
