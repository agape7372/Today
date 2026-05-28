"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "today-favorites-v1";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function write(s: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(Array.from(s)));
    window.dispatchEvent(new Event("favorites-changed"));
  } catch {
    /* quota exceeded — ignore */
  }
}

// 모든 즐겨찾기 slug 반환 (React state 동기화)
export function useFavorites() {
  const [favs, setFavs] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setFavs(read());
    const onChange = () => setFavs(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) onChange();
    };
    window.addEventListener("favorites-changed", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("favorites-changed", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const s = read();
    if (s.has(slug)) s.delete(slug);
    else s.add(slug);
    write(s);
    setFavs(new Set(s));
  }, []);

  const has = useCallback((slug: string) => favs.has(slug), [favs]);

  return { favs, has, toggle, count: favs.size };
}
