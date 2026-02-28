import { useState, useCallback, useMemo, useEffect } from "react";
import type { JLPTLevel, GrammarWeakness } from "../types";

const STORAGE_KEY = "bunshow-grammar-weaknesses";

function loadWeaknesses(): GrammarWeakness[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWeaknesses(weaknesses: GrammarWeakness[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weaknesses));
  } catch {
    // ignore storage failures
  }
}

export function useGrammarTracker() {
  const [weaknesses, setWeaknesses] = useState<GrammarWeakness[]>([]);

  useEffect(() => {
    setWeaknesses(loadWeaknesses());
  }, []);

  const recordMiss = useCallback((point: string, level: JLPTLevel) => {
    setWeaknesses((prev) => {
      const existing = prev.find((w) => w.point === point);
      let next: GrammarWeakness[];

      if (existing) {
        next = prev.map((w) =>
          w.point === point ? { ...w, missCount: w.missCount + 1 } : w
        );
      } else {
        next = [...prev, { point, level, missCount: 1 }];
      }

      saveWeaknesses(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
    setWeaknesses([]);
  }, []);

  const sorted = useMemo(
    () => [...weaknesses].sort((a, b) => b.missCount - a.missCount),
    [weaknesses]
  );

  return { weaknesses: sorted, recordMiss, clearAll };
}
