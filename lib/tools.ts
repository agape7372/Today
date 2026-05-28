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
