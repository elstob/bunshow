import { useCallback, useEffect, useState } from "react";

export type FontStyle = "classical" | "modern";

const STORAGE_KEY = "bunshow-font-style";

function getStoredFontStyle(): FontStyle {
  if (typeof window === "undefined") {
    return "classical";
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "classical" || stored === "modern") {
      return stored;
    }
  } catch {
    // ignore storage failures
  }

  return "classical";
}

export function useFontStyle() {
  const [fontStyle, setFontStyle] = useState<FontStyle>("classical");

  useEffect(() => {
    setFontStyle(getStoredFontStyle());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, fontStyle);
    } catch {
      // ignore storage failures
    }
  }, [fontStyle]);

  const toggle = useCallback(() => {
    setFontStyle((current) => (current === "classical" ? "modern" : "classical"));
  }, []);

  return { fontStyle, toggle };
}
