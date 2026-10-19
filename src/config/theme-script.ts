import { themeStorageKey, themes } from "./themes";

/** Inline script (runs before first paint) so a visitor's saved theme never flashes. Used once in the root layout. */
export function themeInitScript() {
  const data = Object.fromEntries(themes.map((t) => [t.id, t.vars]));
  return `try{var d=${JSON.stringify(data)};var id=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(id&&d[id]){var r=document.documentElement;r.dataset.theme=id;for(var k in d[id])r.style.setProperty('--color-'+k,d[id][k])}}catch(e){}`;
}
