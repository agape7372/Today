"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { TOOLS_MASTER, type ToolDef } from "./tools-master";
import type { Game } from "./types";

const CUSTOM_KEY = "today-custom-tools-v1";

// ── 사용자 정의 도구 (localStorage) ───────────────────────────
function readCustom(): ToolDef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeCustom(tools: ToolDef[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(tools));
    window.dispatchEvent(new Event("custom-tools-changed"));
  } catch {
    /* quota */
  }
}

export function useCustomTools() {
  const [customs, setCustoms] = useState<ToolDef[]>([]);

  useEffect(() => {
    setCustoms(readCustom());
    const onChange = () => setCustoms(readCustom());
    const onStorage = (e: StorageEvent) => {
      if (e.key === CUSTOM_KEY) onChange();
    };
    window.addEventListener("custom-tools-changed", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("custom-tools-changed", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const add = useCallback((tool: ToolDef) => {
    const list = readCustom().filter((t) => t.id !== tool.id);
    list.push(tool);
    writeCustom(list);
    setCustoms([...list]);
  }, []);

  const remove = useCallback((id: string) => {
    const list = readCustom().filter((t) => t.id !== id);
    writeCustom(list);
    setCustoms([...list]);
  }, []);

  return { customs, add, remove };
}

// ── 전체 도구 (master + custom) ────────────────────────────────
export function useTools(): ToolDef[] {
  const { customs } = useCustomTools();
  return useMemo(() => {
    const map = new Map<string, ToolDef>();
    for (const t of TOOLS_MASTER) map.set(t.id, t);
    for (const t of customs) map.set(t.id, t);
    return Array.from(map.values());
  }, [customs]);
}

// ── 매칭 알고리즘 ─────────────────────────────────────────────
// 한 게임 materials와 도구 aliases 매칭
export function getToolsForGame(game: Game, tools: ToolDef[]): ToolDef[] {
  const matched = new Map<string, ToolDef>();
  for (const m of game.materials) {
    const text = m.toLowerCase();
    for (const tool of tools) {
      if (matched.has(tool.id)) continue;
      const hit = tool.aliases.some((a) => text.includes(a.toLowerCase()));
      if (hit) matched.set(tool.id, tool);
    }
  }
  return Array.from(matched.values());
}

// ── 환경/인력/선택 항목 (구매 대상 아님) ──────────────────────
// 어떤 도구에도 매칭 안 되지만 "장비"가 아닌 것: 공간·인력·선택·맨손.
// "준비 완료" 판정을 막지 않도록 별도 분류.
export const AMBIENT_HINTS = [
  "좌석",
  "바닥",
  "공간",
  "원형 배치",
  "평평",
  "보조자",
  "보조 인력",
  "보조 지팡이",
  "도구 없이",
  "도구 x",
  "손만",
  "(선택)",
  "필요 시",
  "점수 영역",
  "골 표시",
];

export function isAmbientMaterial(material: string): boolean {
  const t = material.toLowerCase();
  return AMBIENT_HINTS.some((h) => t.includes(h.toLowerCase()));
}

export interface MaterialMatching {
  /** alias로 도구에 매칭된 항목 (중복 제거) */
  matched: ToolDef[];
  /** 도구 매칭 실패 + 환경/인력/선택도 아닌 = 미등록 "장비" (직접 확인 필요) */
  unmatchedEquipment: string[];
  /** 도구 매칭 실패지만 공간·인력·선택 등 구매 불필요 항목 수 */
  ambientCount: number;
}

// 게임의 모든 materials를 3분류: 매칭 도구 / 미등록 장비 / 환경·인력.
// MaterialChips의 "준비 완료" 판정과 미등록 표시에 사용.
export function getMaterialMatching(
  game: Game,
  tools: ToolDef[],
): MaterialMatching {
  const matched = new Map<string, ToolDef>();
  const unmatchedEquipment: string[] = [];
  let ambientCount = 0;

  for (const m of game.materials) {
    const text = m.toLowerCase();
    const hits = tools.filter((t) =>
      t.aliases.some((a) => text.includes(a.toLowerCase())),
    );
    if (hits.length === 0) {
      if (isAmbientMaterial(m)) ambientCount += 1;
      else unmatchedEquipment.push(m);
    } else {
      for (const h of hits) if (!matched.has(h.id)) matched.set(h.id, h);
    }
  }

  return {
    matched: Array.from(matched.values()),
    unmatchedEquipment,
    ambientCount,
  };
}

// 역방향: 한 도구를 쓰는 게임들
export function getGamesForTool(
  toolId: string,
  tools: ToolDef[],
  games: Game[],
): Game[] {
  const tool = tools.find((t) => t.id === toolId);
  if (!tool) return [];
  const aliases = tool.aliases.map((a) => a.toLowerCase());
  return games.filter((g) =>
    g.materials.some((m) => {
      const text = m.toLowerCase();
      return aliases.some((a) => text.includes(a));
    }),
  );
}

// 한 게임 → 도구 ID 목록 (캐싱용)
export function getToolIdsForGame(game: Game, tools: ToolDef[]): string[] {
  return getToolsForGame(game, tools).map((t) => t.id);
}
