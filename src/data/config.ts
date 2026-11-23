export const APP_NAME = "LOOKBOOK";
export const APP_TAGLINE = "¿Qué te pones hoy?";
export const SHARE_FOOTER_URL = "lookbook.app";
export const PRO_CHECKOUT_URL = "https://example.com/checkout";
export const FREE_SAVE_LIMIT = 20;
export const NEUTRALS = ["negro", "blanco-roto", "beige"];
export const PRO_CODES = ["LOOKBOOK-DEMO"];
export const PRO_PRICE_LABEL = "2,99 €/mes";
export const STORAGE_KEYS = {
  filters: "lookbook.filters.v1",
  saved: "lookbook.saved.v1",
  pro: "lookbook.pro",
  installs: "lookbook.looksGenerated",
} as const;

export type OccasionId =
  | "cumple-noche"
  | "restaurante"
  | "cita"
  | "uni-oficina"
  | "tardeo"
  | "fiesta";

export interface Occasion {
  id: OccasionId;
  label: string;
  emoji: string;
}

export const OCCASIONS: Occasion[] = [
  { id: "cumple-noche", label: "Cumpleaños de noche", emoji: "🎂" },
  { id: "restaurante", label: "Restaurante elegante", emoji: "🍽️" },
  { id: "cita", label: "Cita casual", emoji: "🥂" },
  { id: "uni-oficina", label: "Universidad / Oficina", emoji: "📚" },
  { id: "tardeo", label: "Tardeo con amigas", emoji: "☀️" },
  { id: "fiesta", label: "Fiesta / Discoteca", emoji: "🪩" },
];

export interface ColorDef {
  id: string;
  label: string;
  hex: string;
}

export const COLORS: ColorDef[] = [
  { id: "negro", label: "Negro", hex: "#151515" },
  { id: "blanco-roto", label: "Blanco roto", hex: "#F2EEE6" },
  { id: "beige", label: "Beige", hex: "#D8C7A9" },
  { id: "burdeos", label: "Burdeos", hex: "#6B1E2E" },
  { id: "verde-oliva", label: "Verde oliva", hex: "#6B6B3A" },
  { id: "dorado", label: "Dorado", hex: "#B8975A" },
  { id: "plata", label: "Plata", hex: "#BFC3C7" },
  { id: "azul-marino", label: "Azul marino", hex: "#1F2A44" },
  { id: "rosa-empolvado", label: "Rosa empolvado", hex: "#D9A6A6" },
  { id: "camel", label: "Camel", hex: "#B98B5E" },
];

export const colorLabel = (id: string): string =>
  COLORS.find((c) => c.id === id)?.label ?? id;

export const colorHex = (id: string): string =>
  COLORS.find((c) => c.id === id)?.hex ?? "#CCCCCC";

export const occasionLabel = (id: string): string =>
  OCCASIONS.find((o) => o.id === id)?.label ?? id;

export interface TemplateGroup {
  titles: string[];
  notes: string[];
}

export const TITLE_TEMPLATES: Record<string, string[]> = {
  "cumple-noche": [
    "Noche de Celebración",
    "Brindis Especial",
    "Fiesta Nocturna",
    "A Brindar por Hoy",
  ],
  restaurante: [
    "Cena con Estilo",
    "Mesa para Dos",
    "Elegancia para Cenar",
    "Plan Gourmet",
  ],
  cita: [
    "Primera Cita",
    "Cita Casual",
    "Quedada Encantadora",
    "Detalle Romántico",
  ],
  "uni-oficina": [
    "Día de Oficina",
    "Look Inteligente",
    "Entre Clases y Cafés",
    "Rutina Elegante",
  ],
  tardeo: [
    "Tardeo Dorado",
    "Luz de Tarde",
    "Plan de Tardes",
    "Paseo con Estilo",
  ],
  fiesta: [
    "Modo Fiesta",
    "Hasta el Amanecer",
    "Ritmo y Brillo",
    "Noche de Pista",
  ],
  generico: [
    "Noche en Madrid",
    "Elegancia Minimal",
    "Look del Día",
    "Estilo Editorial",
  ],
};

export const NOTE_TEMPLATES: Record<string, string[]> = {
  "cumple-noche": [
    "El {colores} crea un contraste sofisticado que favorece de noche; {prenda} es la pieza protagonista y el resto se mantiene sencillo para que el look respire.",
    "Para {ocasion}, {prenda} marca la diferencia; el {colores} aporta ese punto festivo sin recargar el conjunto.",
    "{prenda} eleva el look al instante; el equilibrio del {colores} hace que sea perfecto para celebrar.",
  ],
  restaurante: [
    "El {colores} crea un contraste sofisticado que favorece de noche; {prenda} es la pieza protagonista y el resto se mantiene sencillo para que el look respire.",
    "Para {ocasion}, {prenda} aporta la elegancia justa; el {colores} mantiene la sobriedad con un toque especial.",
    "{prenda} da la nota refinada; el {colores} redondea un look perfecto para una cena memorable.",
  ],
  cita: [
    "{prenda} transmite naturalidad y encanto; el {colores} suaviza el conjunto ideal para {ocasion}.",
    "El {colores} crea un contraste sofisticado y {prenda} se convierte en la pieza que recordaré.",
    "Para {ocasion}, menos es más: {prenda} protagonista y el {colores} para el equilibrio.",
  ],
  "uni-oficina": [
    "{prenda} aporta ese aire pulido; el {colores} mantiene el look versátil para {ocasion}.",
    "El {colores} funciona como base neutral y {prenda} da el carácter al conjunto.",
    "Para {ocasion}, {prenda} es la inversión que lo resuelve todo; el resto son básicos.",
  ],
  tardeo: [
    "{prenda} da esa frescura perfecta para {ocasion}; el {colores} acompaña la luz de la tarde.",
    "El {colores} se ve increíble con la luz dorada; {prenda} mantiene el conjunto cómodo y estiloso.",
    "Para {ocasion}, {prenda} suma estilo sin esfuerzo y el {colores} equilibra la propuesta.",
  ],
  fiesta: [
    "El {colores} brilla bajo las luces; {prenda} es la pieza que marcará la diferencia en {ocasion}.",
    "{prenda} roba todas las miradas; el {colores} crea un contraste dramático ideal para {ocasion}.",
    "Para {ocasion}, apuesta por {prenda} y deja que el {colores} haga el resto del trabajo.",
  ],
  generico: [
    "El {colores} crea un contraste sofisticado que favorece de noche; {prenda} es la pieza protagonista y el resto se mantiene sencillo para que el look respire.",
    "{prenda} es el punto de partida y el {colores} completa la historia con elegancia.",
    "Un look equilibrado: {prenda} aporta el carácter y el {colores} lo une todo con naturalidad.",
  ],
};

export const pick = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
