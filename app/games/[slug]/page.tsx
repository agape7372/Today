import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getGameBySlug } from "@/lib/games";
import { GameHeader } from "@/components/detail/GameHeader";
import { InlineMeta } from "@/components/detail/InlineMeta";
import { TraitsBreakdown } from "@/components/detail/TraitsBreakdown";
import { VideoEmbed } from "@/components/detail/VideoEmbed";
import { MaterialsSafety } from "@/components/detail/MaterialsSafety";
import { MaterialChips } from "@/components/detail/MaterialChips";
import { GuidelineBody } from "@/components/detail/GuidelineBody";
import { ReferenceList } from "@/components/detail/ReferenceList";
import { PrintButton } from "@/components/detail/PrintButton";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return { title: "게임을 찾을 수 없음" };
  return {
    title: game.name,
    description: game.summary,
    openGraph: {
      title: `${game.name} — 오늘 뭐하지`,
      description: game.summary,
    },
  };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
      <GameHeader game={game} />

      <InlineMeta game={game} />

      <TraitsBreakdown game={game} />

      <VideoEmbed
        slug={game.slug}
        url={game.videoUrl}
        searchQuery={game.videoSearchQuery}
      />

      <MaterialChips game={game} />

      <MaterialsSafety game={game} />

      <section className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-6 sm:p-8 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-3 no-print">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Therapist Guidelines
          </p>
          <PrintButton />
        </div>
        <GuidelineBody source={game.body} />
      </section>

      <ReferenceList references={game.references} />

      <div className="border-t border-[var(--line)] pt-6 text-center text-xs text-[var(--fg-muted)] no-print">
        근거기반 참여형 재활 게임 · 오늘 뭐하지
      </div>
    </article>
  );
}
