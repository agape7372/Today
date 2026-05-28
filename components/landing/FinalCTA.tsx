"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { SiteStats } from "@/lib/stats";

export function FinalCTA({ stats }: { stats: SiteStats }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br from-brand-500 via-emerald-500 to-accent-500 p-10 text-white shadow-lifted sm:p-16"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-amber-300/30 blur-3xl"
          aria-hidden
        />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">
            Ready?
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            오늘의 환자에게 맞는
            <br />
            게임을 찾아보세요.
          </h2>
          <p className="mt-4 max-w-xl text-white/90 sm:text-lg">
            {stats.gameCount}개의 근거기반 활동을 30초 안에 비교. 가이드라인과 학술 근거가 함께.
          </p>
          <Link
            href="/games"
            className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-base font-medium text-brand-700 shadow-soft hover:bg-zinc-50 transition-colors"
          >
            게임 카탈로그 열기
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
