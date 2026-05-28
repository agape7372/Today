"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type { Game, GameTraits, TraitKey } from "./types";

const KEY = "today-trait-overrides-v1";

export type OverrideMap = Record<string, Partial<GameTraits>>;

function read(): OverrideMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

function write(m: OverrideMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(m));
    window.dispatchEvent(new Event("trait-overrides-changed"));
  } catch {
    /* quota */
  }
}

export function useTraitOverrides() {
  const [overrides, setOverrides] = useState<OverrideMap>({});

  useEffect(() => {
    setOverrides(read());
    const onChange = () => setOverrides(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) onChange();
    };
    window.addEventListener("trait-overrides-changed", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("trait-overrides-changed", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setTrait = useCallback(
    (slug: string, key: TraitKey, value: number) => {
      const m = read();
      const clamped = Math.max(1, Math.min(5, Math.round(value)));
      m[slug] = { ...(m[slug] ?? {}), [key]: clamped };
      write(m);
      setOverrides({ ...m });
    },
    [],
  );

  const resetTrait = useCallback((slug: string, key: TraitKey) => {
    const m = read();
    if (!m[slug]) return;
    const { [key]: _, ...rest } = m[slug];
    void _;
    if (Object.keys(rest).length === 0) {
      delete m[slug];
    } else {
      m[slug] = rest;
    }
    write(m);
    setOverrides({ ...m });
  }, []);

  const resetGame = useCallback((slug: string) => {
    const m = read();
    delete m[slug];
    write(m);
    setOverrides({ ...m });
  }, []);

  const clearAll = useCallback(() => {
    write({});
    setOverrides({});
  }, []);

  const countOverrides = useMemo(() => {
    let n = 0;
    for (const s in overrides) n += Object.keys(overrides[s]).length;
    return n;
  }, [overrides]);

  const getOverrideForGame = useCallback(
    (slug: string): Partial<GameTraits> | undefined => overrides[slug],
    [overrides],
  );

  return {
    overrides,
    setTrait,
    resetTrait,
    resetGame,
    clearAll,
    countOverrides,
    getOverrideForGame,
  };
}

// 게임 배열에 override 적용
export function useGamesWithOverrides(initialGames: Game[]): Game[] {
  const { overrides } = useTraitOverrides();
  return useMemo(
    () =>
      initialGames.map((g) => {
        const ov = overrides[g.slug];
        if (!ov) return g;
        return { ...g, traits: { ...g.traits, ...ov } };
      }),
    [initialGames, overrides],
  );
}
