"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, Palette } from "@phosphor-icons/react";
import { defaultThemeId, themeStorageKey, themes } from "@/config/themes";

const EVENT = "sv-theme-change";

function applyTheme(id: string) {
  const theme = themes.find((t) => t.id === id) ?? themes[0];
  const root = document.documentElement;
  for (const t of themes) for (const k of Object.keys(t.vars)) root.style.removeProperty(`--color-${k}`);
  for (const [k, v] of Object.entries(theme.vars)) root.style.setProperty(`--color-${k}`, v);
  root.dataset.theme = theme.id;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
const getSnapshot = () => {
  try {
    return localStorage.getItem(themeStorageKey) ?? defaultThemeId;
  } catch {
    return defaultThemeId;
  }
};
const getServerSnapshot = () => defaultThemeId;

export function ThemeSwitcher() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  function choose(id: string) {
    try {
      localStorage.setItem(themeStorageKey, id);
    } catch {
      /* private mode - still apply for this visit */
    }
    applyTheme(id);
    window.dispatchEvent(new Event(EVENT));
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change website colour theme"
        aria-expanded={open}
        title="Change colour theme"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-white/10 text-forge sm:h-11 sm:w-11 transition hover:bg-white/20"
      >
        <Palette size={22} weight="fill" />
      </button>
      {open && (
        <div className="fixed inset-x-4 top-[72px] z-50 overflow-hidden sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-60 rounded-xl border border-white/10 bg-white p-2 shadow-2xl">
          <p className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-widest text-steel">Website colour</p>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => choose(t.id)}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-navy-dark transition hover:bg-mist"
            >
              <span className="flex -space-x-1.5">
                {t.swatch.map((c) => (
                  <span key={c} className="h-5 w-5 rounded-full border-2 border-white shadow" style={{ background: c }} />
                ))}
              </span>
              <span className="flex-1 font-medium">{t.name}</span>
              {current === t.id && <Check size={16} className="text-furnace" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
