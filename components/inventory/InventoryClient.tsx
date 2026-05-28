"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import type { Game } from "@/lib/types";
import {
  CATEGORY_LABELS,
  type ToolCategory,
  type ToolDef,
  type ToolType,
} from "@/lib/tools-master";
import {
  useTools,
  getToolsForGame,
  getGamesForTool,
} from "@/lib/tools";
import { useInventory } from "@/lib/inventory";
import { ToolCard } from "./ToolCard";
import { ToolDetail } from "./ToolDetail";
import {
  NameSortToggle,
  type NameSortDir,
} from "@/components/common/NameSortToggle";
import { cn } from "@/lib/cn";

type StatusFilter = "all" | "owned" | "missing";
type TypeFilter = "all" | "consumable" | "durable";

export interface InventoryClientProps {
  games: Game[];
}

export function InventoryClient({ games }: InventoryClientProps) {
  const tools = useTools();
  const { inv, ownedCount } = useInventory();
  const router = useRouter();
  const params = useSearchParams();
  const selectedFromUrl = params.get("tool");

  const [category, setCategory] = useState<ToolCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [search, setSearch] = useState("");
  const [nameSort, setNameSort] = useState<NameSortDir>(undefined);
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedFromUrl ?? null,
  );

  // URL ?tool= 변경 동기화
  useEffect(() => {
    if (selectedFromUrl && selectedFromUrl !== selectedId) {
      setSelectedId(selectedFromUrl);
    }
  }, [selectedFromUrl, selectedId]);

  // 선택된 도구로 자동 스크롤
  const detailRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedId && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedId]);

  // 게임 → 도구 매칭 캐시
  const usageByTool = useMemo(() => {
    const map = new Map<string, Game[]>();
    for (const g of games) {
      for (const t of getToolsForGame(g, tools)) {
        if (!map.has(t.id)) map.set(t.id, []);
        map.get(t.id)!.push(g);
      }
    }
    return map;
  }, [games, tools]);

  // 도구 필터링 + 정렬
  const filteredTools = useMemo(() => {
    const list = tools.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      const owned = Boolean(inv[t.id]?.owned);
      if (statusFilter === "owned" && !owned) return false;
      if (statusFilter === "missing" && owned) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = `${t.name} ${t.nameEn ?? ""} ${t.aliases.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (nameSort) {
      return [...list].sort((a, b) => {
        const cmp = a.name.localeCompare(b.name, "ko");
        return nameSort === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [tools, category, statusFilter, typeFilter, search, inv, nameSort]);

  // 구매 추천: 한 도구만 더 사면 새 게임 N개 가능 — top 3
  const purchaseRecommendations = useMemo(() => {
    const missing = tools.filter((t) => !inv[t.id]?.owned);
    const scored = missing.map((t) => {
      const games = usageByTool.get(t.id) ?? [];
      const blocked = games.filter((g) => {
        const required = getToolsForGame(g, tools);
        return required.some((req) => req.id !== t.id && !inv[req.id]?.owned);
      });
      const unlockable = games.length - blocked.length;
      return { tool: t, unlockable };
    });
    return scored
      .filter((s) => s.unlockable > 0)
      .sort((a, b) => b.unlockable - a.unlockable)
      .slice(0, 3);
  }, [tools, inv, usageByTool]);

  // 카테고리 카운트 (필터링 외 전체 기준)
  const counts = useMemo(() => {
    const consumables = tools.filter((t) => t.type === "consumable");
    const durables = tools.filter((t) => t.type === "durable");
    return {
      total: tools.length,
      consumable: consumables.length,
      consumableOwned: consumables.filter((t) => inv[t.id]?.owned).length,
      durable: durables.length,
      durableOwned: durables.filter((t) => inv[t.id]?.owned).length,
    };
  }, [tools, inv]);

  const selectedTool: ToolDef | null = selectedId
    ? tools.find((t) => t.id === selectedId) ?? null
    : null;
  const selectedUsage = selectedTool
    ? getGamesForTool(selectedTool.id, tools, games)
    : [];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const qs = new URLSearchParams(params);
    qs.set("tool", id);
    router.replace(`/inventory?${qs.toString()}`, { scroll: false });
  };

  const handleClose = () => {
    setSelectedId(null);
    const qs = new URLSearchParams(params);
    qs.delete("tool");
    router.replace(`/inventory${qs.toString() ? `?${qs}` : ""}`, {
      scroll: false,
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          INVENTORY
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          치료실 도구 현황
        </h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          한국 치료실 흔한 도구 {counts.total}개 사전 정의. 도구 클릭 →
          보유·가격·사용 게임 한눈에.
        </p>
      </header>

      {/* 요약 띠 */}
      <div className="mb-6 grid gap-2 sm:grid-cols-3">
        <SummaryStat
          label="전체 보유"
          value={`${ownedCount}/${counts.total}`}
          accent="brand"
        />
        <SummaryStat
          label="소비재"
          value={`${counts.consumableOwned}/${counts.consumable}`}
          accent="warm"
        />
        <SummaryStat
          label="영구재"
          value={`${counts.durableOwned}/${counts.durable}`}
          accent="accent"
        />
      </div>

      {/* 구매 추천 */}
      {purchaseRecommendations.length > 0 && (
        <div className="mb-6 rounded-[var(--radius-card)] border border-brand-500/30 bg-gradient-to-br from-brand-500/5 to-accent-500/5 p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            <Sparkles className="h-3 w-3" />
            구매 추천 — 1개만 더 사면 새 게임 가능
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {purchaseRecommendations.map(({ tool, unlockable }) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleSelect(tool.id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-elevated)] px-3 py-1.5 text-sm font-medium shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lifted"
              >
                <span>{tool.name}</span>
                <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  +{unlockable}게임
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 검색 */}
      <div className="mb-3">
        <label className="flex h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-4 shadow-soft focus-within:border-brand-500">
          <Search className="h-4 w-4 text-[var(--fg-muted)]" />
          <input
            type="text"
            placeholder="도구·별칭 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--fg-muted)]"
          />
        </label>
      </div>

      {/* 카테고리 + 상태 필터 (sticky) */}
      <div className="sticky top-14 z-20 -mx-4 mb-4 space-y-2 border-b border-[var(--line)] bg-[var(--bg)]/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap gap-1.5">
          <Chip
            active={category === "all"}
            onClick={() => setCategory("all")}
          >
            전체
          </Chip>
          {(Object.keys(CATEGORY_LABELS) as ToolCategory[]).map((c) => (
            <Chip
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
            >
              {CATEGORY_LABELS[c]}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <Chip
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
              tone="neutral"
            >
              상태 전체
            </Chip>
            <Chip
              active={statusFilter === "owned"}
              onClick={() => setStatusFilter("owned")}
              tone="brand"
            >
              ✓ 보유
            </Chip>
            <Chip
              active={statusFilter === "missing"}
              onClick={() => setStatusFilter("missing")}
              tone="rose"
            >
              ✗ 미보유
            </Chip>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Chip
              active={typeFilter === "consumable"}
              onClick={() =>
                setTypeFilter(typeFilter === "consumable" ? "all" : "consumable")
              }
              tone="warm"
            >
              소비재
            </Chip>
            <Chip
              active={typeFilter === "durable"}
              onClick={() =>
                setTypeFilter(typeFilter === "durable" ? "all" : "durable")
              }
              tone="accent"
            >
              영구재
            </Chip>
            <NameSortToggle value={nameSort} onChange={setNameSort} />
          </div>
        </div>
      </div>

      <p className="mb-3 text-xs text-[var(--fg-muted)]">
        {filteredTools.length}개
        {filteredTools.length === counts.total
          ? " (전체)"
          : ` / 전체 ${counts.total}개`}
      </p>

      {/* 도구 그리드 */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((t) => (
          <ToolCard
            key={t.id}
            tool={t}
            entry={inv[t.id]}
            usedInGameCount={(usageByTool.get(t.id) ?? []).length}
            selected={selectedId === t.id}
            onClick={() => handleSelect(t.id)}
          />
        ))}
      </div>

      {/* 선택된 도구 상세 */}
      {selectedTool && (
        <div ref={detailRef} className="mt-6">
          <ToolDetail
            tool={selectedTool}
            usedInGames={selectedUsage}
            onClose={handleClose}
          />
        </div>
      )}
    </div>
  );
}

// ── 헬퍼 컴포넌트 ─────────────────────────────────────────────
type ChipTone = "brand" | "neutral" | "rose" | "warm" | "accent";

function Chip({
  active,
  onClick,
  children,
  tone = "brand",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: ChipTone;
}) {
  const styles: Record<ChipTone, string> = {
    brand: "bg-brand-500 text-white",
    neutral: "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900",
    rose: "bg-rose-500 text-white",
    warm: "bg-warm-500 text-white",
    accent: "bg-accent-500 text-white",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
        active
          ? `${styles[tone]} shadow-soft`
          : "border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--fg)] hover:bg-[var(--line)]",
      )}
    >
      {children}
    </button>
  );
}

function SummaryStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "brand" | "warm" | "accent";
}) {
  const color = {
    brand: "from-brand-500/15 to-brand-500/5 text-brand-700 dark:text-brand-300",
    warm: "from-warm-500/15 to-warm-500/5 text-warm-700 dark:text-warm-300",
    accent:
      "from-accent-500/15 to-accent-500/5 text-accent-700 dark:text-accent-300",
  }[accent];
  return (
    <div
      className={`rounded-[var(--radius-card-inner)] border border-[var(--line)] bg-gradient-to-br ${color} p-3`}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-2xl font-bold">{value}</p>
    </div>
  );
}
