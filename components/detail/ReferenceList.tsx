import { BookOpen, ExternalLink } from "lucide-react";
import type { Reference } from "@/lib/types";

export function ReferenceList({ references }: { references: Reference[] }) {
  if (!references || references.length === 0) return null;

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-accent-600 dark:text-accent-300" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--fg-muted)]">
          학술 근거
        </h2>
      </div>
      <ol className="mt-3 space-y-2.5">
        {references.map((ref, i) => {
          const href = ref.doi ? `https://doi.org/${ref.doi}` : ref.url;
          const label = ref.doi ? `DOI: ${ref.doi}` : "원문 링크";
          return (
            <li key={i} className="text-sm leading-snug">
              <p className="font-medium">
                <span className="text-[var(--fg-muted)]">[{i + 1}]</span>{" "}
                {ref.citation}
                {href && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    aria-label={label}
                    className="ml-1 inline-flex translate-y-0.5 text-accent-600 hover:text-accent-700 dark:text-accent-300"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                )}
              </p>
              <p className="mt-0.5 text-xs text-[var(--fg-muted)]">
                {ref.relevance}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
