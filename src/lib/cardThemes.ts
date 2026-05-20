export type CardThemeLayout = "cinematic" | "journal" | "retro";

export type CardTheme = {
  id: string;
  name: string;
  description: string;
  layout: CardThemeLayout;
  background: string;
  preview: string;
  text: string;
  muted: string;
  accent: string;
  panel: string;
  panelText: string;
  swatches: string[];
};

export const CARD_THEMES = {
  aurora: {
    id: "aurora",
    name: "Aurora Boreal",
    description: "Magia natural",
    layout: "cinematic",
    background:
      "radial-gradient(circle at 20% 10%, rgba(45,212,191,.28), transparent 28%), radial-gradient(circle at 80% 0%, rgba(129,140,248,.28), transparent 30%), linear-gradient(180deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)",
    preview: "linear-gradient(135deg, #020617 0%, #134e4a 52%, #312e81 100%)",
    text: "#f8fbff",
    muted: "rgba(248,251,255,.68)",
    accent: "#2dd4bf",
    panel: "rgba(255,255,255,.1)",
    panelText: "#f8fbff",
    swatches: ["#020617", "#2dd4bf", "#818cf8"],
  },
  glitch: {
    id: "glitch",
    name: "Cyber Love",
    description: "Futurista e neon",
    layout: "retro",
    background:
      "linear-gradient(rgba(0,255,65,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,255,.08) 1px, transparent 1px), #050505",
    preview: "linear-gradient(135deg, #050505 0%, #112211 54%, #2b102b 100%)",
    text: "#00ff7f",
    muted: "rgba(0,255,127,.66)",
    accent: "#ff00cc",
    panel: "rgba(0,0,0,.74)",
    panelText: "#9cffc5",
    swatches: ["#050505", "#00ff7f", "#ff00cc"],
  },
  luxe: {
    id: "luxe",
    name: "Golden State",
    description: "Elegancia pura",
    layout: "cinematic",
    background:
      "radial-gradient(circle at 50% 0%, rgba(212,175,55,.2), transparent 28%), linear-gradient(180deg, #090909 0%, #17110a 100%)",
    preview: "linear-gradient(135deg, #090909 0%, #6d5420 100%)",
    text: "#f8e6a3",
    muted: "rgba(248,230,163,.66)",
    accent: "#d4af37",
    panel: "rgba(212,175,55,.1)",
    panelText: "#fff6d2",
    swatches: ["#090909", "#d4af37", "#fff6d2"],
  },
  scrapbook: {
    id: "scrapbook",
    name: "Memoria de Papel",
    description: "Colagem artistica",
    layout: "journal",
    background:
      "linear-gradient(90deg, rgba(0,0,0,.035) 1px, transparent 1px), linear-gradient(180deg, rgba(0,0,0,.035) 1px, transparent 1px), #f3f0e8",
    preview: "linear-gradient(135deg, #f3f0e8 0%, #decfbd 100%)",
    text: "#2b2b2b",
    muted: "rgba(43,43,43,.62)",
    accent: "#e11d48",
    panel: "rgba(255,255,255,.78)",
    panelText: "#2b2b2b",
    swatches: ["#f3f0e8", "#e11d48", "#2b2b2b"],
  },
  y2k: {
    id: "y2k",
    name: "Y2K Pop",
    description: "Vibe anos 2000",
    layout: "retro",
    background:
      "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 54%, #a1c4fd 100%)",
    preview: "linear-gradient(135deg, #ff9a9e 0%, #a1c4fd 100%)",
    text: "#7a006e",
    muted: "rgba(122,0,110,.64)",
    accent: "#00bcd4",
    panel: "rgba(255,255,255,.62)",
    panelText: "#35103d",
    swatches: ["#ff9a9e", "#00bcd4", "#7a006e"],
  },
  noir: {
    id: "noir",
    name: "Cinema Noir",
    description: "Dramatico P&B",
    layout: "cinematic",
    background:
      "linear-gradient(180deg, #09090b 0%, #292524 58%, #111111 100%)",
    preview: "linear-gradient(135deg, #050505 0%, #57534e 100%)",
    text: "#f5f5f4",
    muted: "rgba(245,245,244,.62)",
    accent: "#d6d3d1",
    panel: "rgba(255,255,255,.08)",
    panelText: "#f5f5f4",
    swatches: ["#050505", "#57534e", "#f5f5f4"],
  },
  zen: {
    id: "zen",
    name: "Jardim Zen",
    description: "Paz e natureza",
    layout: "journal",
    background: "linear-gradient(180deg, #e0e5df 0%, #f4f1e8 100%)",
    preview: "linear-gradient(135deg, #e0e5df 0%, #a2b29f 100%)",
    text: "#3f4f44",
    muted: "rgba(63,79,68,.62)",
    accent: "#798e7b",
    panel: "rgba(255,255,255,.7)",
    panelText: "#334139",
    swatches: ["#e0e5df", "#798e7b", "#3f4f44"],
  },
  birthday: {
    id: "birthday",
    name: "Gala Night Birthday",
    description: "Festa de gala",
    layout: "cinematic",
    background:
      "radial-gradient(circle at 20% 15%, rgba(251,191,36,.22), transparent 26%), linear-gradient(180deg, #1a0b2e 0%, #2d1b4e 58%, #1a0b2e 100%)",
    preview: "linear-gradient(135deg, #1a0b2e 0%, #fbbf24 100%)",
    text: "#fbbf24",
    muted: "rgba(251,191,36,.66)",
    accent: "#fbbf24",
    panel: "rgba(255,255,255,.1)",
    panelText: "#fff6d7",
    swatches: ["#1a0b2e", "#2d1b4e", "#fbbf24"],
  },
  easter: {
    id: "easter",
    name: "Jardim Encantado",
    description: "Magia de primavera",
    layout: "cinematic",
    background:
      "linear-gradient(180deg, #e0c3fc 0%, #c2e9fb 48%, #d4fc79 100%)",
    preview: "linear-gradient(135deg, #e0c3fc 0%, #d4fc79 100%)",
    text: "#5d4037",
    muted: "rgba(93,64,55,.62)",
    accent: "#ff8fab",
    panel: "rgba(255,255,255,.58)",
    panelText: "#5d4037",
    swatches: ["#e0c3fc", "#c2e9fb", "#d4fc79"],
  },
  junina: {
    id: "junina",
    name: "Arraia Afetum",
    description: "Noite de Sao Joao",
    layout: "journal",
    background:
      "linear-gradient(180deg, #1a237e 0%, #283593 48%, #080808 100%)",
    preview: "linear-gradient(135deg, #1a237e 0%, #ff5722 100%)",
    text: "#fff176",
    muted: "rgba(255,241,118,.68)",
    accent: "#ff5722",
    panel: "rgba(255,255,255,.1)",
    panelText: "#fff9c4",
    swatches: ["#1a237e", "#ff5722", "#fff176"],
  },
  kids: {
    id: "kids",
    name: "Mundo de Aventuras",
    description: "Infantil e ludico",
    layout: "cinematic",
    background:
      "linear-gradient(135deg, #f8d4ff 0%, #c9f7ff 52%, #fff3b0 100%)",
    preview: "linear-gradient(135deg, #f8d4ff 0%, #c9f7ff 100%)",
    text: "#2f265e",
    muted: "rgba(47,38,94,.62)",
    accent: "#ff7a59",
    panel: "rgba(255,255,255,.62)",
    panelText: "#2f265e",
    swatches: ["#f8d4ff", "#c9f7ff", "#ff7a59"],
  },
  minimalist: {
    id: "minimalist",
    name: "Minimalismo Puro",
    description: "Clean e moderno",
    layout: "cinematic",
    background: "linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)",
    preview: "linear-gradient(135deg, #ffffff 0%, #d1d5db 100%)",
    text: "#111111",
    muted: "rgba(17,17,17,.58)",
    accent: "#111111",
    panel: "rgba(255,255,255,.82)",
    panelText: "#111111",
    swatches: ["#ffffff", "#d1d5db", "#111111"],
  },
  vintage: {
    id: "vintage",
    name: "Retro Nostalgia",
    description: "Calor e memorias",
    layout: "cinematic",
    background: "linear-gradient(180deg, #e3d4c4 0%, #b9906d 100%)",
    preview: "linear-gradient(135deg, #e3d4c4 0%, #8b4513 100%)",
    text: "#5c4033",
    muted: "rgba(92,64,51,.62)",
    accent: "#8b4513",
    panel: "rgba(255,248,238,.62)",
    panelText: "#5c4033",
    swatches: ["#e3d4c4", "#8b4513", "#5c4033"],
  },
} as const satisfies Record<string, CardTheme>;

