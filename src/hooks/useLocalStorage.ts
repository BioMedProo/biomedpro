import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS, FREE_SAVE_LIMIT, occasionLabel } from "@/data/config";
import { itemById, type Item } from "@/data/catalog";
import type { Look } from "@/lib/generateLook";

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // almacenamiento lleno o no disponible: se ignora silenciosamente
  }
}

export function usePro() {
  const [isPro, setIsPro] = useState<boolean>(() =>
    readJSON<boolean>(STORAGE_KEYS.pro, false),
  );

  const activatePro = useCallback(() => {
    writeJSON(STORAGE_KEYS.pro, true);
    setIsPro(true);
  }, []);

  const deactivatePro = useCallback(() => {
    writeJSON(STORAGE_KEYS.pro, false);
    setIsPro(false);
  }, []);

  return { isPro, activatePro, deactivatePro };
}

export interface SavedLook {
  id: string;
  itemIds: string[];
  title: string;
  note: string;
  occasion?: string;
  paletteColors: string[];
  createdAt: number;
}

export function useSavedLooks(isPro: boolean) {
  const [saved, setSaved] = useState<SavedLook[]>(() =>
    readJSON<SavedLook[]>(STORAGE_KEYS.saved, []),
  );
  const [limitReached, setLimitReached] = useState(false);

  const persist = useCallback((next: SavedLook[]) => {
    setSaved(next);
    writeJSON(STORAGE_KEYS.saved, next);
  }, []);

  const isSaved = useCallback(
    (signature: string) => saved.some((s) => s.signature === signature),
    [saved],
  );

  const toggleSave = useCallback(
    (look: Look & { signature: string }): boolean => {
      const existing = saved.find((s) => s.signature === look.signature);
      if (existing) {
        persist(saved.filter((s) => s.signature !== look.signature));
        return false;
      }
      if (!isPro && saved.length >= FREE_SAVE_LIMIT) {
        setLimitReached(true);
        return false;
      }
      const entry: SavedLook & { signature: string } = {
        id: look.id,
        signature: look.signature,
        itemIds: look.items.map((i) => i.id),
        title: look.title,
        note: look.note,
        occasion: look.occasion,
        paletteColors: look.paletteColors,
        createdAt: Date.now(),
      };
      persist([entry, ...saved]);
      return true;
    },
    [saved, isPro, persist],
  );

  const removeSaved = useCallback(
    (id: string) => {
      persist(saved.filter((s) => s.id !== id));
    },
    [saved, persist],
  );

  const lookFromSaved = useCallback(
    (entry: SavedLook): Look | null => {
      const items = entry.itemIds
        .map((id) => itemById(id))
        .filter((i): i is Item => Boolean(i));
      if (items.length === 0) return null;
      return {
        id: entry.id,
        items,
        title: entry.title,
        note: entry.note,
        signature: entry.itemIds.slice().sort().join("-"),
        usedColors: Array.from(new Set(items.map((i) => i.color))),
        occasion: entry.occasion,
        paletteColors: entry.paletteColors,
      };
    },
    [],
  );

  const dismissLimitModal = useCallback(() => setLimitReached(false), []);

  return {
    saved,
    isSaved,
    toggleSave,
    removeSaved,
    lookFromSaved,
    limitReached,
    dismissLimitModal,
    remaining: Math.max(0, FREE_SAVE_LIMIT - saved.length),
  };
}

export function useFilters<T>(defaultValue: T) {
  const [filters, setFilters] = useState<T>(() =>
    readJSON<T>(STORAGE_KEYS.filters, defaultValue),
  );

  useEffect(() => {
    writeJSON(STORAGE_KEYS.filters, filters);
  }, [filters]);

  return [filters, setFilters] as const;
}

export function useLooksGenerated() {
  const [count, setCount] = useState<number>(() =>
    readJSON<number>(STORAGE_KEYS.installs, 0),
  );
  const increment = useCallback(() => {
    setCount((c) => {
      const next = c + 1;
      writeJSON(STORAGE_KEYS.installs, next);
      return next;
    });
  }, []);
  return { count, increment };
}

export function track(event: string, data?: Record<string, unknown>) {
  // Preparado para Plausible / Umami: aquí se enviaría el evento.
  console.debug(`[track] ${event}`, data ?? {});
}
