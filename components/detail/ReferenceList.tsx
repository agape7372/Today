import { BookOpen, ExternalLink } from "lucide-react";
import type { Reference } from "@/lib/types";

export function ReferenceList({ references }: { references: Reference[] }) {
  if (!references || references.length === 0) return null;

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-6 shadow-soft">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-accent-600 dark:text-accent-300" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--fg-muted)]">
          학술 근거
        </h2>
      </div>
      <ol className="mt-4 space-y-4">
        {references.map((ref, i) => (
          <li
            key={i}
            className="rounded-[var(--radius-card-inner)] border-l-2 border-accent-500 bg-accent-50/50 p-3 dark:bg-accent-500/5"
          >
            <p className="text-sm font-medium leading-relaxed">
              [{i + 1}] {ref.citation}
            </p>
            <p className="mt-1 text-xs text-[var(--fg-muted)] leading-relaxed">
              {ref.relevance}
            </p>
            {(ref.doi || ref.url) && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {ref.doi && (
                  <a
                    href={`https://doi.org/${ref.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent-600 hover:underline dark:text-accent-300"
                  >
                    DOI: {ref.doi}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {ref.url && !ref.doi && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent-600 hover:underline dark:text-accent-300"
                  >
                    원문 링크
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