export type CardThemeId = keyof typeof CARD_THEMES;

export const DEFAULT_CARD_THEME_ID: CardThemeId = "aurora";

export const cardThemeOptions = Object.values(CARD_THEMES);

export const resolveCardThemeId = (value: unknown): CardThemeId => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized in CARD_THEMES) return normalized as CardThemeId;
  }

  return DEFAULT_CARD_THEME_ID;
};

export const getCardTheme = (value: unknown) =>
  CARD_THEMES[resolveCardThemeId(value)];

export const paletteByThemeId = (
  themeId: CardThemeId,
): "night" | "sage" | "rose" | "amber" | "teal" | "indigo" => {
  if (themeId === "zen") return "sage";
  if (
    themeId === "scrapbook" ||
    themeId === "vintage" ||
    themeId === "easter" ||
    themeId === "junina"
  )
    return "amber";
  if (themeId === "glitch") return "teal";
  if (
    themeId === "aurora" ||
    themeId === "noir" ||
    themeId === "luxe" ||
    themeId === "birthday"
  )
    return "night";
  if (themeId === "y2k" || themeId === "kids") return "indigo";
  return "rose";
};

export const themeIdByPalette = (palette: unknown): CardThemeId => {
  if (palette === "sage") return "zen";
  if (palette === "amber") return "scrapbook";
  if (palette === "teal") return "glitch";
  if (palette === "indigo") return "y2k";
  if (palette === "night") return "aurora";
  return "vintage";
};
