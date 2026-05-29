"use client";

import { useCallback, useEffect, useState } from "react";

// '오늘 세션' 트레이 — 즐겨찾기(영구 북마크)와 별개로, 오늘 진행할 게임을
// "순서 있는" 묶음으로 담는다. favorites.ts와 같은 localStorage+이벤트 패턴이되
// Set이 아니라 순서가 의미 있는 배열로 보관.
const KEY = "today-session-v1";
const EVENT = "session-changed";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(list: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function useSession() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(read());
    const onChange = () => setSlugs(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) onChange();
    };
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const add = useCallback((slug: string) => {
    const list = read();
    if (!list.includes(slug)) {
      list.push(slug);
      write(list);
      setSlugs([...list]);
    }
  }, []);

  const remove = useCallback((slug: string) => {
    const list = read().filter((s) => s !== slug);
    write(list);
    setSlugs(list);
  }, []);

  const toggle = useCallback((slug: string) => {
    const list = read();
    const next = list.includes(slug)
      ? list.filter((s) => s !== slug)
      : [...list, slug];
    write(next);
    setSlugs(next);
  }, []);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  // index from→to 재배치 (드래그)
  const reorder = useCallback((from: number, to: number) => {
    const list = read();
    if (
      from < 0 ||
      to < 0 ||
      from >= list.length ||
      to >= list.length ||
      from === to
    )
      return;
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    write(list);
    setSlugs([...list]);
  }, []);

  // 한 칸 위/아래 이동 (터치 친화 대안)
  const move = useCallback((slug: string, dir: -1 | 1) => {
    const list = read();
    const i = list.indexOf(slug);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    write(list);
    setSlugs([...list]);
  }, []);

  const clear = useCallback(() => {
    write([]);
    setSlugs([]);
  }, []);

  return { slugs, add, remove, toggle, has, reorder, move, clear, count: slugs.length };
}
