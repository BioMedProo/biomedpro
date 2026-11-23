import { useState } from "react";
import { motion } from "framer-motion";
import type { Item, Category } from "@/data/catalog";
import { NEUTRALS } from "@/data/config";

interface Slot {
  category: Category;
  width: string;
  top: string;
  left: string;
  rotate: number;
  zIndex: number;
}

const DRESS_TEMPLATE: Slot[] = [
  { category: "dress", width: "58%", top: "4%", left: "21%", rotate: -2, zIndex: 2 },
  { category: "shoes", width: "34%", top: "56%", left: "8%", rotate: 3, zIndex: 3 },
  { category: "bag", width: "32%", top: "54%", left: "58%", rotate: -3, zIndex: 3 },
  { category: "accessory", width: "20%", top: "72%", left: "40%", rotate: 2, zIndex: 4 },
];

const TWO_PIECE_TEMPLATE: Slot[] = [
  { category: "top", width: "44%", top: "3%", left: "30%", rotate: -2, zIndex: 2 },
  { category: "bottom", width: "48%", top: "30%", left: "26%", rotate: 2, zIndex: 1 },
  { category: "shoes", width: "32%", top: "60%", left: "8%", rotate: -3, zIndex: 3 },
  { category: "bag", width: "30%", top: "58%", left: "60%", rotate: 3, zIndex: 3 },
  { category: "accessory", width: "18%", top: "76%", left: "42%", rotate: -2, zIndex: 4 },
];

interface LookCollageProps {
  items: Item[];
  variant?: "full" | "mini";
  onItemTap?: (item: Item) => void;
}

export function LookCollage({ items, variant = "full", onItemTap }: LookCollageProps) {
  const isDress = items.some((i) => i.category === "dress");
  const slots = isDress ? DRESS_TEMPLATE : TWO_PIECE_TEMPLATE;
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg bg-cream ${
        variant === "mini" ? "aspect-[4/5]" : "aspect-[4/5]"
      }`}
    >
      {slots.map((slot, idx) => {
        const item = items.find((i) => i.category === slot.category);
        if (!item) return null;
        const rot = ((idx % 3) - 1) * 4 || slot.rotate;
        return (
          <motion.div
            key={item.id}
            initial={
              variant === "full"
                ? { opacity: 0, y: 24, rotate: rot + 6 }
                : { opacity: 0 }
            }
            animate={{ opacity: 1, y: 0, rotate: rot }}
            transition={{
              delay: variant === "full" ? 0.08 * idx : 0,
              duration: 0.4,
              ease: "easeOut",
            }}
            className="absolute"
            style={{
              width: slot.width,
              top: slot.top,
              left: slot.left,
              zIndex: slot.zIndex,
            }}
          >
            <button
              type="button"
              onClick={() => onItemTap?.(item)}
              disabled={!onItemTap}
              className={`block w-full ${onItemTap ? "cursor-pointer" : "cursor-default"}`}
              aria-label={`Ver detalle de ${item.name}`}
            >
              {failed[item.id] ? (
                <div
                  className="flex aspect-[3/4] w-full items-center justify-center rounded border border-line/40 p-1 text-center text-[10px] text-white"
                  style={{
                    backgroundColor: item.colorHex,
                    color: NEUTRALS.includes(item.color) ? "#151515" : "#FFFFFF",
                  }}
                >
                  {item.name}
                </div>
              ) : (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  crossOrigin="anonymous"
                  className="w-full rounded-sm mix-blend-multiply"
                  style={{
                    aspectRatio: item.category === "dress" ? "2/3" : item.category === "shoes" || item.category === "bag" || item.category === "accessory" ? "1/1" : "3/4",
                    objectFit: "cover",
                    filter: "drop-shadow(0 2px 4px rgba(21,21,21,0.12))",
                  }}
                  onError={() => setFailed((f) => ({ ...f, [item.id]: true }))}
                />
              )}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
