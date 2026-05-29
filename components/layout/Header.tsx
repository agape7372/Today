"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  // matchPrefix: 이 href가 prefix인 경로도 활성으로 처리
  matchPrefix?: boolean;
}

const NAV: NavItem[] = [
  { href: "/", label: "소개" },
  { href: "/manual", label: "메뉴얼", matchPrefix: true },
  { href: "/games", label: "게임 카드", matchPrefix: true },
  { href: "/inventory", label: "현황", matchPrefix: true },
  { href: "/settings", label: "설정", matchPrefix: true },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/") return pathname === "/";
  if (item.matchPrefix) return pathname.startsWith(item.href);
  return pathname === item.href;
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="no-print sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:px-6">
        {/* 로고 */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-1.5 text-sm font-bold tracking-tight sm:gap-2 sm:text-base"
        >
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-[10px] font-black text-white shadow-soft"
            aria-hidden
          >
            오늘
          </span>
          <span className="hidden xs:inline sm:hidden">뭐하지</span>
          <span className="hidden sm:inline">
            오늘 <span className="text-brand-600 dark:text-brand-400">뭐하지</span>
          </span>
        </Link>

        {/* 4탭 네비 */}
        <nav
          className="flex items-center gap-0.5 overflow-x-auto text-xs sm:gap-1 sm:text-sm"
          aria-label="주요 메뉴"
        >
          {NAV.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1.5 font-medium transition-colors sm:px-3",
                  active
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300"
                    : "text-[var(--fg-muted)] hover:bg-[var(--line)] hover:text-[var(--fg)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle className="ml-0.5 sm:ml-1" />
        </nav>
      </div>
    </header>
  );
}
