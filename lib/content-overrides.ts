"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Game } from "./types";

const KEY = "today-content-overrides-v1";

/** 게임 한 개의 사용자 편집분. 기본 틀(섹션 헤더)은 불변, 내용만 덮어씀. */
export interface ContentOverride {
  name?: string;
  summary?: string;
  /** 섹션 헤더(예: "준비") → 마크다운 내용. 헤더 자체는 키로만 쓰임. */
  sections?: Record<string, string>;
}

export type ContentOverrideMap = Record<string, ContentOverride>;

function read(): ContentOverrideMap {
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

function write(m: ContentOverrideMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(m));
    window.dispatchEvent(new Event("content-overrides-changed"));
  } catch {
    /* quota */
  }
}

/** 빈 객체/섹션 정리 — override가 사실상 비면 슬러그 키 제거. */
function prune(m: ContentOverrideMap, slug: string) {
  const o = m[slug];
  if (!o) return;
  if (o.sections && Object.keys(o.sections).length === 0) delete o.sections;
  if (
    o.name === undefined &&
    o.summary === undefined &&
    (!o.sections || Object.keys(o.sections).length === 0)
  ) {
    delete m[slug];
  }
}

export function useContentOverrides() {
  const [overrides, setOverrides] = useState<ContentOverrideMap>({});

  useEffect(() => {
    setOverrides(read());
    const onChange = () => setOverrides(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) onChange();
    };
    window.addEventListener("content-overrides-changed", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("content-overrides-changed", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setField = useCallback(
    (slug: string, field: "name" | "summary", value: string) => {
      const m = read();
      m[slug] = { ...(m[slug] ?? {}), [field]: value };
      write(m);
      setOverrides({ ...m });
    },
    [],
  );

  const resetField = useCallback((slug: string, field: "name" | "summary") => {
    const m = read();
    if (!m[slug]) return;
    delete m[slug][field];
    prune(m, slug);
    write(m);
    setOverrides({ ...m });
  }, []);

  const setSection = useCallback(
    (slug: string, heading: string, content: string) => {
      const m = read();
      const prev = m[slug] ?? {};
      m[slug] = {
        ...prev,
        sections: { ...(prev.sections ?? {}), [heading]: content },
      };
      write(m);
      setOverrides({ ...m });
    },
    [],
  );

  const resetSection = useCallback((slug: string, heading: string) => {
    const m = read();
    if (!m[slug]?.sections) return;
    delete m[slug].sections![heading];
    prune(m, slug);
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

  const getForGame = useCallback(
    (slug: string): ContentOverride | undefined => overrides[slug],
    [overrides],
  );

  const countOverrides = useMemo(() => {
    let n = 0;
    for (const s in overrides) {
      const o = overrides[s];
      if (o.name !== undefined) n += 1;
      if (o.summary !== undefined) n += 1;
      if (o.sections) n += Object.keys(o.sections).length;
    }
    return n;
  }, [overrides]);

  return {
    overrides,
    setField,
    resetField,
    setSection,
    resetSection,
    resetGame,
    clearAll,
    getForGame,
    countOverrides,
  };
}

/** 카탈로그·랜딩용 — name/summary override를 게임 배열에 반영. */
export function useGamesWithContent(games: Game[]): Game[] {
  const { overrides } = useContentOverrides();
  return useMemo(
    () =>
      games.map((g) => {
        const ov = overrides[g.slug];
        if (!ov || (ov.name === undefined && ov.summary === undefined)) return g;
        return {
          ...g,
          name: ov.name ?? g.name,
          summary: ov.summary ?? g.summary,
        };
      }),
    [games, overrides],
  );
}
