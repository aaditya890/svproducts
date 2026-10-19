/**
 * WEBSITE COLOUR THEMES
 * ------------------------------------------------------------------
 * Visitors pick one from the palette button in the header (saved in their browser).
 * To add a theme: copy one block, give it a new id/name and change the colours.
 * "default" has no overrides - its colours live in src/app/globals.css.
 *
 *  navy / navy-dark / steel : header, footer, dark sections
 *  forge / sun              : highlight colour on dark backgrounds
 *  furnace                  : buttons and accents
 *  cream / mist             : light section backgrounds
 *  rust / charcoal          : small details
 */
export type Theme = {
  id: string;
  name: string;
  swatch: [string, string, string]; // 3 dots shown in the picker
  vars: Record<string, string>;
};

export const themes: Theme[] = [
  { id: "classic", name: "SV Classic", swatch: ["#1b2f5e", "#eabe4d", "#d76b0f"], vars: {} },
  {
    id: "sunrise",
    name: "Sunrise",
    swatch: ["#2a2a2e", "#f2a93b", "#e8590c"],
    vars: { navy: "#2a2a2e", "navy-dark": "#18181b", steel: "#52525b", forge: "#f2a93b", sun: "#ffd166", furnace: "#e8590c", cream: "#fff4e6", mist: "#f1f1f3", rust: "#9a3412", charcoal: "#18181b" },
  },
  {
    id: "ocean",
    name: "Ocean",
    swatch: ["#0b3c5d", "#7fd1e8", "#0e7c9b"],
    vars: { navy: "#0b3c5d", "navy-dark": "#062a40", steel: "#3b6f8f", forge: "#7fd1e8", sun: "#b4ecfa", furnace: "#0e7c9b", cream: "#eaf6fb", mist: "#eef3f6", rust: "#0b5c78", charcoal: "#0f2530" },
  },
  {
    id: "forest",
    name: "Forest",
    swatch: ["#14452f", "#c7d66d", "#d9731a"],
    vars: { navy: "#14452f", "navy-dark": "#0b2d1e", steel: "#3d6b57", forge: "#c7d66d", sun: "#e4ef7a", furnace: "#d9731a", cream: "#f4f7e8", mist: "#eef2ec", rust: "#7a3b0e", charcoal: "#14231b" },
  },
  {
    id: "royal",
    name: "Royal",
    swatch: ["#3b2a6b", "#f5c15d", "#d6336c"],
    vars: { navy: "#3b2a6b", "navy-dark": "#261a4a", steel: "#5b4b8a", forge: "#f5c15d", sun: "#ffdc8a", furnace: "#d6336c", cream: "#fbf3ff", mist: "#f1eef7", rust: "#8a1c4a", charcoal: "#1d1533" },
  },
  {
    id: "ruby",
    name: "Ruby",
    swatch: ["#7a1424", "#f4c27a", "#d12d2d"],
    vars: { navy: "#7a1424", "navy-dark": "#4f0b17", steel: "#8a3a47", forge: "#f4c27a", sun: "#ffd9a0", furnace: "#c42222", cream: "#fff3ee", mist: "#f6efef", rust: "#5c0f1a", charcoal: "#2a0d12" },
  },
];

export const defaultThemeId = "classic";
export const themeStorageKey = "sv-theme";
