import { createContext, useContext, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { usePro, useSavedLooks, useLooksGenerated, type SavedLook } from "@/hooks/useLocalStorage";

interface BioSavedEntry {
  id?: string;
  signature?: string;
  title?: string;
  items?: Array<{ id?: string; name?: string; category?: string }>;
}

interface AppContextValue {
  isPro: boolean;
  activatePro: () => void;
  saved: SavedLook[];
  toggleSave: (entry: any) => boolean;
  removeSaved: (id: string) => void;
  lookFromSaved: (entry: SavedLook) => any | null;
  limitReached: boolean;
  dismissLimitModal: () => void;
  remaining: number;
  looksGenerated: number;
  incrementLooks: () => void;
  savedSignatures: Set<string>;
  lookDescription: (entry: BioSavedEntry) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { isPro, activatePro } = usePro();
  const {
    saved,
    toggleSave,
    removeSaved,
    lookFromSaved,
    limitReached,
    dismissLimitModal,
    remaining,
  } = useSavedLooks(isPro);
  const { count, increment } = useLooksGenerated();

  const savedSignatures = useMemo(() => {
    const keys = saved.map((s) => {
      const item = s as unknown as BioSavedEntry;
      return item.signature ?? item.id ?? JSON.stringify(s);
    });
    return new Set(keys);
  }, [saved]);

  const lookDescription = useCallback((entry: BioSavedEntry) => {
    if (entry?.title) return entry.title;
    if (entry?.items?.length) {
      return entry.items
        .map((i) => i.name)
        .filter(Boolean)
        .slice(0, 2)
        .join(" · ");
    }
    return "Kit / Equipo BioMedPro";
  }, []);

  const value: AppContextValue = {
    isPro,
    activatePro,
    saved,
    toggleSave,
    removeSaved,
    lookFromSaved,
    limitReached,
    dismissLimitModal,
    remaining,
    looksGenerated: count,
    incrementLooks: increment,
    savedSignatures,
    lookDescription,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}

export type { SavedLook };