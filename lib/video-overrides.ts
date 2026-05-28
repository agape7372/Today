"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "today-video-overrides-v1";

// slug → 사용자가 직접 입력한 비디오 URL
// 값이 빈 문자열이거나 키가 없으면 mdx의 videoUrl 사용 (원본).
export type VideoOverrideMap = Record<string, string>;

function read(): VideoOverrideMap {
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

function write(m: VideoOverrideMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(m));
    window.dispatchEvent(new Event("video-overrides-changed"));
  } catch {
    /* quota */
  }
}

// URL 형식 점검 — 허용: 빈 문자열, instagram.com, youtube.com, youtu.be
export function isValidVideoUrl(url: string): boolean {
  const trimmed = url.trim();
  if (trimmed === "") return true; // 빈 문자열 = override 제거
  return /^https?:\/\/(www\.)?(instagram\.com|instagr\.am|youtube\.com|youtu\.be)\//i.test(
    trimmed,
  );
}

export function useVideoOverrides() {
  const [overrides, setOverrides] = useState<VideoOverrideMap>({});

  useEffect(() => {
    setOverrides(read());
    const onChange = () => setOverrides(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) onChange();
    };
    window.addEventListener("video-overrides-changed", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("video-overrides-changed", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // 한 게임의 효과적 URL 반환 (override 우선, 없으면 default)
  const resolve = useCallback(
    (slug: string, defaultUrl?: string): string | undefined => {
      const ov = overrides[slug];
      if (ov && ov.trim()) return ov;
      return defaultUrl;
    },
    [overrides],
  );

  const set = useCallback((slug: string, url: string) => {
    const m = read();
    const trimmed = url.trim();
    if (trimmed === "") {
      delete m[slug];
    } else {
      m[slug] = trimmed;
    }
    write(m);
    setOverrides({ ...m });
  }, []);

  const reset = useCallback((slug: string) => {
    const m = read();
    delete m[slug];
    write(m);
    setOverrides({ ...m });
  }, []);

  const clearAll = useCallback(() => {
    write({});
    setOverrides({});
  }, []);

  return {
    overrides,
    resolve,
    set,
    reset,
    clearAll,
    count: Object.keys(overrides).length,
  };
}
