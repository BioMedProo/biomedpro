import catalogData from "./catalog.json";
import { NEUTRALS } from "./config";

export interface Item {
  id: string;
  name: string;
  category: Category;
  color: string;
  colorHex: string;
  occasions: string[];
  brand: string;
  price: number;
  imageUrl: string;
  buyUrl: string;
  vip: boolean;
}

export interface Palette {
  id: string;
  name: string;
  colors: string[];
  vip: boolean;
}

export const catalog = catalogData as { items: Item[]; palettes: Palette[] };

export const ITEMS: Item[] = catalog.items;
export const PALETTES: Palette[] = catalog.palettes;

export type Category = "top" | "bottom" | "dress" | "shoes" | "bag" | "accessory";

export const CATEGORY_ORDER: Category[] = [
  "top",
  "bottom",
  "dress",
  "shoes",
  "bag",
  "accessory",
];

export const isNeutral = (color: string): boolean => NEUTRALS.includes(color);

export const itemById = (id: string): Item | undefined =>
  ITEMS.find((i) => i.id === id);

export const formatPrice = (price: number): string =>
  `${price.toFixed(2).replace(".", ",")} €`;
