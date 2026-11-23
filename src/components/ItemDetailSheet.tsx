import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, ExternalLink } from "lucide-react";
import type { Item } from "@/data/catalog";
import { formatPrice } from "@/data/catalog";
import { OCCASIONS } from "@/data/config";
import { track } from "@/hooks/useLocalStorage";

interface ItemDetailSheetProps {
  item: Item | null;
  onClose: () => void;
  onChange: (item: Item) => void;
}

export function ItemDetailSheet({ item, onClose, onChange }: ItemDetailSheetProps) {
  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[480px] rounded-t-2xl bg-background p-5 pb-8"
            style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
            role="dialog"
            aria-label={`Detalle de ${item.name}`}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
            <button
              onClick={onClose}
              aria-label="Cerrar detalle"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-muted hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex gap-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                decoding="async"
                crossOrigin="anonymous"
                className="h-32 w-24 shrink-0 rounded border border-line object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wide text-muted">{item.brand}</p>
                <h3 className="mt-0.5 font-serif text-lg leading-tight text-ink">{item.name}</h3>
                <p className="mt-1 text-sm font-medium text-ink">{formatPrice(item.price)}</p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                  <span
                    className="h-3 w-3 rounded-full border border-line"
                    style={{ backgroundColor: item.colorHex }}
                    aria-hidden="true"
                  />
                  {item.color.replace("-", " ")}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {OCCASIONS.filter((o) => item.occasions.includes(o.id)).map((o) => (
                <span
                  key={o.id}
                  className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted"
                >
                  {o.emoji} {o.label}
                </span>
              ))}
            </div>

            <a
              href={item.buyUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => track("buy_clicked", { itemId: item.id })}
              className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded bg-accent text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Ver prenda <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <button
              onClick={() => onChange(item)}
              className="mt-2 flex min-h-[48px] w-full items-center justify-center gap-2 rounded border border-ink/20 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Cambiar esta prenda
            </button>
            <p className="mt-3 text-center text-[11px] text-muted">
              Enlace de afiliado: puede generar una comisión sin coste para ti
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
