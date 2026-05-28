"use client";

import { useEffect, useState, useCallback } from "react";

const KEY = "today-inventory-v1";

export type InventoryCondition = "good" | "low" | "damaged" | "lost";

export interface InventoryEntry {
  owned: boolean;
  quantity?: number;
  condition?: InventoryCondition;
  notes?: string;
  updatedAt?: string; // ISO
}

export type InventoryMap = Record<string, InventoryEntry>;

function read(): InventoryMap {
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

function write(m: InventoryMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(m));
    window.dispatchEvent(new Event("inventory-changed"));
  } catch {
    /* quota */
  }
}

export function useInventory() {
  const [inv, setInv] = useState<InventoryMap>({});

  useEffect(() => {
    setInv(read());
    const onChange = () => setInv(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) onChange();
    };
    window.addEventListener("inventory-changed", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("inventory-changed", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const get = useCallback(
    (toolId: string): InventoryEntry | undefined => inv[toolId],
    [inv],
  );

  const isOwned = useCallback(
    (toolId: string): boolean => Boolean(inv[toolId]?.owned),
    [inv],
  );

  const setEntry = useCallback(
    (toolId: string, patch: Partial<InventoryEntry>) => {
      const m = read();
      m[toolId] = {
        ...(m[toolId] ?? { owned: false }),
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      write(m);
      setInv({ ...m });
    },
    [],
  );

  const toggleOwned = useCallback((toolId: string) => {
    const m = read();
    const current = m[toolId]?.owned ?? false;
    m[toolId] = {
      ...(m[toolId] ?? {}),
      owned: !current,
      updatedAt: new Date().toISOString(),
    };
    write(m);
    setInv({ ...m });
  }, []);

  const clearAll = useCallback(() => {
    write({});
    setInv({});
  }, []);

  const ownedCount = Object.values(inv).filter((e) => e.owned).length;

  return { inv, get, isOwned, setEntry, toggleOwned, clearAll, ownedCount };
}
