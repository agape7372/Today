"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "today-settings-v1";

export type FontScale = "sm" | "md" | "lg";

export interface Settings {
  fontScale: FontScale;
}

const DEFAULT: Settings = {
  fontScale: "md",
};

function read(): Settings {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const obj = JSON.parse(raw);
    return { ...DEFAULT, ...obj };
  } catch {
    return DEFAULT;
  }
}

function write(s: Settings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new Event("settings-changed"));
  } catch {
    /* quota */
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);

  useEffect(() => {
    setSettings(read());
    const onChange = () => setSettings(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) onChange();
    };
    window.addEventListener("settings-changed", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("settings-changed", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setFontScale = useCallback((scale: FontScale) => {
    const s = read();
    s.fontScale = scale;
    write(s);
    setSettings({ ...s });
  }, []);

  const reset = useCallback(() => {
    write(DEFAULT);
    setSettings(DEFAULT);
  }, []);

  return { settings, setFontScale, reset };
}

// <html> 에 data 속성 반영 (앱 전체에 폰트 크기 효과)
export function useApplyFontScale() {
  const { settings } = useSettings();
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute(
      "data-font-scale",
      settings.fontScale,
    );
  }, [settings.fontScale]);
}
