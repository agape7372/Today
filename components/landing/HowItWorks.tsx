"use client";

import { motion } from "framer-motion";
import { Filter, FileSearch, Package, PlayCircle } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: Filter,
    title: "게임 고르기",
    desc: "검색·특성 정렬·즐겨찾기로 추리고, URL이 자동으로 변해 공유 가능.",
  },
  {
    n: "02",
    icon: FileSearch,
    title: "게임 비교",
    desc: "6가지 특성(재미·난이도·인지부하 등)을 막대·강점 배지로 한눈에 비교.",
  },
  {
    n: "03",
    icon: Package,
    title: "준비물 확인",
    desc: "준비물이 치료실 보유 도구와 자동 매칭 — '진행 준비 완료'를 즉시 판별.",
  },
  {
    n: "04",
    icon: PlayCircle,
    title: "진행 + 인쇄",
    desc: "5섹션 가이드라인(준비·진행·변형·안전·평가). 영상 보고 인쇄해 들고 가기.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-[var(--line)] bg-gradient-to-b from-brand-50/40 to-transparent dark:from-brand-500/5"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            How It Works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            30초 안에 오늘의 게임 결정
          </h2>
        </motion.div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="relative"
            >
              <div className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-3xl font-bold text-brand-500/30">
                    {s.n}
                  </span>
                  <s.icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--fg-muted)]">
                  {s.desc}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
