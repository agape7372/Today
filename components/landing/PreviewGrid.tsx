"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Game } from "@/lib/types";
import { GameCard } from "@/components/catalog/GameCard";
import { useGamesWithOverrides } from "@/lib/trait-overrides";
import { useGamesWithContent } from "@/lib/content-overrides";

export function PreviewGrid({ games }: { games: Game[] }) {
  // 트레잇 + 내용(이름·요약) override 적용 — 랜딩 미리보기도 카탈로그와 일관
  const traited = useGamesWithOverrides(games);
  const adjusted = useGamesWithContent(traited);
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4 }}
        className="flex items-end justify-between gap-4 mb-10"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Sneak Peek
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            오늘의 후보들
          </h2>
        </div>
        <Link
          href="/games"
          className="group hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          전체 보기
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {adjusted.map((g, i) => (
          <motion.div
            key={g.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            {/* 카탈로그와 동일한 GameCard 재사용 — 디자인 괴리 방지 */}
            <GameCard game={g} />
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/games"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400"
        >
          전체 보기 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
