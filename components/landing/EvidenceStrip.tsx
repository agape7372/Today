"use client";

import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import type { SiteStats } from "@/lib/stats";

export function EvidenceStrip({ stats }: { stats: SiteStats }) {
  const items = [
    { n: stats.gameCount, label: "게임" },
    { n: stats.citationCount, label: "논문 인용", suffix: "+" },
    { n: stats.targetGroupCount, label: "환자 타입" },
    { n: stats.traitCount, label: "평가 지표" },
  ];

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="rounded-[var(--radius-card)] border border-[var(--line)] bg-gradient-to-br from-brand-500/5 via-transparent to-accent-500/5 p-8 sm:p-12 shadow-soft">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400"
        >
          Evidence in Numbers
        </motion.p>

        <h2 className="mt-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          숫자로 보는 학술 깊이
        </h2>

        <ul className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {items.map((s) => (
            <li key={s.label} className="text-center">
              <Counter target={s.n} suffix={s.suffix} />
              <p className="mt-1 text-sm text-[var(--fg-muted)]">{s.label}</p>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-[var(--fg-muted)] leading-relaxed">
          Sweller(1988) 인지부하 · Taub(1999) CIMT · Thaut(1997) Rhythmic Auditory
          Stimulation · LSVT BIG · Otago Program · Fugl-Meyer · Berg Balance Scale.
          <br />각 게임 카드에 학술 근거가 함께 표시됨.
        </p>
      </div>
    </section>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true });
  const value = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, target, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = `${Math.round(v)}${suffix}`;
        }
      },
    });
    return controls.stop;
  }, [inView, target, suffix, value]);

  return (
    <p
      ref={ref}
      className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text font-mono text-5xl font-bold text-transparent sm:text-6xl"
    >
      0{suffix}
    </p>
  );
}
