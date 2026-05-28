"use client";

import { useCallback, useEffect, useState } from "react";

const HASH_KEY = "today-pin-hash-v1";
const SESSION_KEY = "today-pin-session-v1";
const SESSION_MS = 24 * 60 * 60 * 1000; // 24h

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* quota */
  }
}

function safeRemove(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function hasPin(): boolean {
  return Boolean(safeGet(HASH_KEY));
}

export function isSessionValid(): boolean {
  const t = safeGet(SESSION_KEY);
  if (!t) return false;
  const elapsed = Date.now() - new Date(t).getTime();
  return elapsed >= 0 && elapsed < SESSION_MS;
}

function startSession() {
  safeSet(SESSION_KEY, new Date().toISOString());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("pin-session-changed"));
  }
}

export function endSession() {
  safeRemove(SESSION_KEY);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("pin-session-changed"));
  }
}

export async function setPin(pin: string): Promise<void> {
  const hash = await sha256(pin);
  safeSet(HASH_KEY, hash);
  startSession();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("pin-changed"));
  }
}

export async function verifyPin(pin: string): Promise<boolean> {
  const stored = safeGet(HASH_KEY);
  if (!stored) return false;
  const hash = await sha256(pin);
  if (hash === stored) {
    startSession();
    return true;
  }
  return false;
}

export async function changePin(
  oldPin: string,
  newPin: string,
): Promise<boolean> {
  const ok = await verifyPin(oldPin);
  if (!ok) return false;
  await setPin(newPin);
  return true;
}

export function removePin(): void {
  safeRemove(HASH_KEY);
  endSession();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("pin-changed"));
  }
}

export interface PinState {
  hasPin: boolean;
  unlocked: boolean;
  sessionExpiresAt?: string;
}

export function usePinState() {
  const [state, setState] = useState<PinState>({
    hasPin: false,
    unlocked: false,
  });

  const recompute = useCallback(() => {
    const t = safeGet(SESSION_KEY);
    const expiresAt = t
      ? new Date(new Date(t).getTime() + SESSION_MS).toISOString()
      : undefined;
    setState({
      hasPin: hasPin(),
      unlocked: isSessionValid(),
      sessionExpiresAt: expiresAt,
    });
  }, []);

  useEffect(() => {
    recompute();
    const handlers = ["pin-session-changed", "pin-changed"] as const;
    for (const h of handlers) window.addEventListener(h, recompute);
    window.addEventListener("storage", recompute);
    return () => {
      for (const h of handlers) window.removeEventListener(h, recompute);
      window.removeEventListener("storage", recompute);
    };
  }, [recompute]);

  return state;
}
