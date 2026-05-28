"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import type { SiteStats } from "@/lib/stats";

export function Hero({ stats }: { stats: SiteStats }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 60, damping: 25 });
  const y = useSpring(my, { stiffness: 60, damping: 25 });

  const blob1X = useTransform(x, (v) => v * 0.15);
  const blob1Y = useTransform(y, (v) => v * 0.15);
  const blob2X = useTransform(x, (v) => v * -0.1);
  const blob2Y = useTransform(y, (v) => v * -0.1);

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        mx.set(e.clientX - rect.left - rect.width / 2);
        my.set(e.clientY - rect.top - rect.height / 2);
      }}
      className="relative isolate overflow-hidden"
    >
      <motion.div
        style={{ x: blob1X, y: blob1Y }}
        className="pointer-events-none absolute -left-32 top-20 -z-10 h-96 w-96 rounded-full bg-brand-300/40 blur-3xl dark:bg-brand-500/20"
        aria-hidden
      />
      <motion.div
        style={{ x: blob2X, y: blob2Y }}
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent-300/40 blur-3xl dark:bg-accent-500/20"
        aria-hidden
      />

      <div className="mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
        >
          <Sparkles className="h-3 w-3" />
          근거기반 참여형 재활 카탈로그
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
        >
          오늘,{" "}
          <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">
            뭐할까?
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-[var(--fg-muted)] leading-relaxed sm:text-xl"
        >
          치료사가 30초 안에 결정하는 그룹 재활 게임.
          <br />
          뇌졸중·척수손상·파킨슨·노인을 위한{" "}
          <span className="font-semibold text-[var(--fg)]">
            {stats.gameCount}개 근거기반 활동
          </span>
          {" "}— 치료실 도구 현황과 현장 맞춤까지 한곳에.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/games"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand-500 px-6 text-base font-medium text-white shadow-lifted hover:bg-brand-600 transition-colors"
          >
            게임 카탈로그 열기
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-6 text-base font-medium hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
          >
            어떻게 쓰나요?
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex items-center gap-6 text-sm text-[var(--fg-muted)]"
        >
          <Stat label="게임" value={String(stats.gameCount)} />
          <div className="h-8 w-px bg-[var(--line)]" />
          <Stat label="논문 인용" value={`${stats.citationCount}+`} />
          <div className="h-8 w-px bg-[var(--line)]" />
          <Stat label="환자 타입" value={String(stats.targetGroupCount)} />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-[var(--fg)]">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}
