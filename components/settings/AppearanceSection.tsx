"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor, Type } from "lucide-react";
import { useSettings, type FontScale } from "@/lib/settings";
import { cn } from "@/lib/cn";

const FONT_OPTIONS: { value: FontScale; label: string; preview: string }[] = [
  { value: "sm", label: "작게", preview: "Aa" },
  { value: "md", label: "보통", preview: "Aa" },
  { value: "lg", label: "크게", preview: "Aa" },
];

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const { settings, setFontScale } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const themeOptions = [
    { value: "system", label: "시스템", icon: Monitor },
    { value: "light", label: "라이트", icon: Sun },
    { value: "dark", label: "다크", icon: Moon },
  ];

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-4 shadow-soft sm:p-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
        Appearance
      </p>
      <h2 className="mt-0.5 text-lg font-bold">표시</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* 테마 */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--fg-muted)]">
            테마
          </p>
          <div className="flex gap-1.5">
            {themeOptions.map((opt) => {
              const active = mounted && theme === opt.value;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-card-inner)] border px-3 py-2 transition-colors",
                    active
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-500/15"
                      : "border-[var(--line)] bg-[var(--bg)] hover:bg-[var(--line)]/30",
                  )}
                  aria-pressed={active}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      active
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-[var(--fg-muted)]",
                    )}
                  />
                  <span className="text-[11px] font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 글자 크기 */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--fg-muted)]">
            <Type className="h-3 w-3" />
            글자 크기
          </p>
          <div className="flex gap-1.5">
            {FONT_OPTIONS.map((opt) => {
              const active = settings.fontScale === opt.value;
              const size =
                opt.value === "sm"
                  ? "text-sm"
                  : opt.value === "lg"
                    ? "text-xl"
                    : "text-base";
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFontScale(opt.value)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-card-inner)] border px-3 py-2 transition-colors",
                    active
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-500/15"
                      : "border-[var(--line)] bg-[var(--bg)] hover:bg-[var(--line)]/30",
                  )}
                  aria-pressed={active}
                >
                  <span className={cn("font-bold leading-none", size)}>
                    {opt.preview}
                  </span>
                  <span className="text-[11px] font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[10px] text-[var(--fg-muted)]">
            보호자·노인 사용 시 ↑. 전체 페이지에 반영.
          </p>
        </div>
      </div>
    </section>
  );
}
