"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Zap } from "lucide-react";
import type { SiteStats } from "@/lib/stats";

export function Features({ stats }: { stats: SiteStats }) {
  const features = [
    {
      icon: BookOpen,
      title: "근거기반",
      desc: `Sweller·Taub·Thaut·LSVT BIG — ${stats.citationCount}편의 논문 인용으로 게임마다 학술적 뿌리.`,
      accent: "from-brand-500 to-emerald-400",
    },
    {
      icon: Users,
      title: "환자 맞춤",
      desc: `뇌졸중·SCI·파킨슨·비사용·노인 등 ${stats.targetGroupCount}가지 환자군 태그로 게임마다 적용 대상을 표시.`,
      accent: "from-accent-500 to-sky-400",
    },
    {
      icon: Zap,
      title: "즉시 진행",
      desc: "준비물·진행 단계·변형·안전 주의를 한 페이지에. 인쇄해서 들고 가기.",
      accent: "from-warm-500 to-amber-400",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          Why 오늘 뭐하지
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          치료사를 위한 한 권의 책,
          <br className="hidden sm:block" /> 그러나 검색 가능한.
        </h2>
      </motion.div>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {features.map((f, i) => (
          <motion.li
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lifted"
          >
            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.accent} text-white shadow-soft`}
            >
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-bold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
              {f.desc}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
