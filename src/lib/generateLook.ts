import { ITEMS, type Category, type Item, isNeutral } from "@/data/catalog";
import {
  NEUTRALS,
  TITLE_TEMPLATES,
  NOTE_TEMPLATES,
  colorLabel,
  pick,
} from "@/data/config";

export interface GenerateInput {
  occasion?: string;
  paletteColors?: string[];
  excludeSignatures?: Set<string>;
  isPro: boolean;
  lockedItems?: Partial<Record<Category, Item>>;
}

export interface Look {
  id: string;
  items: Item[];
  title: string;
  note: string;
  signature: string;
  usedColors: string[];
  occasion?: string;
  paletteColors: string[];
  relaxed?: boolean;
  reset?: boolean;
}

export const hasDressStructure = (
  pool: Item[],
  isPro: boolean,
): boolean => {
  const ok = (i: Item) => (!i.vip || isPro);
  return (
    pool.some((i) => i.category === "dress" && ok(i)) &&
    pool.some((i) => i.category === "shoes" && ok(i)) &&
    pool.some((i) => i.category === "bag" && ok(i))
  );
};

export const hasTwoPieceStructure = (
  pool: Item[],
  isPro: boolean,
): boolean => {
  const ok = (i: Item) => (!i.vip || isPro);
  return (
    pool.some((i) => i.category === "top" && ok(i)) &&
    pool.some((i) => i.category === "bottom" && ok(i)) &&
    pool.some((i) => i.category === "shoes" && ok(i)) &&
    pool.some((i) => i.category === "bag" && ok(i))
  );
};

export const scoreItem = (
  item: Item,
  occasion?: string,
  paletteColors?: string[],
): number => {
  let score = 0;
  if (occasion && item.occasions.includes(occasion)) score += 3;
  if (paletteColors && paletteColors.length > 0) {
    if (paletteColors.includes(item.color)) score += 3;
    if (isNeutral(item.color)) score += 1;
    if (!paletteColors.includes(item.color) && !isNeutral(item.color))
      score -= 2;
  }
  return score;
};

const weightedPick = (candidates: Item[]): Item => {
  const weights = candidates.map((_, i) => 1 / (i + 1));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
};

