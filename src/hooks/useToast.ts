import { useState, useCallback } from "react";
import { occasionLabel } from "@/data/config";

export interface Toast {
  id: number;
  message: string;
}

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToast({ id, message });
    setTimeout(() => {
      setToast((t) => (t && t.id === id ? null : t));
    }, 2500);
  }, []);

  return { toast, showToast };
}

export const describeOccasion = (occasion?: string): string =>
  occasion ? occasionLabel(occasion) : "Sin ocasión";
