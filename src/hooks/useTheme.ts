import { useState, useEffect, useCallback } from "react";

export type ThemeMode = "light" | "dark";
export type ThemePalette = "classic" | "sakura";

interface ThemeSelection {
  mode: ThemeMode;
  palette: ThemePalette;
}

const STORAGE_KEY = "bunshow-theme";

function getPreferredThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialThemeSelection(): ThemeSelection {
  if (typeof window === "undefined") {
    return { mode: "dark", palette: "classic" };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { mode: getPreferredThemeMode(), palette: "classic" };
    }

    if (raw === "light" || raw === "dark") {
      return { mode: raw, palette: "classic" };
    }

    const parsed = JSON.parse(raw) as Partial<ThemeSelection>;
    const mode: ThemeMode = parsed.mode === "light" ? "light" : "dark";
    const palette: ThemePalette =
      parsed.palette === "sakura" ? "sakura" : "classic";

    return { mode, palette };
  } catch {
    return { mode: getPreferredThemeMode(), palette: "classic" };
  }
}

export function useTheme() {
  const [selection, setSelection] = useState<ThemeSelection>({
    mode: "dark",
    palette: "classic",
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSelection(getInitialThemeSelection());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    root.classList.remove("mode-light", "mode-dark", "palette-classic", "palette-sakura");
    root.classList.add(
      selection.mode === "dark" ? "mode-dark" : "mode-light",
      selection.palette === "sakura" ? "palette-sakura" : "palette-classic"
    );

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch {
      // ignore storage failures
    }
  }, [selection, hydrated]);

  const setTheme = useCallback((palette: ThemePalette, mode: ThemeMode) => {
    setSelection({ palette, mode });
  }, []);

  return {
    mode: selection.mode,
    palette: selection.palette,
    setTheme,
  };
}