const bestCandidates = (
  pool: Item[],
  occasion?: string,
  paletteColors?: string[],
): Item[] => {
  const scored = pool.map((item) => ({
    item,
    score: scoreItem(item, occasion, paletteColors),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.item);
};

export const itemPool = (isPro: boolean): Item[] =>
  ITEMS.filter((i) => isPro || !i.vip);

const pickForCategory = (
  category: Category,
  pool: Item[],
  occasion?: string,
  paletteColors?: string[],
  locked?: Item,
): Item[] => {
  if (locked && locked.category === category) return [locked];
  const inCategory = pool.filter((i) => i.category === category);
  if (inCategory.length === 0) return [];
  return bestCandidates(inCategory, occasion, paletteColors);
};

const buildTitleAndNote = (
  occasion: string | undefined,
  items: Item[],
  paletteColors: string[],
): { title: string; note: string } => {
  const key = occasion && TITLE_TEMPLATES[occasion] ? occasion : "generico";
  const protagonist =
    items.find((i) => i.category === "dress") ??
    items.find((i) => paletteColors.includes(i.color)) ??
    items[0];

  const colorNames =
    paletteColors.length > 0
      ? paletteColors.map(colorLabel).join(" + ").toLowerCase()
      : protagonist
        ? protagonist.name.toLowerCase()
        : "look";

  const occasionText = occasion
    ? occasionLabel(occasion)
    : "cualquier ocasión";

  const title = pick(TITLE_TEMPLATES[key] ?? TITLE_TEMPLATES.generico);
  const noteTpl = pick(NOTE_TEMPLATES[key] ?? NOTE_TEMPLATES.generico);
  const note = noteTpl
    .replace("{colores}", colorNames)
    .replace("{prenda}", protagonist ? protagonist.name.toLowerCase() : "la prenda")
    .replace("{ocasion}", occasionText.toLowerCase());

  return { title, note };
};

const makeSignature = (items: Item[]): string =>
  items
    .map((i) => i.id)
    .sort()
    .join("-");

const assemble = (
  useDress: boolean,
  pool: Item[],
  occasion: string | undefined,
  paletteColors: string[] | undefined,
  locked?: Partial<Record<Category, Item>>,
): Item[] => {
  const result: Item[] = [];
  if (useDress) {
    const candidates = pickForCategory(
      "dress",
      pool,
      occasion,
      paletteColors,
      locked?.dress,
    );
    if (candidates.length > 0) result.push(weightedPick(candidates));
  } else {
    for (const cat of ["top", "bottom"] as Category[]) {
      const candidates = pickForCategory(cat, pool, occasion, paletteColors, locked?.[cat]);
      if (candidates.length > 0) result.push(weightedPick(candidates));
    }
  }
  for (const cat of ["shoes", "bag"] as Category[]) {
    const candidates = pickForCategory(cat, pool, occasion, paletteColors, locked?.[cat]);
    if (candidates.length > 0) result.push(weightedPick(candidates));
  }
  const hasAcc = result.some((i) => i.category === "accessory");
  if (!hasAcc && !locked?.accessory) {
    if (Math.random() < 0.7) {
      const candidates = pickForCategory("accessory", pool, occasion, paletteColors);
      if (candidates.length > 0) result.push(weightedPick(candidates));
    }
  } else if (locked?.accessory) {
    result.push(locked.accessory);
  }
  return result;
};

export const generateLook = (input: GenerateInput): Look => {
  const { occasion, paletteColors, excludeSignatures, isPro, lockedItems } = input;
  const pool = itemPool(isPro);
  let relaxed = false;

  let occ = occasion;
  if (occasion) {
    // comprobar si hay suficientes prendas para la estructura con esa ocasión
    const possibleWithOccasion =
      (hasDressStructure(pool, isPro) || hasTwoPieceStructure(pool, isPro)) &&
      ["top", "bottom", "dress", "shoes", "bag"].some((cat) =>
        pool.some((i) => i.category === cat && i.occasions.includes(occasion)),
      );
    if (!possibleWithOccasion) {
      occ = undefined;
      relaxed = true;
    }
  }

  const useDress =
    hasDressStructure(pool, isPro) &&
    (!hasTwoPieceStructure(pool, isPro) || Math.random() < 0.5);

  const exclude = excludeSignatures ?? new Set<string>();
  let best: Look | null = null;

  for (let attempt = 0; attempt < 15; attempt++) {
    const items = assemble(useDress, pool, occ, paletteColors, lockedItems);
    const signature = makeSignature(items);
    const { title, note } = buildTitleAndNote(
      occ,
      items,
      paletteColors ?? [],
    );
    const look: Look = {
      id: `look-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      items,
      title,
      note,
      signature,
      usedColors: Array.from(new Set(items.map((i) => i.color))),
      occasion: occ,
      paletteColors: paletteColors ?? [],
      relaxed,
    };
    if (!exclude.has(signature)) {
      return look;
    }
    if (!best) best = look;
  }

  if (best) {
    return { ...best, reset: true };
  }

  // fallback absoluto
  const items = assemble(true, pool, undefined, undefined, lockedItems);
  const signature = makeSignature(items);
  const { title, note } = buildTitleAndNote(undefined, items, []);
  return {
    id: `look-${Date.now()}`,
    items,
    title,
    note,
    signature,
    usedColors: Array.from(new Set(items.map((i) => i.color))),
    paletteColors: [],
    relaxed,
    reset: true,
  };
};

export const regenerateCategory = (
  current: Look,
  category: Category,
  isPro: boolean,
): Look => {
  const currentItems = current.items.filter((i) => i.category !== category);
  const locked: Partial<Record<Category, Item>> = {};
  for (const i of currentItems) {
    locked[i.category] = i;
  }
  const pool = itemPool(isPro);
  const inCategory = pool.filter(
    (i) => i.category === category && !current.items.some((c) => c.id === i.id),
  );
  if (inCategory.length === 0) return current;
  const scored = bestCandidates(
    inCategory,
    current.occasion,
    current.paletteColors,
  );
  const chosen = weightedPick(scored);
  const items = [...currentItems, chosen].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category),
  );
  const signature = makeSignature(items);
  return {
    ...current,
    id: `look-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    items,
    signature,
    usedColors: Array.from(new Set(items.map((i) => i.color))),
  };
};

export { NEUTRALS };
